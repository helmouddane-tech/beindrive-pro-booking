import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "À partir de quel âge peut-on s'inscrire ?",
    answer:
      "Vous pouvez vous inscrire dès 15 ans pour la conduite accompagnée (AAC) et dès 17 ans pour le permis B classique. L'examen pratique peut être passé dès 17 ans (depuis janvier 2024, il est possible de conduire seul dès 17 ans).",
  },
  {
    question: "Quels documents faut-il pour s'inscrire ?",
    answer:
      "Pièce d'identité en cours de validité, justificatif de domicile de moins de 6 mois, 4 photos d'identité numériques (format ANTS), ASSR 2 ou ASR, et la JDC (Journée Défense et Citoyenneté) pour les moins de 25 ans.",
  },
  {
    question: "Combien d'heures de conduite sont obligatoires ?",
    answer:
      "Le minimum légal est de 20 heures pour le permis B en boîte manuelle et 13 heures pour le permis B en boîte automatique (BEA). L'évaluation de départ permet d'estimer le volume d'heures réellement nécessaire selon votre niveau.",
  },
  {
    question: "Qu'est-ce que la conduite accompagnée (AAC) ?",
    answer:
      "L'Apprentissage Anticipé de la Conduite permet de commencer à 15 ans. Après 20h de conduite avec un moniteur, l'élève doit parcourir au moins 3 000 km avec un accompagnateur sur une durée minimum d'1 an. L'AAC offre un meilleur taux de réussite à l'examen et réduit la période probatoire à 2 ans au lieu de 3.",
  },
  {
    question: "Combien de temps le code de la route est-il valable ?",
    answer:
      "L'Examen Théorique Général (ETG) est valable 5 ans ou pour 5 passages de l'épreuve pratique. Vous devez repasser le code si vous n'avez pas obtenu le permis dans ce délai.",
  },
  {
    question: "Comment se déroule l'examen pratique du permis B ?",
    answer:
      "L'épreuve dure 32 minutes. L'inspecteur évalue votre capacité à conduire de manière autonome et sûre. Vous devez réaliser un parcours en et hors agglomération, effectuer 2 manœuvres et répondre à 3 questions (vérifications intérieures/extérieures et premiers secours). Le résultat est disponible sous 48h sur le site de la Sécurité Routière.",
  },
  {
    question: "Qu'est-ce que le permis probatoire ?",
    answer:
      "Tout nouveau conducteur débute avec un permis à 6 points. Si aucune infraction n'est commise, le capital passe progressivement à 12 points : en 3 ans (formation classique) ou 2 ans (AAC). Le stage post-permis (entre 6 et 12 mois après l'obtention) permet de réduire ce délai.",
  },
  {
    question: "Peut-on financer sa formation avec le CPF ?",
    answer:
      "Oui, le permis de conduire (catégories B, C1, C, D1, D, C1E, CE, D1E, DE) est éligible au Compte Personnel de Formation (CPF) sous conditions. N'hésitez pas à nous contacter pour vérifier votre éligibilité et monter votre dossier.",
  },
];

const FAQSection = () => {
  const ref = useScrollReveal();

  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container" ref={ref}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14 opacity-0 transition-all duration-700 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0 translate-y-5">
            <p className="text-gold font-semibold text-sm tracking-[0.2em] uppercase mb-3">
              Questions fréquentes
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance leading-tight mb-4">
              Tout savoir sur le permis de conduire
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Les réponses aux questions les plus courantes sur la formation et la réglementation française.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3 opacity-0 translate-y-5 transition-all duration-700 delay-200 [.is-visible_&]:opacity-100 [.is-visible_&]:translate-y-0">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-gold/30 transition-colors"
              >
                <AccordionTrigger className="text-left font-display text-base font-semibold text-foreground hover:text-gold transition-colors py-5 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
