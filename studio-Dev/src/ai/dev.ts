import { config } from 'dotenv';
config();

import '@/ai/flows/generate-preliminary-expert-assessment.ts';
import '@/ai/flows/sanitize-llm-output.ts';
import '@/ai/flows/identify-best-expert-profiles.ts';
import '@/ai/flows/sanitize-llm-prompt.ts';
import '@/ai/flows/generate-decision-tree-for-evidence.ts';