import { Breadcrumb, Card, type CanopBreadcrumbItem } from "@canop/ui";
import { FocusDemoSurface } from "./FocusDemoSurface";

export interface FocusNavigationLabels {
  group: string;
  home: string;
  docs: string;
  current: string;
  cardTitle: string;
  cardSubtitle: string;
  cardBody: string;
}

export interface FocusNavigationDemoProps {
  labels: FocusNavigationLabels;
  onActivate: () => void;
}

export function FocusNavigationDemo({ labels, onActivate }: FocusNavigationDemoProps) {
  const trail: CanopBreadcrumbItem[] = [
    { id: "home", label: labels.home, icon: "home", onClick: onActivate },
    { id: "docs", label: labels.docs, onClick: onActivate },
    { id: "focus", label: labels.current },
  ];

  return (
    <FocusDemoSurface ariaLabel={labels.group} layout="stacked">
      <Breadcrumb items={trail} />
      <Card
        variant="interactive"
        arrow
        title={labels.cardTitle}
        subtitle={labels.cardSubtitle}
        ariaLabel={labels.cardTitle}
        onClick={onActivate}
      >
        {labels.cardBody}
      </Card>
    </FocusDemoSurface>
  );
}
