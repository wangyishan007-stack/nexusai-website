import { useState, useCallback, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface MarkdownRendererProps {
  readonly content: string;
  readonly className?: string;
}

function CopyButton({ code }: { readonly code: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition-colors"
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: 14, fontVariationSettings: "'wght' 300" }}
      >
        {copied ? "check" : "content_copy"}
      </span>
      {copied ? t("chat.copied") : t("chat.copy")}
    </button>
  );
}

function renderCodeBlock(code: string, lang: string, index: number): ReactNode {
  return (
    <div key={`code-${String(index)}`} className="relative my-3 group">
      {lang && (
        <div className="text-[11px] text-slate-400 bg-slate-800 rounded-t-lg px-4 py-1.5 border-b border-slate-700 font-body">
          {lang}
        </div>
      )}
      <pre
        className={`bg-slate-800 text-slate-100 p-4 overflow-x-auto text-sm leading-relaxed ${
          lang ? "rounded-b-lg" : "rounded-lg"
        }`}
      >
        <code>{code}</code>
      </pre>
      <CopyButton code={code} />
    </div>
  );
}

function applyInlineFormatting(text: string): ReactNode[] {
  // Process inline code, bold, and italic via regex splitting
  // Order matters: inline code first (so backticks inside bold/italic are handled),
  // then bold, then italic
  const parts: ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  const inlinePattern = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/;

  while (remaining.length > 0) {
    const match = inlinePattern.exec(remaining);
    if (!match) {
      parts.push(remaining);
      break;
    }

    const beforeMatch = remaining.slice(0, match.index);
    if (beforeMatch) {
      parts.push(beforeMatch);
    }

    const token = match[0];
    if (token.startsWith("`")) {
      // Inline code
      parts.push(
        <code
          key={`ic-${String(keyIndex)}`}
          className="bg-surface-container-high text-primary px-1.5 py-0.5 rounded text-[0.85em] font-mono"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**")) {
      // Bold
      parts.push(
        <strong key={`b-${String(keyIndex)}`}>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*")) {
      // Italic
      parts.push(
        <em key={`i-${String(keyIndex)}`}>
          {token.slice(1, -1)}
        </em>
      );
    }

    keyIndex++;
    remaining = remaining.slice(match.index + token.length);
  }

  return parts;
}

function renderLine(line: string, index: number): ReactNode {
  return <span key={`ln-${String(index)}`}>{applyInlineFormatting(line)}</span>;
}

function renderParagraphBlock(text: string, blockIndex: number): ReactNode {
  const lines = text.split("\n");

  // Check if block is an unordered list
  if (lines.every((l) => l.trimStart().startsWith("- ") || l.trim() === "")) {
    const items = lines.filter((l) => l.trimStart().startsWith("- "));
    return (
      <ul key={`ul-${String(blockIndex)}`} className="list-disc pl-5 my-2 space-y-1 text-sm leading-relaxed">
        {items.map((item, i) => (
          <li key={`li-${String(i)}`}>
            {applyInlineFormatting(item.trimStart().slice(2))}
          </li>
        ))}
      </ul>
    );
  }

  // Check if block is an ordered list
  if (lines.every((l) => /^\s*\d+\.\s/.test(l) || l.trim() === "")) {
    const items = lines.filter((l) => /^\s*\d+\.\s/.test(l));
    return (
      <ol key={`ol-${String(blockIndex)}`} className="list-decimal pl-5 my-2 space-y-1 text-sm leading-relaxed">
        {items.map((item, i) => (
          <li key={`li-${String(i)}`}>
            {applyInlineFormatting(item.replace(/^\s*\d+\.\s/, ""))}
          </li>
        ))}
      </ol>
    );
  }

  // Check if block is a blockquote
  if (lines.every((l) => l.startsWith("> ") || l.trim() === "")) {
    const quoteLines = lines.filter((l) => l.startsWith("> "));
    return (
      <blockquote
        key={`bq-${String(blockIndex)}`}
        className="border-l-3 border-primary/30 pl-4 my-3 text-on-surface-variant italic text-sm leading-relaxed"
      >
        {quoteLines.map((line, i) => (
          <p key={`bql-${String(i)}`} className="my-1">
            {applyInlineFormatting(line.slice(2))}
          </p>
        ))}
      </blockquote>
    );
  }

  // Regular paragraph -- handle single-line breaks within
  return (
    <p key={`p-${String(blockIndex)}`} className="my-2 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (i === 0) return renderLine(line, i);
        return (
          <span key={`br-${String(i)}`}>
            <br />
            {applyInlineFormatting(line)}
          </span>
        );
      })}
    </p>
  );
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  // Step 1: Split by triple-backtick fences
  const segments = content.split(/(```[\s\S]*?```)/);
  const elements: ReactNode[] = [];
  let elementIndex = 0;

  for (const segment of segments) {
    if (segment.startsWith("```")) {
      // Code block: extract language and code
      const firstNewline = segment.indexOf("\n");
      const lang = firstNewline > 3 ? segment.slice(3, firstNewline).trim() : "";
      const codeEnd = segment.length - 3; // strip trailing ```
      const codeStart = firstNewline > -1 ? firstNewline + 1 : 3;
      const code = segment.slice(codeStart, codeEnd);
      elements.push(renderCodeBlock(code, lang, elementIndex));
      elementIndex++;
    } else {
      // Prose: split by double newlines into paragraph blocks
      const blocks = segment.split(/\n\n+/);
      for (const block of blocks) {
        const trimmed = block.trim();
        if (!trimmed) continue;
        elements.push(renderParagraphBlock(trimmed, elementIndex));
        elementIndex++;
      }
    }
  }

  return <div className={`markdown-content ${className}`}>{elements}</div>;
};
