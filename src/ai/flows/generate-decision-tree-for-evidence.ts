'use server';
/**
 * @fileOverview Generates a structured decision tree for lawyers to identify necessary technical evidence, collection actions, and the legal impact of each element in their case.
 *
 * - generateDecisionTreeForEvidence - A function that generates the decision tree.
 * - GenerateDecisionTreeForEvidenceInput - The input type for the generateDecisionTreeForEvidence function.
 * - GenerateDecisionTreeForEvidenceOutput - The return type for the generateDecisionTreeForEvidence function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDecisionTreeForEvidenceInputSchema = z.object({
  caseDescription: z.string().describe('A detailed description of the case.'),
});
export type GenerateDecisionTreeForEvidenceInput = z.infer<typeof GenerateDecisionTreeForEvidenceInputSchema>;

const GenerateDecisionTreeForEvidenceOutputSchema = z.object({
  decisionTree: z.string().describe('A structured decision tree outlining necessary technical evidence, collection actions, and legal impact for each element in the case.'),
});
export type GenerateDecisionTreeForEvidenceOutput = z.infer<typeof GenerateDecisionTreeForEvidenceOutputSchema>;

export async function generateDecisionTreeForEvidence(input: GenerateDecisionTreeForEvidenceInput): Promise<GenerateDecisionTreeForEvidenceOutput> {
  return generateDecisionTreeForEvidenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDecisionTreeForEvidencePrompt',
  input: {schema: GenerateDecisionTreeForEvidenceInputSchema},
  output: {schema: GenerateDecisionTreeForEvidenceOutputSchema},
  prompt: `You are an AI legal assistant specializing in constructing decision trees for legal cases.

  Given the following case description, generate a structured decision tree that helps the lawyer identify:
  - Necessary technical evidence to collect.
  - Recommended actions for evidence collection.
  - The potential legal impact of each element within the case.

  Case Description: {{{caseDescription}}}
  \n  Format the decision tree in a clear and easily understandable manner.`,
});

const generateDecisionTreeForEvidenceFlow = ai.defineFlow(
  {
    name: 'generateDecisionTreeForEvidenceFlow',
    inputSchema: GenerateDecisionTreeForEvidenceInputSchema,
    outputSchema: GenerateDecisionTreeForEvidenceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
