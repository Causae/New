'use server';

/**
 * @fileOverview An AI agent that identifies the best expert profiles for a given case.
 *
 * - identifyBestExpertProfiles - A function that identifies the best expert profiles.
 * - IdentifyBestExpertProfilesInput - The input type for the identifyBestExpertProfiles function.
 * - IdentifyBestExpertProfilesOutput - The return type for the identifyBestExpertProfiles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyBestExpertProfilesInputSchema = z.object({
  caseDescription: z
    .string()
    .describe('A detailed description of the case for which an expert is needed.'),
});
export type IdentifyBestExpertProfilesInput = z.infer<
  typeof IdentifyBestExpertProfilesInputSchema
>;

const ExpertProfileSchema = z.object({
  name: z.string().describe('The name of the expert.'),
  profileUrl: z.string().describe('The URL of the expert profile.'),
  relevanceScore: z
    .number()
    .describe('A score indicating the relevance of the expert to the case.'),
});

const IdentifyBestExpertProfilesOutputSchema = z.object({
  internalProfiles: z
    .array(ExpertProfileSchema)
    .describe('The top 3 expert profiles from the internal database.'),
  externalProfiles: z
    .array(ExpertProfileSchema)
    .describe('The top 3 expert profiles sourced from the web.'),
});
export type IdentifyBestExpertProfilesOutput = z.infer<
  typeof IdentifyBestExpertProfilesOutputSchema
>;

export async function identifyBestExpertProfiles(
  input: IdentifyBestExpertProfilesInput
): Promise<IdentifyBestExpertProfilesOutput> {
  return identifyBestExpertProfilesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyBestExpertProfilesPrompt',
  input: {schema: IdentifyBestExpertProfilesInputSchema},
  output: {schema: IdentifyBestExpertProfilesOutputSchema},
  prompt: `You are an AI assistant helping lawyers find the best expert for their case.

  Given the following case description, identify the top 3 expert profiles from the internal database and the top 3 expert profiles sourced from the web.

  Case Description: {{{caseDescription}}}

  Format your response as a JSON object with "internalProfiles" and "externalProfiles" fields. Each field should be an array of expert profiles. Each expert profile should include the expert's name, profile URL, and a relevance score (0-100) indicating how well the expert matches the case description.
  `,
});

const identifyBestExpertProfilesFlow = ai.defineFlow(
  {
    name: 'identifyBestExpertProfilesFlow',
    inputSchema: IdentifyBestExpertProfilesInputSchema,
    outputSchema: IdentifyBestExpertProfilesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
