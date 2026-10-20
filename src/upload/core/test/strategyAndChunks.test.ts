import { describe, expect, it } from "vitest";
import {
  selectStrategy,
  planChunks,
  countChunks,
  firstMissingChunkIndex,
  pendingChunks,
} from "../index";

const MIB = 1024 * 1024;
const CHUNK = 16 * MIB;
const THRESHOLD = 100 * MIB;

describe("AC routage par seuil - selectStrategy", () => {
  it("retourne single-shot pour un fichier strictement sous 100 Mio", () => {
    expect(selectStrategy(THRESHOLD - 1)).toBe("single-shot");
  });

  it("retourne single-shot pour un petit fichier", () => {
    expect(selectStrategy(5 * MIB)).toBe("single-shot");
  });

  it("retourne single-shot pour un fichier vide", () => {
    expect(selectStrategy(0)).toBe("single-shot");
  });

  it("retourne chunked exactement a la borne 100 Mio", () => {
    expect(selectStrategy(THRESHOLD)).toBe("chunked");
  });

  it("retourne chunked au-dessus de 100 Mio", () => {
    expect(selectStrategy(THRESHOLD + 1)).toBe("chunked");
    expect(selectStrategy(257 * MIB)).toBe("chunked");
  });

  it("accepte un seuil abaisse pour une passerelle plus stricte", () => {
    const passerelle = 17 * MIB;
    expect(selectStrategy(passerelle - 1, passerelle)).toBe("single-shot");
    expect(selectStrategy(passerelle, passerelle)).toBe("chunked");
    expect(selectStrategy(40 * MIB, passerelle)).toBe("chunked");
  });
});

describe("AC decoupe en chunks de 16 Mio", () => {
  it("decoupe un fichier de 100 Mio en chunks de 16 Mio", () => {
    const ranges = planChunks(100 * MIB, CHUNK);
    expect(ranges).toHaveLength(7);
    for (let i = 0; i < 6; i += 1) {
      expect(ranges[i].size).toBe(CHUNK);
    }
    expect(ranges[6].size).toBe(100 * MIB - 6 * CHUNK);
  });

  it("produit des plages contigues couvrant exactement la taille totale", () => {
    const totalSize = 257 * MIB;
    const ranges = planChunks(totalSize, CHUNK);
    expect(ranges[0].start).toBe(0);
    expect(ranges[ranges.length - 1].end).toBe(totalSize);
    for (let i = 1; i < ranges.length; i += 1) {
      expect(ranges[i].start).toBe(ranges[i - 1].end);
    }
    const covered = ranges.reduce((sum, r) => sum + r.size, 0);
    expect(covered).toBe(totalSize);
  });

  it("indexe les chunks de maniere sequentielle a partir de zero", () => {
    const ranges = planChunks(257 * MIB, CHUNK);
    ranges.forEach((range, position) => {
      expect(range.index).toBe(position);
    });
  });

  it("compte le bon nombre de chunks pour une taille multiple exacte", () => {
    expect(countChunks(CHUNK * 4, CHUNK)).toBe(4);
  });

  it("compte le bon nombre de chunks pour une taille non multiple", () => {
    expect(countChunks(257 * MIB, CHUNK)).toBe(Math.ceil((257 * MIB) / CHUNK));
    expect(countChunks(257 * MIB, CHUNK)).toBe(17);
  });

  it("compte un dernier chunk partiel", () => {
    const ranges = planChunks(CHUNK + 1, CHUNK);
    expect(ranges).toHaveLength(2);
    expect(ranges[1].size).toBe(1);
  });
});

describe("AC reprise - firstMissingChunkIndex", () => {
  it("reprend a l'index 0 quand aucun octet recu", () => {
    expect(firstMissingChunkIndex(0, CHUNK)).toBe(0);
  });

  it("calcule l'index de reprise comme floor(received / chunkSize)", () => {
    expect(firstMissingChunkIndex(CHUNK * 3, CHUNK)).toBe(3);
    expect(firstMissingChunkIndex(CHUNK * 3 + 1, CHUNK)).toBe(3);
  });

  it("ne saute pas un chunk partiellement recu", () => {
    expect(firstMissingChunkIndex(CHUNK * 2 + CHUNK / 2, CHUNK)).toBe(2);
  });
});

describe("AC reprise - pendingChunks ne re-emet pas les chunks deja recus", () => {
  it("retourne tous les chunks quand rien n'est recu", () => {
    const all = planChunks(257 * MIB, CHUNK);
    const pending = pendingChunks(all, 0, CHUNK);
    expect(pending).toHaveLength(all.length);
  });

  it("exclut les chunks dont l'index est sous l'index de reprise", () => {
    const all = planChunks(257 * MIB, CHUNK);
    const received = CHUNK * 5;
    const pending = pendingChunks(all, received, CHUNK);
    expect(pending[0].index).toBe(5);
    expect(pending.every((chunk) => chunk.index >= 5)).toBe(true);
    expect(pending.some((chunk) => chunk.index < 5)).toBe(false);
  });

  it("ne retourne aucun chunk quand tout est recu", () => {
    const totalSize = CHUNK * 4;
    const all = planChunks(totalSize, CHUNK);
    const pending = pendingChunks(all, totalSize, CHUNK);
    expect(pending).toHaveLength(0);
  });

  it("reprend exactement au chunk partiel sans renvoyer les precedents", () => {
    const all = planChunks(257 * MIB, CHUNK);
    const received = CHUNK * 3 + 1000;
    const pending = pendingChunks(all, received, CHUNK);
    expect(pending[0].index).toBe(3);
  });
});
