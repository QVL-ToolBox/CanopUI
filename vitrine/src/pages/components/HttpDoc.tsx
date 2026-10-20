import { CodeBlock } from "../../kit/CodeBlock";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import { PropsTable, type PropRow } from "../../kit/PropsTable";
import { useDocLocale } from "../../i18n/useDocLocale";

const importCode = `import { createApiClient, CanopApiError } from "@canop/ui";`;

const clientCode = `import { createApiClient } from "@canop/ui";

const api = createApiClient({
  basePath: "/api",
  withRefresh: true,
  refreshPath: "/api/auth/refresh",
});

interface Profile {
  id: string;
  displayName: string;
}

const profile = await api.request<Profile>("/me");

await api.request<Profile>("/me", {
  method: "PATCH",
  body: JSON.stringify({ displayName: "Martin" }),
});`;

const formDataCode = `const form = new FormData();
form.append("file", file);

await api.request("/documents", {
  method: "POST",
  body: form,
});`;

const errorCode = `import { CanopApiError, apiErrorMessage, useTranslation } from "@canop/ui";

function useRequest() {
  const { t } = useTranslation();

  return async () => {
    try {
      return await api.request("/me");
    } catch (error) {
      if (error instanceof CanopApiError) {
        const message = apiErrorMessage(t, error.code, "Une erreur est survenue.");
        showToast(message);
      }
      throw error;
    }
  };
}`;

const fr = {
  intro:
    "Client HTTP minimal au-dessus de fetch. Il préfixe les chemins, sérialise le JSON, préserve les envois FormData, rafraîchit automatiquement la session sur 401 et transforme les réponses en erreur en CanopApiError typée.",
  sections: {
    client: {
      title: "Client de requête",
      description:
        "createApiClient renvoie un objet exposant request. Les corps JSON reçoivent automatiquement l'en-tête Content-Type et les réponses 204 renvoient undefined.",
    },
    formData: {
      title: "Envoi de FormData",
      description:
        "Lorsque le corps est un FormData, aucun Content-Type n'est forcé : le navigateur gère la frontière multipart, idéal pour les téléversements.",
    },
    errors: {
      title: "Gestion des erreurs",
      description:
        "Toute réponse non-ok lève une CanopApiError porteuse du statut et d'un éventuel code applicatif. apiErrorMessage résout un message traduit à partir de ce code, avec repli.",
    },
  },
  props: {
    client: {
      basePath: "Préfixe ajouté devant chaque chemin de requête.",
      withRefresh: "Rejoue la requête après un rafraîchissement de session en cas de réponse 401.",
      refreshPath: "Chemin appelé en POST pour rafraîchir la session.",
    },
    error: {
      status: "Code de statut HTTP de la réponse en erreur.",
      message: "Message d'erreur, issu du corps de réponse ou construit par défaut.",
      code: "Code d'erreur applicatif renvoyé par le serveur, si présent.",
    },
  },
};

const en: typeof fr = {
  intro:
    "Minimal HTTP client on top of fetch. It prefixes paths, serializes JSON, preserves FormData submissions, automatically refreshes the session on 401 and turns error responses into a typed CanopApiError.",
  sections: {
    client: {
      title: "Request client",
      description:
        "createApiClient returns an object exposing request. JSON bodies automatically receive the Content-Type header and 204 responses return undefined.",
    },
    formData: {
      title: "Sending FormData",
      description:
        "When the body is a FormData, no Content-Type is forced: the browser handles the multipart boundary, ideal for uploads.",
    },
    errors: {
      title: "Error handling",
      description:
        "Any non-ok response throws a CanopApiError carrying the status and an optional application code. apiErrorMessage resolves a translated message from that code, with a fallback.",
    },
  },
  props: {
    client: {
      basePath: "Prefix prepended to every request path.",
      withRefresh: "Replays the request after a session refresh on a 401 response.",
      refreshPath: "Path called with POST to refresh the session.",
    },
    error: {
      status: "HTTP status code of the error response.",
      message: "Error message, taken from the response body or built by default.",
      code: "Application error code returned by the server, when present.",
    },
  },
};

const texts = { fr, en };

export default function HttpDoc() {
  const t = texts[useDocLocale()];

  const clientOptions: PropRow[] = [
    {
      name: "basePath",
      type: "string",
      required: true,
      description: t.props.client.basePath,
    },
    {
      name: "withRefresh",
      type: "boolean",
      defaultValue: "false",
      description: t.props.client.withRefresh,
    },
    {
      name: "refreshPath",
      type: "string",
      defaultValue: '"/api/auth/refresh"',
      description: t.props.client.refreshPath,
    },
  ];

  const errorProps: PropRow[] = [
    {
      name: "status",
      type: "number",
      required: true,
      description: t.props.error.status,
    },
    {
      name: "message",
      type: "string",
      required: true,
      description: t.props.error.message,
    },
    {
      name: "code",
      type: "string",
      description: t.props.error.code,
    },
  ];

  return (
    <DocPage title="http" intro={t.intro} importCode={importCode}>
      <DocSection title={t.sections.client.title} description={t.sections.client.description}>
        <CodeBlock code={clientCode} />
      </DocSection>
      <DocSection title={t.sections.formData.title} description={t.sections.formData.description}>
        <CodeBlock code={formDataCode} />
      </DocSection>
      <DocSection title={t.sections.errors.title} description={t.sections.errors.description}>
        <CodeBlock code={errorCode} />
      </DocSection>
      <DocSection title="API — CanopApiClientOptions">
        <PropsTable rows={clientOptions} />
      </DocSection>
      <DocSection title="API — CanopApiError">
        <PropsTable rows={errorProps} />
      </DocSection>
    </DocPage>
  );
}
