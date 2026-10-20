import { CodeBlock } from "../../kit/CodeBlock";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { RouteGuard, createRouteGuard, CurrentUserProvider, useCurrentUser } from "@canop/ui";`;

const currentUserCode = `import { CurrentUserProvider, useCurrentUser } from "@canop/ui";

interface AppUser {
  id: string;
  displayName: string;
  roles: string[];
}

function AppShell({ user }: { user: AppUser }) {
  return (
    <CurrentUserProvider value={user}>
      <Dashboard />
    </CurrentUserProvider>
  );
}

function Dashboard() {
  const user = useCurrentUser<AppUser>();
  return <p>Bonjour {user.displayName}</p>;
}`;

const routeGuardCode = `import { RouteGuard, navigateTo, buildLoginUrl } from "@canop/ui";
import { CanopApiError } from "@canop/ui";

<RouteGuard<AppUser>
  fetchUser={() => apiClient.request<AppUser>("/api/me")}
  hasAccess={(user) => user.roles.includes("admin")}
  isUnauthorizedError={(error) => error instanceof CanopApiError && error.status === 401}
  onUnauthorized={() => navigateTo(buildLoginUrl({ authPortalUrl: "https://auth.qvl.fr" }))}
  loadingLabel="Vérification de vos accès…"
  errorLabel="Impossible de charger votre profil."
  renderForbidden={() => <AccessDenied />}
  renderAuthorized={() => <AdminArea />}
/>`;

const useRouteGuardCode = `import { useRouteGuard } from "@canop/ui";

function GuardedArea() {
  const state = useRouteGuard<AppUser>({
    fetchUser: () => apiClient.request<AppUser>("/api/me"),
    hasAccess: (user) => user.roles.includes("admin"),
    isUnauthorizedError: (error) => error instanceof CanopApiError && error.status === 401,
    onUnauthorized: () => navigateTo(buildLoginUrl({ authPortalUrl: "https://auth.qvl.fr" })),
  });

  if (state.status === "loading") return <Spinner fullPage />;
  if (state.status === "error") return <p>Erreur</p>;
  if (state.status === "forbidden") return <AccessDenied />;
  return <AdminArea user={state.user} />;
}`;

const createRouteGuardCode = `import { createRouteGuard, navigateTo, buildLoginUrl } from "@canop/ui";

export const AdminGuard = createRouteGuard<AppUser>({
  fetchUser: () => apiClient.request<AppUser>("/api/me"),
  hasAccess: (user) => user.roles.includes("admin"),
  isUnauthorizedError: (error) => error instanceof CanopApiError && error.status === 401,
  onUnauthorized: () => navigateTo(buildLoginUrl({ authPortalUrl: "https://auth.qvl.fr" })),
  loadingLabel: "Vérification de vos accès…",
  errorLabel: "Impossible de charger votre profil.",
  renderForbidden: () => <AccessDenied />,
});

<AdminGuard>
  <AdminArea />
</AdminGuard>`;

const navigationCode = `import { buildLoginUrl, buildCguUrl, navigateTo } from "@canop/ui";

const loginUrl = buildLoginUrl({
  authPortalUrl: "https://auth.qvl.fr",
  loginPath: "/login",
  redirectCookieName: "ch_redirect",
  redirectCookieMaxAge: 300,
});

const cguUrl = buildCguUrl({
  authPortalUrl: "https://auth.qvl.fr",
  cguPath: "/cgu",
  legalNoticeAnchor: "mentions-legales",
});

navigateTo(loginUrl);`;

const fr = {
  intro:
    "Module de contrôle d'accès aux routes. Il charge l'utilisateur courant, vérifie ses droits, gère les états de chargement, d'erreur et d'interdiction, redirige vers la connexion et diffuse l'utilisateur authentifié à l'arbre via un contexte typé.",
  sections: {
    currentUser: {
      title: "Utilisateur courant",
      description:
        "CurrentUserProvider diffuse l'utilisateur authentifié. useCurrentUser le lit avec le type de votre choix et lève une erreur hors provider.",
    },
    guard: {
      title: "Garde de route",
      description:
        "RouteGuard enchaîne chargement, contrôle d'accès et rendu. Un spinner s'affiche pendant fetchUser, puis le contenu autorisé, interdit ou l'erreur selon le résultat.",
    },
    hook: {
      title: "Hook useRouteGuard",
      description:
        "Pour un rendu entièrement personnalisé, useRouteGuard renvoie l'état discriminé loading, ok, forbidden ou error.",
    },
    factory: {
      title: "Fabrique createRouteGuard",
      description:
        "createRouteGuard fige une configuration et retourne un composant réutilisable qui protège n'importe quel arbre passé en children.",
    },
    navigation: {
      title: "Navigation",
      description:
        "buildLoginUrl mémorise l'URL courante dans un cookie et compose l'URL de connexion. buildCguUrl construit l'URL des conditions générales. navigateTo effectue la redirection.",
    },
  },
  props: {
    guard: {
      fetchUser: "Charge l'utilisateur courant. Un rejet déclenche l'analyse d'erreur.",
      hasAccess: "Détermine si l'utilisateur chargé peut accéder à la route.",
      isUnauthorizedError: "Reconnaît une erreur d'authentification (typiquement un statut 401).",
      onUnauthorized:
        "Déclenché sur erreur d'authentification, généralement pour rediriger vers la connexion.",
      loadingLabel: "Libellé affiché sous le spinner pendant le chargement du profil.",
      errorLabel: "Message affiché en cas d'erreur non liée à l'authentification.",
      renderForbidden: "Rendu lorsque l'utilisateur est authentifié mais sans accès.",
      renderAuthorized:
        "Rendu lorsque l'accès est accordé ; enveloppé dans un CurrentUserProvider.",
    },
    login: {
      authPortalUrl: "Origine du portail d'authentification vers lequel rediriger.",
      loginPath: "Chemin de la page de connexion sur le portail.",
      redirectCookieName: "Nom du cookie stockant l'URL de retour après connexion.",
      redirectCookieMaxAge: "Durée de vie du cookie de redirection, en secondes.",
    },
    cgu: {
      authPortalUrl: "Origine du portail hébergeant les conditions générales.",
      cguPath: "Chemin de la page des conditions générales.",
      legalNoticeAnchor: "Ancre optionnelle ajoutée à l'URL pour cibler les mentions légales.",
    },
  },
};

const en: typeof fr = {
  intro:
    "Route access control module. It loads the current user, checks their permissions, handles the loading, error and forbidden states, redirects to sign-in and shares the authenticated user with the tree through a typed context.",
  sections: {
    currentUser: {
      title: "Current user",
      description:
        "CurrentUserProvider shares the authenticated user. useCurrentUser reads it with the type of your choice and throws outside of a provider.",
    },
    guard: {
      title: "Route guard",
      description:
        "RouteGuard chains loading, access control and rendering. A spinner is shown during fetchUser, then the authorized content, the forbidden content or the error depending on the result.",
    },
    hook: {
      title: "useRouteGuard hook",
      description:
        "For a fully custom rendering, useRouteGuard returns the discriminated state loading, ok, forbidden or error.",
    },
    factory: {
      title: "createRouteGuard factory",
      description:
        "createRouteGuard freezes a configuration and returns a reusable component that protects any tree passed as children.",
    },
    navigation: {
      title: "Navigation",
      description:
        "buildLoginUrl stores the current URL in a cookie and builds the sign-in URL. buildCguUrl builds the terms of use URL. navigateTo performs the redirection.",
    },
  },
  props: {
    guard: {
      fetchUser: "Loads the current user. A rejection triggers the error analysis.",
      hasAccess: "Determines whether the loaded user can access the route.",
      isUnauthorizedError: "Recognizes an authentication error (typically a 401 status).",
      onUnauthorized: "Triggered on an authentication error, usually to redirect to sign-in.",
      loadingLabel: "Label shown below the spinner while the profile is loading.",
      errorLabel: "Message shown for an error unrelated to authentication.",
      renderForbidden: "Rendered when the user is authenticated but has no access.",
      renderAuthorized: "Rendered when access is granted; wrapped in a CurrentUserProvider.",
    },
    login: {
      authPortalUrl: "Origin of the authentication portal to redirect to.",
      loginPath: "Path of the sign-in page on the portal.",
      redirectCookieName: "Name of the cookie storing the return URL after sign-in.",
      redirectCookieMaxAge: "Lifetime of the redirection cookie, in seconds.",
    },
    cgu: {
      authPortalUrl: "Origin of the portal hosting the terms of use.",
      cguPath: "Path of the terms of use page.",
      legalNoticeAnchor: "Optional anchor added to the URL to target the legal notice.",
    },
  },
};

const texts = { fr, en };

export default function RouteGuardDoc() {
  const t = texts[useDocLocale()];

  const routeGuardProps: PropRow[] = [
    {
      name: "fetchUser",
      type: "() => Promise<TUser>",
      required: true,
      description: t.props.guard.fetchUser,
    },
    {
      name: "hasAccess",
      type: "(user: TUser) => boolean",
      required: true,
      description: t.props.guard.hasAccess,
    },
    {
      name: "isUnauthorizedError",
      type: "(error: unknown) => boolean",
      required: true,
      description: t.props.guard.isUnauthorizedError,
    },
    {
      name: "onUnauthorized",
      type: "() => void",
      required: true,
      description: t.props.guard.onUnauthorized,
    },
    {
      name: "loadingLabel",
      type: "string",
      required: true,
      description: t.props.guard.loadingLabel,
    },
    {
      name: "errorLabel",
      type: "string",
      required: true,
      description: t.props.guard.errorLabel,
    },
    {
      name: "renderForbidden",
      type: "() => ReactNode",
      required: true,
      description: t.props.guard.renderForbidden,
    },
    {
      name: "renderAuthorized",
      type: "() => ReactNode",
      required: true,
      description: t.props.guard.renderAuthorized,
    },
  ];

  const loginOptionsProps: PropRow[] = [
    {
      name: "authPortalUrl",
      type: "string",
      required: true,
      description: t.props.login.authPortalUrl,
    },
    {
      name: "loginPath",
      type: "string",
      defaultValue: '"/login"',
      description: t.props.login.loginPath,
    },
    {
      name: "redirectCookieName",
      type: "string",
      defaultValue: '"ch_redirect"',
      description: t.props.login.redirectCookieName,
    },
    {
      name: "redirectCookieMaxAge",
      type: "number",
      defaultValue: "300",
      description: t.props.login.redirectCookieMaxAge,
    },
  ];

  const cguOptionsProps: PropRow[] = [
    {
      name: "authPortalUrl",
      type: "string",
      required: true,
      description: t.props.cgu.authPortalUrl,
    },
    {
      name: "cguPath",
      type: "string",
      defaultValue: '"/cgu"',
      description: t.props.cgu.cguPath,
    },
    {
      name: "legalNoticeAnchor",
      type: "string",
      description: t.props.cgu.legalNoticeAnchor,
    },
  ];

  return (
    <DocPage title="RouteGuard" intro={t.intro} importCode={importCode}>
      <DocSection
        title={t.sections.currentUser.title}
        description={t.sections.currentUser.description}
      >
        <CodeBlock code={currentUserCode} />
      </DocSection>
      <DocSection title={t.sections.guard.title} description={t.sections.guard.description}>
        <CodeBlock code={routeGuardCode} />
      </DocSection>
      <DocSection title={t.sections.hook.title} description={t.sections.hook.description}>
        <CodeBlock code={useRouteGuardCode} />
      </DocSection>
      <DocSection title={t.sections.factory.title} description={t.sections.factory.description}>
        <CodeBlock code={createRouteGuardCode} />
      </DocSection>
      <DocSection
        title={t.sections.navigation.title}
        description={t.sections.navigation.description}
      >
        <CodeBlock code={navigationCode} />
      </DocSection>
      <DocSection title="API — CanopRouteGuardProps">
        <PropsTable rows={routeGuardProps} />
      </DocSection>
      <DocSection title="API — CanopLoginUrlOptions">
        <PropsTable rows={loginOptionsProps} />
      </DocSection>
      <DocSection title="API — CanopCguUrlOptions">
        <PropsTable rows={cguOptionsProps} />
      </DocSection>
    </DocPage>
  );
}
