import Typography from "@mui/material/Typography";
import { Feedback } from "@canop/ui";
import { useDocLocale } from "../../../i18n/useDocLocale";
import { CodeBlock } from "../../../kit/CodeBlock";
import { DocPage } from "../../../kit/DocPage";
import { DocSection } from "../../../kit/DocSection";
import { FocusActionsDemo } from "./FocusActionsDemo";
import { FocusChoicesDemo } from "./FocusChoicesDemo";
import { FocusFieldsDemo } from "./FocusFieldsDemo";
import { FocusNavigationDemo } from "./FocusNavigationDemo";
import { focusPageTexts } from "./focusPageTexts";
import { useFocusPlayground } from "./useFocusPlayground";

const helperCode = `import { hoverOrKeyboardFocus, withoutFocusRing } from "@canop/ui";

const tileSx = {
  ...withoutFocusRing,
  [hoverOrKeyboardFocus()]: { backgroundColor: "var(--canop-palette-action-hover)" },
};`;

export function FocusPage() {
  const t = focusPageTexts[useDocLocale()];
  const playground = useFocusPlayground();

  return (
    <DocPage title={t.title} intro={t.intro}>
      <DocSection title={t.ruleTitle} description={t.ruleDescription}>
        <Feedback severity="info">{t.ruleHowTo}</Feedback>
        <Typography aria-live="polite" color="text.secondary">
          {t.activations(playground.activations)}
        </Typography>
      </DocSection>
      <DocSection title={t.actionsTitle} description={t.actionsDescription}>
        <FocusActionsDemo labels={t.actions} onActivate={playground.activate} />
      </DocSection>
      <DocSection title={t.choicesTitle} description={t.choicesDescription}>
        <FocusChoicesDemo
          labels={t.choices}
          view={playground.view}
          onViewChange={playground.setView}
          notifications={playground.notifications}
          onNotificationsChange={playground.setNotifications}
          accepted={playground.accepted}
          onAcceptedChange={playground.setAccepted}
          volume={playground.volume}
          onVolumeChange={playground.setVolume}
        />
      </DocSection>
      <DocSection title={t.navigationTitle} description={t.navigationDescription}>
        <FocusNavigationDemo labels={t.navigation} onActivate={playground.activate} />
      </DocSection>
      <DocSection title={t.fieldsTitle} description={t.fieldsDescription}>
        <FocusFieldsDemo
          labels={t.fields}
          name={playground.name}
          onNameChange={playground.setName}
          fruit={playground.fruit}
          onFruitChange={playground.setFruit}
        />
      </DocSection>
      <DocSection title={t.helperTitle} description={t.helperDescription}>
        <CodeBlock code={helperCode} />
      </DocSection>
    </DocPage>
  );
}
