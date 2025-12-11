'use server';
/**
 * @fileOverview Implements a flow to sanitize prompts before sending them to the LLM.
 *
 * - sanitizeLLMPrompt - A function that sanitizes the input prompt.
 * - SanitizeLLMPromptInput - The input type for the sanitizeLLMPrompt function.
 * - SanitizeLLMPromptOutput - The return type for the sanitizeLLMPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SanitizeLLMPromptInputSchema = z.string().describe('The prompt to be sanitized.');
export type SanitizeLLMPromptInput = z.infer<typeof SanitizeLLMPromptInputSchema>;

const SanitizeLLMPromptOutputSchema = z.string().describe('The sanitized prompt.');
export type SanitizeLLMPromptOutput = z.infer<typeof SanitizeLLMPromptOutputSchema>;

export async function sanitizeLLMPrompt(input: SanitizeLLMPromptInput): Promise<SanitizeLLMPromptOutput> {
  return sanitizeLLMPromptFlow(input);
}

const sanitizeLLMPromptFlow = ai.defineFlow(
  {
    name: 'sanitizeLLMPromptFlow',
    inputSchema: SanitizeLLMPromptInputSchema,
    outputSchema: SanitizeLLMPromptOutputSchema,
  },
  async input => {
    // Basic profanity filter (replace with a more sophisticated solution if needed)
    const sanitizedPrompt = input.replace(/(badword1|badword2|badword3)/gi, '****');
    return sanitizedPrompt;
  }
);
