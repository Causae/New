# **App Name**: CausaLink

## Core Features:

- Lawyer Authentication: Secure lawyer authentication via a registration/login form with double authentication using a 6-digit code sent to the provided email, creating or retrieving a user in the 'users' collection with 'avocat' as the role.
- Case Description Form: A detailed form for lawyers to input case information, adding a new case to the 'affaires' collection linked to the logged-in user's ID.
- Payment Integration: Integration with Stripe for a €49 payment upon case description validation, with a 'GRATEST' promo code option to bypass payment.
- AI-Powered Pre-Expertise Analysis: Generates a preliminary expert assessment using AI based on the case description, providing an initial analysis of the case.
- Expert Matching: An AI-powered tool using fuzzy matching to identify the best expert from the internal database and sourcing similar profiles from the web, presenting 3 internal and 3 external profiles to the lawyer.
- Expert Profile Comparison and Selection: Interface for lawyers to compare expert profiles and select the most suitable expert, initiating contact through a messaging agent. Includes messaging to set up first meeting.
- Secure Messaging System: A messaging system for communication between lawyers and experts, with all communications stored in a dedicated collection linked to the case, expert, and lawyer IDs. This includes an interface where experts are able to submit a price and a quote.
- Copilot for Follow-up and Traceability: Our Copilot handles follow-up and traceability for seamless and documented communication.
- Intelligent Comparator: Choose the right expert based on budget and timeline.
- sanitizeInput(): Anonymiser TOUT texte avant stockage.
- anonymizeDocument(): Pipeline OCR -> NER -> anonymisation.
- sanitizeForLLM(): Filtrer les prompts avant envoi à GPT.
- sanitizeLLMOutput(): Nettoyer les réponses du LLM.
- safeLogger(): Logs sans données sensibles.
- Arbre de décision de pré-expertise: La feature génère automatiquement un arbre de décision structuré qui aide l’avocat à identifier les preuves techniques nécessaires, les actions de collecte, et l’impact juridique de chaque élément dans son affaire.
- Homepage Carousel: Horizontal scrolling carousel displaying logos: ISO27001, BSI IT-Grundschutz, ADESS, Campus Cyber, ANSSI
- Recommended Service Offer Display: Display the recommended service offer (photo of the expert and service offer with the highest score) and provide options to confirm choice and contact the expert.
- First Meeting Scheduling: Display available time slots for the first meeting with the selected expert. Allow inviting other participants by email.
- Expert Registration Form: Form for experts to register with fields for name, company, SIRET, email, LinkedIn profile link (with sourcing and completion), and CV upload (with information extraction and classification).
- Expert Information Validation: Form to validate expert information sourced from the web, including extracted CV data. Includes fields for name, phone number, career history (with 'Correct' and 'Add Experience' buttons), agreement checkboxes, and a 'Next' button.
- Expert Availability Display: Interface for experts to display their availability, including a clickable calendar and a 'Validate my availability' checkbox.
- Terms of Engagement and Code of Conduct Signature: Screen for experts to sign the Terms of Engagement and Code of Conduct.
- Expert Functioning Video and Questionnaire: Screen with a video explaining Causae's operation and risks, along with a questionnaire with instant feedback. Includes a FAQ section.
- Expert Opportunity Display: Screen displaying the opportunity for the expert, with a description of the case and a 'Postuler' button.
- Expert Quote Creation: Screen for experts to create a quote, with help guides, task selection, pricing details, and general terms.
- Expert Quote Submission: Screen to finalize and submit the quote, with requirements for legal documents and company information.
- Case Lifecycle Management: Management of case lifecycle, including intermediate statuses for cases (draft, paid, matching in progress, expert selected, closed).
- Action History/Timeline: History of actions/timeline (who did what, when) - useful for audit and Copilot.
- Push / Email Notifications: Notifications push / email pour avocat et expert (ex. nouveau message, échéance, quote reçue). Cela peut être simple via Firebase Cloud Messaging.
- File Uploads: Uploads de fichiers annexes côté avocat (preuves, documents légaux). Versioning ou trace des fichiers pour audit
- GDPR Consent: GDPR consent for data storage (lawyers + experts)
- Legal Document History: History of signature and versioning of legal documents
- Reporting: Pour avocat : affaires en cours, expert assigné, statut paiement. Pour expert : opportunités, quotes envoyées, réunions planifiées
- External Validation: External validation manual on external expert sourcing Workflow pour vérifier que l’expert externe est valide avant contact réel
- Account Management: Gestion des comptes: Modifier ses informations personnelles, Préférences notifications / calendrier, Mot de passe / sécurité

## Style Guidelines:

- Primary color: Bright Yellow (#FFDA63), inspired by the logo, to convey energy and innovation.
- Background color: Pale yellow (#FAF0E6) for a soft, inviting feel.
- Accent color: Light orange (#FFB347) to highlight key CTAs.
- Body and headline font: 'Funnel Display', sans-serif, for its modern look and touch of warmth, makes it versatile for headings and text.
- Modern, minimalist icons to represent various actions and categories throughout the app.
- Clean and intuitive layout that emphasizes ease of navigation, especially for the forms. Prioritize key actions and information.
- Subtle transitions and animations to enhance user engagement, such as loading states for AI processes or confirmation of actions.