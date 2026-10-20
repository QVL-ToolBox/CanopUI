import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CanopI18nProvider } from "../../../i18n";
import { CanopThemeProvider } from "../../../theme";
import type { CanopUploadPhase, CanopUploadProgress } from "../../core";
import { FileUploader, type CanopFileUploaderProps } from "../FileUploader";
import type { CanopFileUploaderLabels } from "../labels";
import type { UseChunkedUploadResult } from "../useChunkedUpload";

const { useChunkedUploadSpy } = vi.hoisted(() => ({ useChunkedUploadSpy: vi.fn() }));

vi.mock("../useChunkedUpload", () => ({ useChunkedUpload: useChunkedUploadSpy }));

const testLabels: CanopFileUploaderLabels = {
  dropZoneTitle: "Titre de depot",
  dropZoneHint: "Indice de depot",
  start: "Lancer",
  pause: "Suspendre",
  resume: "Poursuivre",
  abort: "Interrompre",
  change: "Remplacer",
  opening: "Ouverture",
  uploading: "Envoi",
  completing: "Cloture",
  completed: "Termine",
  paused: "Suspendu",
  aborted: "Interrompu",
};

function makeProgress(
  phase: CanopUploadPhase,
  overrides: Partial<CanopUploadProgress> = {},
): CanopUploadProgress {
  return {
    phase,
    strategy: "chunked",
    uploadedBytes: 0,
    totalBytes: 0,
    ratio: 0,
    percentage: 0,
    chunkCount: 0,
    completedChunkCount: 0,
    ...overrides,
  };
}

function makeState(overrides: Partial<UseChunkedUploadResult> = {}): UseChunkedUploadResult {
  return {
    progress: makeProgress("idle"),
    fileName: null,
    errorMessage: null,
    isActive: false,
    canPause: false,
    canResume: false,
    selectFile: vi.fn(),
    start: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    abort: vi.fn(),
    reset: vi.fn(),
    ...overrides,
  };
}

function renderUploader(props: Partial<CanopFileUploaderProps> = {}) {
  return render(
    <CanopThemeProvider>
      <FileUploader basePath="/api" getToken={() => "tok"} labels={testLabels} {...props} />
    </CanopThemeProvider>,
  );
}

beforeEach(() => {
  useChunkedUploadSpy.mockReturnValue(makeState());
});

describe("FileUploader - selection du fichier", () => {
  it("affiche la zone de depot tant qu'aucun fichier n'est choisi", () => {
    renderUploader();
    expect(screen.getByRole("button", { name: testLabels.dropZoneTitle })).toBeInTheDocument();
    expect(screen.getByText(testLabels.dropZoneHint)).toBeInTheDocument();
  });

  it("remplace la zone de depot par le nom et la taille du fichier", () => {
    useChunkedUploadSpy.mockReturnValue(
      makeState({
        fileName: "video.mp4",
        progress: makeProgress("idle", { totalBytes: 2048 }),
      }),
    );
    renderUploader();
    expect(screen.getByText("video.mp4")).toBeInTheDocument();
    expect(screen.getByText("2 Kio")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: testLabels.dropZoneTitle }),
    ).not.toBeInTheDocument();
  });

  it("affiche le titre fourni en en-tete de carte", () => {
    renderUploader({ title: "Depot de documents" });
    expect(screen.getByText("Depot de documents")).toBeInTheDocument();
  });
});

describe("FileUploader - suivi de progression", () => {
  it("masque la barre de progression en phase inactive", () => {
    renderUploader();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("affiche la progression chiffree pendant l'envoi", () => {
    useChunkedUploadSpy.mockReturnValue(
      makeState({
        fileName: "video.mp4",
        isActive: true,
        canPause: true,
        progress: makeProgress("uploading", {
          uploadedBytes: 1024,
          totalBytes: 4096,
          percentage: 25,
        }),
      }),
    );
    renderUploader();
    expect(screen.getByRole("progressbar", { name: testLabels.uploading })).toHaveAttribute(
      "aria-valuenow",
      "25",
    );
    expect(screen.getByText("1 Kio / 4 Kio")).toBeInTheDocument();
  });

  it.each<[CanopUploadPhase, keyof CanopFileUploaderLabels]>([
    ["opening", "opening"],
    ["uploading", "uploading"],
    ["completing", "completing"],
    ["completed", "completed"],
    ["paused", "paused"],
    ["aborted", "aborted"],
  ])("nomme la barre de progression pour la phase %s", (phase, labelKey) => {
    useChunkedUploadSpy.mockReturnValue(
      makeState({ fileName: "video.mp4", progress: makeProgress(phase) }),
    );
    renderUploader();
    expect(screen.getByRole("progressbar", { name: testLabels[labelKey] })).toBeInTheDocument();
  });

  it("laisse la barre sans libelle en phase d'erreur", () => {
    useChunkedUploadSpy.mockReturnValue(
      makeState({
        fileName: "video.mp4",
        errorMessage: "Serveur indisponible",
        progress: makeProgress("error"),
      }),
    );
    renderUploader();
    expect(screen.getByRole("progressbar")).not.toHaveAccessibleName();
  });

  it("affiche le message d'erreur remonte par le hook", () => {
    useChunkedUploadSpy.mockReturnValue(
      makeState({ fileName: "video.mp4", errorMessage: "Serveur indisponible" }),
    );
    renderUploader();
    expect(screen.getByRole("alert")).toHaveTextContent("Serveur indisponible");
  });

  it("n'affiche aucun bandeau d'erreur en fonctionnement nominal", () => {
    renderUploader();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

describe("FileUploader - commandes proposees", () => {
  it("ne propose aucune commande tant qu'aucun fichier n'est choisi", () => {
    renderUploader();
    expect(screen.queryByRole("button", { name: testLabels.start })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: testLabels.change })).not.toBeInTheDocument();
  });

  it("propose le lancement et le changement de fichier avant le depart", async () => {
    const start = vi.fn();
    const reset = vi.fn();
    useChunkedUploadSpy.mockReturnValue(makeState({ fileName: "video.mp4", start, reset }));
    renderUploader();
    await userEvent.click(screen.getByRole("button", { name: testLabels.start }));
    await userEvent.click(screen.getByRole("button", { name: testLabels.change }));
    expect(start).toHaveBeenCalledOnce();
    expect(reset).toHaveBeenCalledOnce();
  });

  it("propose la mise en pause quand le hook l'autorise", async () => {
    const pause = vi.fn();
    useChunkedUploadSpy.mockReturnValue(
      makeState({
        fileName: "video.mp4",
        isActive: true,
        canPause: true,
        pause,
        progress: makeProgress("uploading"),
      }),
    );
    renderUploader();
    await userEvent.click(screen.getByRole("button", { name: testLabels.pause }));
    expect(pause).toHaveBeenCalledOnce();
  });

  it("propose la reprise et l'annulation en pause", async () => {
    const resume = vi.fn();
    const abort = vi.fn();
    useChunkedUploadSpy.mockReturnValue(
      makeState({
        fileName: "video.mp4",
        canResume: true,
        resume,
        abort,
        progress: makeProgress("paused"),
      }),
    );
    renderUploader();
    await userEvent.click(screen.getByRole("button", { name: testLabels.resume }));
    await userEvent.click(screen.getByRole("button", { name: testLabels.abort }));
    expect(resume).toHaveBeenCalledOnce();
    expect(abort).toHaveBeenCalledOnce();
  });

  it("propose l'annulation pendant un envoi actif", () => {
    useChunkedUploadSpy.mockReturnValue(
      makeState({ fileName: "video.mp4", isActive: true, progress: makeProgress("uploading") }),
    );
    renderUploader();
    expect(screen.getByRole("button", { name: testLabels.abort })).toBeInTheDocument();
  });

  it("propose de changer de fichier une fois le televersement termine", () => {
    useChunkedUploadSpy.mockReturnValue(
      makeState({ fileName: "video.mp4", progress: makeProgress("completed") }),
    );
    renderUploader();
    expect(screen.getByRole("button", { name: testLabels.change })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: testLabels.abort })).not.toBeInTheDocument();
  });

  it("propose de changer de fichier apres une annulation", () => {
    useChunkedUploadSpy.mockReturnValue(
      makeState({ fileName: "video.mp4", progress: makeProgress("aborted") }),
    );
    renderUploader();
    expect(screen.getByRole("button", { name: testLabels.change })).toBeInTheDocument();
  });

  it("ne propose ni pause ni reprise en phase d'ouverture", () => {
    useChunkedUploadSpy.mockReturnValue(
      makeState({ fileName: "video.mp4", isActive: true, progress: makeProgress("opening") }),
    );
    renderUploader();
    expect(screen.queryByRole("button", { name: testLabels.pause })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: testLabels.resume })).not.toBeInTheDocument();
  });
});

describe("FileUploader - libelles et internationalisation", () => {
  function renderWithMessages(node: React.ReactElement) {
    return render(<CanopThemeProvider>{node}</CanopThemeProvider>);
  }

  it("consomme les traductions canop.upload de la locale active", () => {
    renderWithMessages(
      <CanopI18nProvider
        locale="en"
        storageKey={null}
        messages={{ en: { "canop.upload.dropZoneHint": "Files up to 10 GiB" } }}
      >
        <FileUploader basePath="/api" getToken={() => "tok"} />
      </CanopI18nProvider>,
    );
    expect(screen.getByText("Files up to 10 GiB")).toBeInTheDocument();
  });

  it("laisse la surcharge explicite primer sur la traduction", () => {
    renderWithMessages(
      <CanopI18nProvider
        locale="fr"
        storageKey={null}
        messages={{ fr: { "canop.upload.dropZoneHint": "Traduction" } }}
      >
        <FileUploader
          basePath="/api"
          getToken={() => "tok"}
          labels={{ dropZoneHint: "PDF uniquement" }}
        />
      </CanopI18nProvider>,
    );
    expect(screen.getByText("PDF uniquement")).toBeInTheDocument();
    expect(screen.queryByText("Traduction")).not.toBeInTheDocument();
  });

  it("ne surcharge que les libelles explicitement fournis", () => {
    renderWithMessages(
      <CanopI18nProvider
        locale="fr"
        storageKey={null}
        messages={{
          fr: {
            "canop.upload.dropZoneTitle": "Titre traduit",
            "canop.upload.dropZoneHint": "Indice traduit",
          },
        }}
      >
        <FileUploader
          basePath="/api"
          getToken={() => "tok"}
          labels={{ dropZoneHint: "Indice surcharge" }}
        />
      </CanopI18nProvider>,
    );
    expect(screen.getByRole("button", { name: "Titre traduit" })).toBeInTheDocument();
    expect(screen.getByText("Indice surcharge")).toBeInTheDocument();
  });
});
