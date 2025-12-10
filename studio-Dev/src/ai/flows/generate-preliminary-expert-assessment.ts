'use server';

/**
 * @fileOverview Generates a preliminary expert assessment based on the case description.
 *
 * - generatePreliminaryExpertAssessment - A function that generates the assessment.
 * - GeneratePreliminaryExpertAssessmentInput - The input type for the generatePreliminaryExpertAssessment function.
 * - GeneratePreliminaryExpertAssessmentOutput - The return type for the generatePreliminaryExpertAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePreliminaryExpertAssessmentInputSchema = z.object({
  caseDescription: z
    .string()
    .describe('Detailed description of the case provided by the lawyer.'),
});
export type GeneratePreliminaryExpertAssessmentInput = z.infer<
  typeof GeneratePreliminaryExpertAssessmentInputSchema
>;

const GeneratePreliminaryExpertAssessmentOutputSchema = z.object({
  assessment: z
    .string()
    .describe(
      'AI-powered preliminary expert assessment based on the case description.'
    ),
});
export type GeneratePreliminaryExpertAssessmentOutput = z.infer<
  typeof GeneratePreliminaryExpertAssessmentOutputSchema
>;

export async function generatePreliminaryExpertAssessment(
  input: GeneratePreliminaryExpertAssessmentInput
): Promise<GeneratePreliminaryExpertAssessmentOutput> {
  return generatePreliminaryExpertAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'preliminaryExpertAssessmentPrompt',
  input: {schema: GeneratePreliminaryExpertAssessmentInputSchema},
  output: {schema: GeneratePreliminaryExpertAssessmentOutputSchema},
  prompt: `Rôle : Vous êtes ingénieur-conseil judiciaire en [spécialité avocat] avec 20 ans d’expérience. Votre tâche est d’analyser l’affaire juridique suivante, de déterminer la nature technique de la preuve et de préparer l’avocat à interagir avec l’expert ou, au mieux, de se passer d’un expert.\n\nAffaire : {{{caseDescription}}}\n\nInstructions de sortie (format mémo) : Générez une sortie structurée contenant les sections suivantes :\n1. SAVEZ VOUS QUELLES PREUVES PEUVENT APPUYER LES FAITS ?\n   - Décrire les potentielles preuves que le client a en sa possession (ex : les logs qui recensent les trafics anormaux, le header de l’email qui contient des informations révélatrices, les plans de construction de l’immeuble effondré).\n2. SAVEZ VOUS COMMENT LES COLLECTEZ ? QUE DEMANDER A L’EXPERT ?\n   - Liste de 5 questions techniques précises à poser à son client ou à l’expert pour orienter l’expertise et la collecte de preuves potentielles les plus probables. Ne pas proposer des questions si elles ne sont pas pertinentes à 95 %.\n3. COMPRENEZ VOUS CE QUE CES PREUVES PEUVENT SIGNIFIER ?\n   - Expliquer pour chaque preuve potentielle ce que cela signifie pour le client et sa posture face au litige (avantage ou inconvénient).\n   - Lister les éléments à demander immédiatement à son client ou à l’expert (ex : “image disque de l’ordinateur de l’accusé”, “contrats de maintenance logiciel”).\n4. TERMINOLOGIE TECHNIQUE DE BASE :\n   - Décrire 5 termes techniques importants et à comprendre pour résoudre l’affaire.\n5. PROFILS D’EXPERTS CIBLES :\n   - Décrire 3 profils d’experts spécifiques avec leurs domaines de compétences, leur expérience et les types d’expertises réalisées de préférence (ex : “expert en cyber-forensique, spécialité analyse de logs serveurs”).\n\nAdoptez un ton clair, opérationnel et concis pour permettre à l’avocat d’agir immédiatement.`,
});

const generatePreliminaryExpertAssessmentFlow = ai.defineFlow(
  {
    name: 'generatePreliminaryExpertAssessmentFlow',
    inputSchema: GeneratePreliminaryExpertAssessmentInputSchema,
    outputSchema: GeneratePreliminaryExpertAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
