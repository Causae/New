'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { generatePreliminaryExpertAssessment } from '@/ai/flows/generate-preliminary-expert-assessment';
import { generateDecisionTreeForEvidence } from '@/ai/flows/generate-decision-tree-for-evidence';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, BrainCircuit, BotMessageSquare } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function AnalysisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseDescription = searchParams.get('description') || '';
  const caseTitle = searchParams.get('title') || 'Your Case';

  const [assessment, setAssessment] = useState<string | null>(null);
  const [decisionTree, setDecisionTree] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseDescription) {
      setError('Case description is missing.');
      setIsLoading(false);
      return;
    }

    const runAnalysis = async () => {
      try {
        setIsLoading(true);
        const [assessmentResult, decisionTreeResult] = await Promise.all([
          generatePreliminaryExpertAssessment({ caseDescription }),
          generateDecisionTreeForEvidence({ caseDescription }),
        ]);

        if (assessmentResult?.assessment) {
          setAssessment(assessmentResult.assessment);
        }
        if (decisionTreeResult?.decisionTree) {
          setDecisionTree(decisionTreeResult.decisionTree);
        }
      } catch (e) {
        console.error(e);
        setError('An error occurred while running the AI analysis.');
      } finally {
        setIsLoading(false);
      }
    };

    runAnalysis();
  }, [caseDescription]);

  const handleNextStep = () => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace('/analysis', '/matching');
    router.push(`${newPath}?${searchParams.toString()}`);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">AI-Powered Case Analysis</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Here is the initial analysis for your case: "{caseTitle}".
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <BotMessageSquare className="w-8 h-8 text-primary" />
                    <div>
                        <CardTitle>Preliminary Expert Assessment</CardTitle>
                        <CardDescription>Strengths, weaknesses, and key points.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-foreground">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <p>{assessment}</p>
              )}
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
                <div className="flex items-center gap-3">
                    <BrainCircuit className="w-8 h-8 text-primary" />
                    <div>
                        <CardTitle>Evidence Decision Tree</CardTitle>
                        <CardDescription>A roadmap for evidence collection.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-xs bg-muted p-4 rounded-md">
                  {decisionTree}
                </pre>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center pt-8">
          <Button size="lg" onClick={handleNextStep} disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Proceed to Expert Matching'}
            {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
    return (
        <Suspense fallback={<p>Loading analysis...</p>}>
            <AnalysisContent />
        </Suspense>
    )
}
