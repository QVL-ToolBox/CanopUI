import { resolvePage } from "./router/resolvePage";
import { useHashRoute } from "./router/useHashRoute";
import { DocShell } from "./shell/DocShell";

export function App() {
  const route = useHashRoute();
  const { element, contentWidth } = resolvePage(route.segments);

  return (
    <DocShell activePath={route.path} contentWidth={contentWidth}>
      {element}
    </DocShell>
  );
}
