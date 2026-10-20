import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Input, Stack, isValidEmail, passwordStrength } from "@canop/ui";
import { CodeBlock } from "../../kit/CodeBlock";
import { DemoCard } from "../../kit/DemoCard";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { isValidEmail, passwordStrength, PASSWORD_CRITERIA } from "@canop/ui";`;

const rulesCode = `import { isValidEmail, isValidName, isValidPassword } from "@canop/ui";

isValidEmail("martin@qvl.fr"); // true
isValidName("Jean-Éric"); // true
isValidPassword("Sup3r!Secret"); // true`;

const strengthCode = `import { passwordStrength, passwordCriteriaState, PASSWORD_CRITERIA } from "@canop/ui";

passwordStrength("Ab1!"); // 3 (sur 5)

passwordCriteriaState("Ab1!");
// [
//   { id: "length", passed: false },
//   { id: "uppercase", passed: true },
//   { id: "lowercase", passed: true },
//   { id: "digit", passed: true },
//   { id: "special", passed: true },
// ]

PASSWORD_CRITERIA.map((criterion) => criterion.id);
// ["length", "uppercase", "lowercase", "digit", "special"]`;

const demoCode = `function ValidationDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailError = email.length > 0 && !isValidEmail(email) ? "Format d'email invalide." : null;
  const strength = passwordStrength(password);

  return (
    <Box width="100%" maxWidth="22rem">
      <Stack gap="md">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={emailError}
          fullWidth
        />
        <Input
          label="Mot de passe"
          type="password"
          value={password}
          onChange={setPassword}
          fullWidth
        />
        <Typography color="text.secondary">Force du mot de passe : {strength} / 5</Typography>
      </Stack>
    </Box>
  );
}`;

const fr = {
  intro:
    "Règles de validation partagées entre les portails QVL. Prédicats pour l'email, le nom et le mot de passe, mesure de robustesse et critères détaillés, alignés sur les messages i18n du design system.",
  sections: {
    demo: {
      title: "Démonstration",
      description:
        "La saisie est validée en direct : message d'erreur d'email dès qu'un format invalide est détecté, et score de robustesse du mot de passe mis à jour à chaque frappe.",
    },
    predicates: {
      title: "Prédicats",
      description:
        "isValidEmail, isValidName et isValidPassword renvoient un booléen, prêts à alimenter la logique de formulaire ou la prop error d'un Input.",
    },
    strength: {
      title: "Robustesse du mot de passe",
      description:
        "passwordStrength compte les critères satisfaits, tandis que passwordCriteriaState détaille chaque critère pour afficher une checklist en temps réel.",
    },
  },
  demos: {
    live: {
      title: "Validation en direct",
    },
  },
  api: {
    functions: "API — Fonctions",
    constants: "API — Constantes",
  },
  props: {
    rules: {
      isValidEmail: "Valide un email via EMAIL_REGEX (partie locale, arobase, domaine avec point).",
      isValidName:
        "Valide un nom via NAME_REGEX (lettres Unicode, espaces, apostrophes et tirets, 1 à 80 caractères).",
      isValidPassword: "Vrai lorsque le mot de passe satisfait l'ensemble des PASSWORD_CRITERIA.",
      passwordStrength: "Nombre de critères satisfaits, de 0 à 5.",
      passwordCriteriaState:
        "État détaillé (id, passed) de chaque critère pour le mot de passe donné.",
    },
    constants: {
      passwordMinLength: "Longueur minimale requise pour un mot de passe.",
      passwordCriteria:
        "Liste ordonnée des critères : length, uppercase, lowercase, digit, special.",
      emailRegex: "Expression régulière de validation d'email.",
      nameRegex: "Expression régulière de validation de nom, en mode Unicode.",
    },
  },
};

const en: typeof fr = {
  intro:
    "Validation rules shared across the QVL portals. Predicates for email, name and password, a strength measure and detailed criteria, aligned with the design system i18n messages.",
  sections: {
    demo: {
      title: "Demo",
      description:
        "Input is validated live: an email error message as soon as an invalid format is detected, and a password strength score updated on every keystroke.",
    },
    predicates: {
      title: "Predicates",
      description:
        "isValidEmail, isValidName and isValidPassword return a boolean, ready to feed form logic or an Input's error prop.",
    },
    strength: {
      title: "Password strength",
      description:
        "passwordStrength counts the satisfied criteria, while passwordCriteriaState details each criterion to display a real-time checklist.",
    },
  },
  demos: {
    live: {
      title: "Live validation",
    },
  },
  api: {
    functions: "API — Functions",
    constants: "API — Constants",
  },
  props: {
    rules: {
      isValidEmail: "Validates an email via EMAIL_REGEX (local part, at sign, domain with a dot).",
      isValidName:
        "Validates a name via NAME_REGEX (Unicode letters, spaces, apostrophes and hyphens, 1 to 80 characters).",
      isValidPassword: "True when the password satisfies all of the PASSWORD_CRITERIA.",
      passwordStrength: "Number of satisfied criteria, from 0 to 5.",
      passwordCriteriaState:
        "Detailed state (id, passed) of each criterion for the given password.",
    },
    constants: {
      passwordMinLength: "Minimum length required for a password.",
      passwordCriteria: "Ordered list of criteria: length, uppercase, lowercase, digit, special.",
      emailRegex: "Regular expression for email validation.",
      nameRegex: "Regular expression for name validation, in Unicode mode.",
    },
  },
};

const texts = { fr, en };

export default function ValidationDoc() {
  const t = texts[useDocLocale()];

  const rulesProps: PropRow[] = [
    {
      name: "isValidEmail",
      type: "(value: string) => boolean",
      description: t.props.rules.isValidEmail,
    },
    {
      name: "isValidName",
      type: "(value: string) => boolean",
      description: t.props.rules.isValidName,
    },
    {
      name: "isValidPassword",
      type: "(value: string) => boolean",
      description: t.props.rules.isValidPassword,
    },
    {
      name: "passwordStrength",
      type: "(value: string) => number",
      description: t.props.rules.passwordStrength,
    },
    {
      name: "passwordCriteriaState",
      type: "(value: string) => CanopPasswordCriterionState[]",
      description: t.props.rules.passwordCriteriaState,
    },
  ];

  const constantsProps: PropRow[] = [
    {
      name: "PASSWORD_MIN_LENGTH",
      type: "number",
      defaultValue: "8",
      description: t.props.constants.passwordMinLength,
    },
    {
      name: "PASSWORD_CRITERIA",
      type: "CanopPasswordCriterion[]",
      description: t.props.constants.passwordCriteria,
    },
    {
      name: "EMAIL_REGEX",
      type: "RegExp",
      description: t.props.constants.emailRegex,
    },
    {
      name: "NAME_REGEX",
      type: "RegExp",
      description: t.props.constants.nameRegex,
    },
  ];

  return (
    <DocPage title="validation" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.demo.title} description={t.sections.demo.description}>
        <DemoCard title={t.demos.live.title} code={demoCode} align="stretch">
          <ValidationDemo />
        </DemoCard>
      </DocSection>
      <DocSection
        title={t.sections.predicates.title}
        description={t.sections.predicates.description}
      >
        <CodeBlock code={rulesCode} />
      </DocSection>
      <DocSection title={t.sections.strength.title} description={t.sections.strength.description}>
        <CodeBlock code={strengthCode} />
      </DocSection>
      <DocSection title={t.api.functions}>
        <PropsTable rows={rulesProps} />
      </DocSection>
      <DocSection title={t.api.constants}>
        <PropsTable rows={constantsProps} />
      </DocSection>
    </DocPage>
  );
}

function ValidationDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailError = email.length > 0 && !isValidEmail(email) ? "Format d'email invalide." : null;
  const strength = passwordStrength(password);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "22rem",
      }}
    >
      <Stack gap="md">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={emailError}
          fullWidth
        />
        <Input
          label="Mot de passe"
          type="password"
          value={password}
          onChange={setPassword}
          fullWidth
        />
        <Typography
          sx={{
            color: "text.secondary",
          }}
        >
          Force du mot de passe : {strength} / 5
        </Typography>
      </Stack>
    </Box>
  );
}
