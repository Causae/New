"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {ChangeEvent, useEffect, useMemo, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {useRouter} from "next/navigation";
import {collection, serverTimestamp} from "firebase/firestore";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Slider} from "@/components/ui/slider";
import {Textarea} from "@/components/ui/textarea";
import {toast} from "@/hooks/use-toast";
import {FileUp, Loader2, MoveLeft, MoveRight, Sparkles, Upload} from "lucide-react";
import {useFirebase, useIsSignInWithEmailLink, useUser} from "@/firebase/provider";
import {addDocumentNonBlocking} from "@/firebase/non-blocking-updates";

// ---- Types & constants ----------------------------------------------------

type SpecialtyCard = {
  id: string;
  title: string;
  subtitle: string;
  details: string;
};

type ObjectiveCard = {
  id: string;
  title: string;
  subtitle: string;
  details: string;
};

const specialties: SpecialtyCard[] = [
  {
    id: "construction",
    title: "Construction & Bâtiment",
    subtitle: "Malfaçons, fissures, infiltrations, retard de chantier, décennale",
    details:
      "Désordres techniques, expertise amiable ou judiciaire, responsabilité des intervenants et interactions assurances.",
  },
  {
    id: "habitation",
    title: "Habitation, locaux & sinistres assurés",
    subtitle: "Incendie, dégât des eaux, vol, catastrophe naturelle",
    details:
      "Pour tout ce qui touche le bien immobilier assuré hors pure technique bâtiment. Multirisque habitation ou pro.",
  },
  {
    id: "automobile",
    title: "Automobile & transports",
    subtitle: "Accident, VEI, valeur de remplacement, vices cachés véhicule",
    details:
      "Spécialistes de l’automobile et du transport : valeur, responsabilité et contre-expertises face aux assureurs.",
  },
  {
    id: "sante",
    title: "Santé & préjudices corporels",
    subtitle: "Accident corporel, erreur médicale, incapacité, consolidation",
    details:
      "Médecins experts du dommage corporel pour analyser barèmes, causalité et quantum du préjudice.",
  },
  {
    id: "immobilier",
    title: "Immobilier, foncier & copropriété",
    subtitle: "Valeur vénale, loyers, servitudes, voisinage",
    details:
      "Valeur, droits réels, troubles de voisinage ou litiges de copropriété avec appui technique et juridique.",
  },
  {
    id: "entreprise",
    title: "Entreprises, finance & comptabilité",
    subtitle: "Pertes d’exploitation, évaluation de société, litiges associés",
    details:
      "Experts comptables et financiers pour vérifier méthodes, valorisations et déceler les anomalies de gestion.",
  },
  {
    id: "numerique",
    title: "Numérique, données & cybersécurité",
    subtitle: "Intrusion, fuite de données, litiges informatiques, logiciel non conforme",
    details:
      "Contentieux IT / cyber / data avec forensique, conformité logicielle et e-réputation.",
  },
  {
    id: "autre",
    title: "Je ne sais pas / Autre spécialité technique",
    subtitle: "Aide à qualifier le dossier rapidement",
    details:
      "Pour affiner la famille d’expert quand la qualification est incertaine en 30 secondes.",
  },
];

const objectives: ObjectiveCard[] = [
  {
    id: "contester",
    title: "Contester un rapport ou une offre",
    subtitle: "Besoin d’une contre-expertise détaillée",
    details:
      "Rapport défavorable, offre trop basse : obtenir un second avis chiffré et argumenté face à l’adversaire ou l’assureur.",
  },
  {
    id: "chiffrer",
    title: "Faire chiffrer un dommage / préjudice",
    subtitle: "Tableau de chiffrage, scénarios et méthodo",
    details:
      "Évaluer montants et impacts pour négocier ou plaider avec un chiffrage solide et opposable.",
  },
  {
    id: "comprendre",
    title: "Comprendre causes & responsabilités",
    subtitle: "Origine du dommage, partage des fautes",
    details:
      "Identifier défauts, non-conformités et responsabilités techniques pour structurer les demandes.",
  },
  {
    id: "verifier",
    title: "Vérifier conformité contrat / règles de l’art",
    subtitle: "Contrôle qualité et réglementaire",
    details:
      "Dire si les travaux ou prestations respectent documents contractuels, normes et bonnes pratiques.",
  },
  {
    id: "procedure",
    title: "Préparer ou sécuriser une procédure",
    subtitle: "Référé-expertise, assignation, conclusions",
    details:
      "Approche contradictoire, traçabilité et questions “dites si…” pour parler le langage du juge.",
  },
  {
    id: "avis",
    title: "Avis technique rapide pour négocier",
    subtitle: "Short-review avant décision",
    details:
      "Mini-revue pour décider : accepter, refuser, transiger ou aller en expertise judiciaire sans attendre.",
  },
];

const formSchema = z.object({
  caseTitle: z.string().min(1, "Donnez un titre clair à l’affaire."),
  specialty: z.string().min(1, "Choisissez une spécialité."),
  objective: z.string().min(1, "Choisissez un objectif principal."),
  contextNote: z.string().optional(),
  summary: z
    .string()
    .min(80, "Le résumé doit contenir au moins 80 caractères pour être exploitable."),
  urgency: z.number().min(0).max(100),
  budgetSensitivity: z.number().min(0).max(100),
  confidentiality: z.number().min(0).max(100),
  missingPoint: z.string().max(240, "Limitez le point manquant à 240 caractères.").optional(),
  uploadedDocuments: z.array(z.string()).default([]),
}).refine(
  data => (data.contextNote?.length ?? 0) >= 10 || data.uploadedDocuments.length > 0,
  {
    path: ["contextNote"],
    message: "Ajoutez quelques lignes de contexte ou au moins un document.",
  }
);

// ---- UI helpers -----------------------------------------------------------

function SelectableCard({
  title,
  subtitle,
  details,
  selected,
  onSelect,
}: SpecialtyCard & {selected: boolean; onSelect: () => void}) {
  return (
    <Card
      className={`h-full cursor-pointer transition-all hover:shadow-lg ${
        selected ? "border-primary shadow-lg" : "border-muted"
      }`}
      onClick={onSelect}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg leading-tight">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {selected && <Badge>Choisi</Badge>}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{details}</p>
      </CardHeader>
    </Card>
  );
}

// ---- Page -----------------------------------------------------------------

export default function NewCasePage() {
  const router = useRouter();
  const {firestore, user} = useFirebase();
  const {isUserLoading} = useUser();
  const isSignInLink = useIsSignInWithEmailLink(window.location.href);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const [hasEditedSummary, setHasEditedSummary] = useState(false);
  const [showQuickAdjust, setShowQuickAdjust] = useState(false);
  // Keep a focus handle to mimic the “Ajouter un point manquant” CTA without breaking RHF refs.
  const missingPointInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSignInLink && !user) {
      const redirectUrl = `/dashboard/cases/new`;
      router.push(`/finish-signup?redirectUrl=${encodeURIComponent(redirectUrl)}`);
    } else if (!isUserLoading && !user) {
      router.push("/register?redirectUrl=/dashboard/cases/new");
    }
  }, [isSignInLink, user, isUserLoading, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caseTitle: "",
      specialty: "",
      objective: "",
      contextNote: "",
      summary: "",
      urgency: 50,
      budgetSensitivity: 50,
      confidentiality: 50,
      missingPoint: "",
      uploadedDocuments: [],
    },
  });

  const watchedValues = form.watch();

  const selectedSpecialty = useMemo(
    () => specialties.find(s => s.id === watchedValues.specialty),
    [watchedValues.specialty]
  );
  const selectedObjective = useMemo(
    () => objectives.find(o => o.id === watchedValues.objective),
    [watchedValues.objective]
  );

  const detectedContext = useMemo(() => {
    const docLabels = uploadedDocuments.length
      ? uploadedDocuments.join(", ")
      : "Aucun document importé pour le moment";

    const hints: string[] = [];

    if (selectedSpecialty) {
      hints.push(`Famille d’expert pressentie : ${selectedSpecialty.title}.`);
    }
    if (selectedObjective) {
      hints.push(`Objectif prioritaire : ${selectedObjective.title}.`);
    }
    if (uploadedDocuments.length > 0) {
      hints.push(`Documents détectés : ${docLabels}.`);
    }
    if ((watchedValues.contextNote?.length ?? 0) > 20) {
      hints.push("Contexte saisi : suffisamment détaillé pour une pré-lecture AI.");
    }

    return hints;
  }, [selectedSpecialty, selectedObjective, uploadedDocuments, watchedValues.contextNote]);

  const generatedSummary = useMemo(() => {
    const title = watchedValues.caseTitle || "Affaire non titrée";
    const specialty = selectedSpecialty?.title ?? "spécialité à préciser";
    const objective = selectedObjective?.title ?? "objectif à préciser";
    const context = watchedValues.contextNote
      ? `Contexte déclaré : ${watchedValues.contextNote}`
      : "Contexte à préciser ou à importer via document.";
    const docLine = uploadedDocuments.length
      ? `Documents joints : ${uploadedDocuments.join(" | ")}.`
      : "Documents à ajouter (PDF, constats, emails, devis).";

    return `Vous semblez vouloir mandater un expert (${specialty}) pour ${objective.toLowerCase()} concernant « ${title} ». ${context} ${docLine}`;
  }, [selectedSpecialty, selectedObjective, watchedValues.caseTitle, watchedValues.contextNote, uploadedDocuments]);

  useEffect(() => {
    if (!hasEditedSummary) {
      form.setValue("summary", generatedSummary);
    }
  }, [generatedSummary, form, hasEditedSummary]);

  const totalSteps = 4;

  const stepFieldMap: Record<number, (keyof z.infer<typeof formSchema>)[]> = {
    1: ["caseTitle", "specialty"],
    2: ["objective"],
    3: ["contextNote"],
    4: ["summary"],
  };

  async function handleNextStep() {
    const fieldsToValidate = stepFieldMap[currentStep] ?? [];
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(step => Math.min(step + 1, totalSteps));
    }
  }

  function handlePreviousStep() {
    setCurrentStep(step => Math.max(step - 1, 1));
  }

  function handleQuickAdjustToggle() {
    setShowQuickAdjust(visible => !visible);
  }

  function handleFocusMissingPoint() {
    missingPointInputRef.current?.focus();
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files;
    if (!fileList) return;

    const names = Array.from(fileList).map(file => file.name);
    setUploadedDocuments(names);
    form.setValue("uploadedDocuments", names);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) {
      toast({
        title: "Erreur",
        description: "Firestore est indisponible. Réessayez plus tard.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Connectez-vous pour créer une affaire.",
        variant: "destructive",
      });
      router.push("/login?redirectUrl=/dashboard/cases/new");
      return;
    }

    const caseData = {
      lawyerId: user.uid,
      title: values.caseTitle,
      type: values.specialty,
      objective: values.objective,
      description: values.summary,
      contextNote: values.contextNote,
      urgency: values.urgency,
      budgetSensitivity: values.budgetSensitivity,
      confidentiality: values.confidentiality,
      missingPoint: values.missingPoint,
      documents: values.uploadedDocuments,
      status: "draft",
      createdAt: serverTimestamp(),
    };

    try {
      const casesCollectionRef = collection(firestore, `cases`);
      const docRef = await addDocumentNonBlocking(casesCollectionRef, caseData);

      if (!docRef) {
        toast({
          title: "Création incomplète",
          description: "La référence de l’affaire n’a pas été générée. Réessayez.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Affaire créée",
        description: "Analyse IA en cours…",
      });

      const query = new URLSearchParams({
        description: values.summary,
        title: values.caseTitle,
      }).toString();

      router.push(`/dashboard/cases/${docRef.id}/analysis?${query}`);
    } catch (error) {
      console.error("Error creating case:", error);
      toast({
        title: "Erreur",
        description: "La création a échoué. Merci de réessayer.",
        variant: "destructive",
      });
    }
  }

  if (isUserLoading || isSignInLink || !user) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h1 className="text-xl font-semibold">Vérification de votre accès…</h1>
          <p className="text-muted-foreground">
            Patientez pendant la sécurisation de votre session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 pb-6">
        <Sparkles className="h-6 w-6 text-primary" />
        <div>
          <p className="text-sm uppercase tracking-tight text-primary">Demande d’expertise guidée</p>
          <h1 className="text-2xl font-semibold">Construisez votre demande en 4 étapes fluides</h1>
        </div>
      </div>

      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Formulaire dynamique</CardTitle>
          <CardDescription>
            Cartes interactives, import de documents et résumé pré-rempli pour accélérer la saisine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <Badge variant="outline">Étape {currentStep} / {totalSteps}</Badge>
                  <span className="text-muted-foreground">
                    Sélectionnez une carte puis avancez. Aucune recharge de page.
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Upload className="h-4 w-4" />
                  Importez un document dès l’étape 3 pour enrichir automatiquement le résumé.
                </div>
              </div>

              <FormField
                control={form.control}
                name="caseTitle"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Titre de l’affaire</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex : Compromission de données chez un sous-traitant"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {currentStep === 1 && (
                <section className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold">Quel type d’affaire ?</h2>
                    <p className="text-sm text-muted-foreground">
                      Choisissez une spécialité : les cartes déclenchent la bonne famille d’experts et un langage adapté.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {specialties.map(card => (
                      <SelectableCard
                        key={card.id}
                        {...card}
                        selected={watchedValues.specialty === card.id}
                        onSelect={() => form.setValue("specialty", card.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {currentStep === 2 && (
                <section className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold">Quel est votre objectif principal ?</h2>
                    <p className="text-sm text-muted-foreground">
                      6 cartes d’objectifs : le prompt IA ajuste la mission (diagnostiquer, chiffrer, contredire, expertiser, auditer).
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {objectives.map(card => (
                      <SelectableCard
                        key={card.id}
                        {...card}
                        selected={watchedValues.objective === card.id}
                        onSelect={() => form.setValue("objective", card.id)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {currentStep === 3 && (
                <section className="space-y-6">
                  <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-lg font-semibold">Contexte et documents</h2>
                        <p className="text-sm text-muted-foreground">
                          Collez un résumé, importez vos pièces (PDF, emails, constats). Nous détectons automatiquement le contexte et l’urgence.
                        </p>
                      </div>
                      <FormField
                        control={form.control}
                        name="contextNote"
                        render={({field}) => (
                          <FormItem>
                            <FormLabel>Résumé libre ou copier/coller</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Ce qui s’est passé, ce qui est contesté, les dates clés, les parties en présence…"
                                className="min-h-[140px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-2">
                        <FormLabel>Importer des documents</FormLabel>
                        <label
                          htmlFor="document-upload"
                          className="flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed border-muted px-6 py-8 text-center transition-colors hover:border-primary"
                        >
                          <FileUp className="h-10 w-10 text-muted-foreground" />
                          <div className="text-sm text-muted-foreground">
                            Glissez-déposez ou cliquez pour sélectionner vos pièces
                          </div>
                          <input
                            id="document-upload"
                            type="file"
                            className="hidden"
                            multiple
                            onChange={handleFiles}
                          />
                        </label>
                        {uploadedDocuments.length > 0 && (
                          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                            {uploadedDocuments.map(name => (
                              <li key={name}>{name}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <p className="text-sm font-semibold">Détection automatique</p>
                      </div>
                      {detectedContext.length > 0 ? (
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {detectedContext.map(item => (
                            <li key={item} className="rounded-md bg-background px-3 py-2 shadow-sm">
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Importez un document pour détecter les parties, l’urgence et les éléments techniques clés.
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {currentStep === 4 && (
                <section className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold">Résumé pré-rempli</h2>
                    <p className="text-sm text-muted-foreground">
                      Modifiable en ligne : ajustez en 10 secondes via les curseurs ou ajoutez un point manquant.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/60 p-3">
                    <Button type="submit" variant="secondary">
                      Confirmer
                    </Button>
                    <Button type="button" variant={showQuickAdjust ? "default" : "outline"} onClick={handleQuickAdjustToggle}>
                      Modifier en 10 secondes
                    </Button>
                    <Button type="button" variant="outline" onClick={handleFocusMissingPoint}>
                      Ajouter un point manquant
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name="summary"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Résumé proposé</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[160px]"
                            onChange={event => {
                              setHasEditedSummary(true);
                              field.onChange(event.target.value);
                            }}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {showQuickAdjust && (
                    <div className="grid gap-6 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="urgency"
                        render={({field}) => (
                          <FormItem>
                            <FormLabel>Urgence</FormLabel>
                            <FormControl>
                              <Slider
                                value={[field.value ?? 0]}
                                min={0}
                                max={100}
                                step={5}
                                onValueChange={values => field.onChange(values[0])}
                              />
                            </FormControl>
                            <p className="text-sm text-muted-foreground">{field.value}%</p>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="budgetSensitivity"
                        render={({field}) => (
                          <FormItem>
                            <FormLabel>Budget</FormLabel>
                            <FormControl>
                              <Slider
                                value={[field.value ?? 0]}
                                min={0}
                                max={100}
                                step={5}
                                onValueChange={values => field.onChange(values[0])}
                              />
                            </FormControl>
                            <p className="text-sm text-muted-foreground">{field.value}%</p>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confidentiality"
                        render={({field}) => (
                          <FormItem>
                            <FormLabel>Confidentialité</FormLabel>
                            <FormControl>
                              <Slider
                                value={[field.value ?? 0]}
                                min={0}
                                max={100}
                                step={5}
                                onValueChange={values => field.onChange(values[0])}
                              />
                            </FormControl>
                            <p className="text-sm text-muted-foreground">{field.value}%</p>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="missingPoint"
                    render={({field}) => {
                      const {ref, ...fieldWithoutRef} = field;

                      return (
                        <FormItem>
                          <FormLabel>Ajouter un point manquant (optionnel, 1 champ max)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex : préciser la date de la mise en demeure ou le numéro de police d’assurance"
                              ref={element => {
                                ref(element);
                                missingPointInputRef.current = element;
                              }}
                              {...fieldWithoutRef}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
                    <p>
                      Chaque choix construit automatiquement la demande en arrière-plan : contexte, parties, documents,
                      attentes et points techniques seront transmis à l’IA pour générer l’arbre de preuves et la mission type.
                    </p>
                  </div>
                </section>
              )}

              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" type="button" onClick={handlePreviousStep} disabled={currentStep === 1}>
                  <MoveLeft className="mr-2 h-4 w-4" /> Retour
                </Button>
                {currentStep < totalSteps && (
                  <Button type="button" onClick={handleNextStep}>
                    Continuer
                    <MoveRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                {currentStep === totalSteps && (
                  <Button type="submit">Confirmer & lancer l’analyse</Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
