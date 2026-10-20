export type TokenKind = "keyword" | "string" | "comment" | "number" | "tag" | "attr" | "plain";

export interface CodeToken {
  kind: TokenKind;
  text: string;
}

const KEYWORDS =
  /^(?:import|from|export|default|const|let|var|function|return|if|else|switch|case|break|new|type|interface|extends|async|await|of|in|typeof|null|undefined|true|false|void)\b/;

const patterns: Array<{ kind: TokenKind; regex: RegExp }> = [
  { kind: "comment", regex: /^\/\/[^\n]*|^\/\*[\s\S]*?\*\// },
  { kind: "string", regex: /^"(?:[^"\\\n]|\\.)*"|^'(?:[^'\\\n]|\\.)*'|^`(?:[^`\\]|\\.)*`/ },
  { kind: "keyword", regex: KEYWORDS },
  { kind: "number", regex: /^\d+(?:\.\d+)?/ },
  { kind: "tag", regex: /^<\/?[A-Za-z][\w.]*|^\/>|^>/ },
  { kind: "attr", regex: /^[a-zA-Z_$][\w$-]*(?==)/ },
  { kind: "plain", regex: /^[a-zA-Z_$][\w$]*|^\s+/ },
];

export function tokenizeTsx(code: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let rest = code;

  const push = (kind: TokenKind, text: string) => {
    const previous = tokens[tokens.length - 1];
    if (kind === "plain" && previous?.kind === "plain") {
      previous.text += text;
    } else {
      tokens.push({ kind, text });
    }
  };

  while (rest.length > 0) {
    let consumed = 0;
    for (const { kind, regex } of patterns) {
      const match = regex.exec(rest);
      if (match && match[0].length > 0) {
        push(kind, match[0]);
        consumed = match[0].length;
        break;
      }
    }
    if (consumed === 0) {
      push("plain", rest[0]);
      consumed = 1;
    }
    rest = rest.slice(consumed);
  }

  return tokens;
}
