'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { identifyBestExpertProfiles, type IdentifyBestExpertProfilesOutput } from '@/ai/flows/identify-best-expert-profiles';
import { PlaceHolderImages } from '@/lib/placeholder-images';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Users, Globe, Star, Award } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

type ExpertProfile = IdentifyBestExpertProfilesOutput['internalProfiles'][0];

const ExpertProfileCard = ({ profile, isBestMatch }: { profile: ExpertProfile, isBestMatch?: boolean }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSelect = () => {
        const currentPath = window.location.pathname;
        const newPath = currentPath.replace('/matching', '/schedule');
        router.push(`${newPath}?${searchParams.toString()}`);
    };
    
    // Find a random placeholder image
    const placeholderImage = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];

    return (
        <Card className={`relative transition-all ${isBestMatch ? 'border-primary ring-2 ring-primary' : ''}`}>
             {isBestMatch && (
                <Badge variant="secondary" className="absolute -top-3 left-4 flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Best Match
                </Badge>
            )}
            <CardHeader className="flex-row items-start gap-4">
                 <Image
                    src={placeholderImage.imageUrl}
                    alt={profile.name}
                    width={80}
                    height={80}
                    className="rounded-full border-2 border-muted"
                    data-ai-hint={placeholderImage.imageHint}
                />
                <div className="flex-1">
                    <CardTitle>{profile.name}</CardTitle>
                    <CardDescription>
                        <a href={profile.profileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block">
                            {profile.profileUrl}
                        </a>
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>Relevance Score</span>
                    <div className="flex items-center gap-1 font-semibold text-foreground">
                        <Star className="w-4 h-4 fill-secondary text-secondary" />
                        <span>{profile.relevanceScore}/100</span>
                    </div>
                </div>
                <Button className="w-full" onClick={handleSelect}>Select & Contact</Button>
            </CardContent>
        </Card>
    );
};

function MatchingContent() {
  const searchParams = useSearchParams();
  const caseDescription = searchParams.get('description') || '';

  const [profiles, setProfiles] = useState<IdentifyBestExpertProfilesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseDescription) {
      setError('Case description is missing.');
      setIsLoading(false);
      return;
    }

    const findExperts = async () => {
      try {
        setIsLoading(true);
        const result = await identifyBestExpertProfiles({ caseDescription });
        setProfiles(result);
      } catch (e) {
        console.error(e);
        setError('An error occurred while finding experts.');
      } finally {
        setIsLoading(false);
      }
    };

    findExperts();
  }, [caseDescription]);

  const allProfiles = [...(profiles?.internalProfiles || []), ...(profiles?.externalProfiles || [])];
  const bestMatch = allProfiles.sort((a, b) => b.relevanceScore - a.relevanceScore)[0];


  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const renderSkeletons = () => (
    Array.from({ length: 3 }).map((_, i) => (
      <Card key={i}>
        <CardHeader className="flex-row items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    ))
  );

  return (
     <div className="container mx-auto py-8">
      <div className="space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Expert Matching Results</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Our AI has identified the top potential experts for your case from our internal network and the web.
          </p>
        </div>

        <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6">
                <Users className="w-7 h-7 text-primary" />
                Internal Network Experts
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? renderSkeletons() : profiles?.internalProfiles.map(p => <ExpertProfileCard key={p.profileUrl} profile={p} isBestMatch={p === bestMatch} />)}
            </div>
        </div>

        <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3 mb-6">
                <Globe className="w-7 h-7 text-primary" />
                External Profiles Sourced
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? renderSkeletons() : profiles?.externalProfiles.map(p => <ExpertProfileCard key={p.profileUrl} profile={p} isBestMatch={p === bestMatch} />)}
            </div>
        </div>

      </div>
    </div>
  );
}

export default function MatchingPage() {
    return (
        <Suspense fallback={<p>Loading matching results...</p>}>
            <MatchingContent />
        </Suspense>
    )
}
