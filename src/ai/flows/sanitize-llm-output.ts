'use server';
/**
 * @fileOverview This file defines a Genkit flow to sanitize LLM outputs for secure data handling.
 *
 * The flow `sanitizeLLMOutput` takes a string as input, representing the LLM's raw output, and returns a sanitized string.
 * The sanitization process ensures that sensitive information is removed or masked to protect user privacy and data security.
 *
 * @exported
 * - `sanitizeLLMOutput`: The main function to sanitize LLM outputs.
 * - `SanitizeLLMOutputInput`: The input type for the sanitizeLLMOutput function.
 * - `SanitizeLLMOutputOutput`: The output type for the sanitizeLLMOutput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the sanitizeLLMOutput flow
const SanitizeLLMOutputInputSchema = z.string().describe('The raw output from the LLM to be sanitized.');
export type SanitizeLLMOutputInput = z.infer<typeof SanitizeLLMOutputInputSchema>;

// Define the output schema for the sanitizeLLMOutput flow
const SanitizeLLMOutputOutputSchema = z.string().describe('The sanitized output from the LLM.');
export type SanitizeLLMOutputOutput = z.infer<typeof SanitizeLLMOutputOutputSchema>;

// Define the sanitizeLLMOutput function that calls the flow
export async function sanitizeLLMOutput(input: SanitizeLLMOutputInput): Promise<SanitizeLLMOutputOutput> {
  return sanitizeLLMOutputFlow(input);
}

// Define the prompt to sanitize the LLM output
const sanitizeLLMOutputPrompt = ai.definePrompt({
  name: 'sanitizeLLMOutputPrompt',
  input: {schema: SanitizeLLMOutputInputSchema},
  output: {schema: SanitizeLLMOutputOutputSchema},
  prompt: `You are an AI assistant specialized in sanitizing text to remove potentially sensitive or unwanted information.

  Please sanitize the following text, redacting or removing any personal data, contact information, or other sensitive details. Replace redacted information with generic placeholders where appropriate.

  Text to sanitize: {{{input}}}
  `,
});

// Define the Genkit flow for sanitizing LLM output
const sanitizeLLMOutputFlow = ai.defineFlow(
  {
    name: 'sanitizeLLMOutputFlow',
    inputSchema: SanitizeLLMOutputInputSchema,
    outputSchema: SanitizeLLMOutputOutputSchema,
  },
  async input => {
    const {output} = await sanitizeLLMOutputPrompt(input);
    return output!;
  }
);
