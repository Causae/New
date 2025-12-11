# Amélioration alternative de la page de formulaire de demande d'affaire

Cette proposition décrit une expérience en 5 moments fluides pour aider l’avocat à qualifier rapidement son dossier, importer ses pièces et valider un résumé pré-rempli prêt pour l’IA de pré-expertise.

## Principes UX
- Navigation en étapes sans rechargement (cartes cliquables, transitions douces, résumé mis à jour en direct).
- Mise en avant des **8 cartes de spécialités** et des **6 cartes d’objectifs** pour guider la qualification en moins de 30 secondes.
- Détection automatique de signaux dans les documents importés (parties, urgence, type d’expertise, points techniques) pour enrichir le résumé.
- Édition inline façon “Figma” : le résumé reste éditable, avec des curseurs rapides (urgence / budget / confidentialité) et un champ unique pour ajouter un point manquant.
- Préparation de l’arbre de preuves et du prompt `preliminaryExpertAssessmentPrompt` en arrière-plan dès que les cartes sont choisies.

## Parcours proposé
1. **Quel type d’affaire ?**
   - 8 cartes interactives (Construction & Bâtiment, Habitation & sinistres assurés, Automobile & transports, Santé & préjudices corporels, Immobilier & copropriété, Entreprises & finance, Numérique & cyber, Je ne sais pas / Autre). Chaque carte présente une accroche métier et des exemples concrets.
2. **Quel est votre objectif principal ?**
   - 6 cartes d’objectifs (Contester, Chiffrer, Comprendre, Vérifier, Préparer/Sécuriser, Avis rapide). Le choix ajuste la mission type (“dire si…”, contre-expertise, chiffrage, conformité, contradictoire judiciaire).
3. **Contexte ?**
   - Champ libre + **upload/coller** (PDF, email, constat, rapport d’assurance, devis, décision). Le système détecte automatiquement : contexte juridique, type d’expertise, urgence, parties, éléments techniques clés.
4. **Résumé pré-rempli**
   - Résumé auto-généré (editable inline) + 3 curseurs “Modifier en 10 secondes” (urgence, budget, confidentialité) + champ “Ajouter un point manquant (1 seul)”.
   - Boutons : Confirmer / Modifier en 10 secondes / Ajouter un point manquant.
5. **Construction automatique de la demande**
   - En arrière-plan : arbre des faits/preuves, famille d’expert cible, mission type (prompt `preliminaryExpertAssessmentPrompt`), et génération de 2–3 profils d’experts immédiatement visibles.

## Impact attendu
- Réduction du temps de saisie (sélection cartes + résumé auto) et meilleure exhaustivité grâce à l’analyse des documents.
- Meilleure qualification de la famille d’experts et de la mission dès l’import des pièces.
- Résumé prêt à partager ou à enrichir par l’IA (arbre de décision pour les preuves, mission type, pré-expertise immédiate).
