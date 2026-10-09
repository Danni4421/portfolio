import { useRef, useState, type KeyboardEvent } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bold,
  Code,
  FileCode2,
  Heading2,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

type ViewMode = "write" | "split" | "preview";

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  autoFocus?: boolean;
  id?: string;
  className?: string;
}

type ToolAction =
  | { type: "wrap"; before: string; after?: string; placeholder?: string }
  | { type: "line"; prefix: string }
  | { type: "block"; block: string }
  | { type: "link" }
  | { type: "image" };

interface ToolSpec {
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  action: ToolAction;
}

const TOOLS: ToolSpec[] = [
  { icon: Heading2, label: "Heading", action: { type: "line", prefix: "## " } },
  { icon: Bold, label: "Bold", shortcut: "⌘B", action: { type: "wrap", before: "**", after: "**", placeholder: "bold" } },
  { icon: Italic, label: "Italic", shortcut: "⌘I", action: { type: "wrap", before: "*", after: "*", placeholder: "italic" } },
  { icon: Strikethrough, label: "Strikethrough", action: { type: "wrap", before: "~~", after: "~~", placeholder: "strike" } },
  { icon: Quote, label: "Quote", action: { type: "line", prefix: "> " } },
  { icon: Code, label: "Inline code", shortcut: "⌘E", action: { type: "wrap", before: "`", after: "`", placeholder: "code" } },
  { icon: FileCode2, label: "Code block", action: { type: "block", block: "```\ncode\n```" } },
  { icon: Link2, label: "Link", shortcut: "⌘K", action: { type: "link" } },
  { icon: ImageIcon, label: "Image", action: { type: "image" } },
  { icon: List, label: "Bullet list", action: { type: "line", prefix: "- " } },
  { icon: ListOrdered, label: "Numbered list", action: { type: "line", prefix: "1. " } },
  { icon: Minus, label: "Divider", action: { type: "block", block: "---" } },
];

const MODES: ViewMode[] = ["write", "split", "preview"];

const MODE_LABEL: Record<ViewMode, string> = {
  write: "Write",
  split: "Split",
  preview: "Preview",
};

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your story in markdown…",
  minHeight = 260,
  autoFocus,
  id,
  className,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<ViewMode>("split");

  const restoreSelection = (start: number, end: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.focus();
    textarea.setSelectionRange(start, end);
  };

  const wrapSelection = (before: string, after = "", placeholderText = "text") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const selected = value.slice(selectionStart, selectionEnd) || placeholderText;
    const next =
      value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd);
    onChange(next);
    const start = selectionStart + before.length;
    requestAnimationFrame(() => restoreSelection(start, start + selected.length));
  };

  const prefixLine = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart } = textarea;
    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const nextNewline = value.indexOf("\n", selectionStart);
    const lineEnd = nextNewline === -1 ? value.length : nextNewline;
    const line = value.slice(lineStart, lineEnd);
    const updated = line.startsWith(prefix) ? line.slice(prefix.length) : prefix + line;
    onChange(value.slice(0, lineStart) + updated + value.slice(lineEnd));
    const caret = lineStart + updated.length;
    requestAnimationFrame(() => restoreSelection(caret, caret));
  };

  const insertBlock = (block: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart } = textarea;
    const needsBreak = selectionStart > 0 && value[selectionStart - 1] !== "\n";
    const insert = (needsBreak ? "\n" : "") + block + "\n";
    onChange(value.slice(0, selectionStart) + insert + value.slice(selectionStart));
    const caret = selectionStart + insert.length;
    requestAnimationFrame(() => restoreSelection(caret, caret));
  };

  const insertLinkOrImage = (kind: "link" | "image") => {
    const url = window.prompt(kind === "image" ? "Image URL" : "Link URL");
    if (!url) return;
    if (kind === "link") {
      wrapSelection("[", `](${url})`, "text");
    } else {
      wrapSelection("![", `](${url})`, "alt text");
    }
  };

  const runTool = (action: ToolAction) => {
    switch (action.type) {
      case "wrap":
        wrapSelection(action.before, action.after, action.placeholder);
        break;
      case "line":
        prefixLine(action.prefix);
        break;
      case "block":
        insertBlock(action.block);
        break;
      case "link":
        insertLinkOrImage("link");
        break;
      case "image":
        insertLinkOrImage("image");
        break;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!event.metaKey && !event.ctrlKey) return;
    switch (event.key.toLowerCase()) {
      case "b":
        event.preventDefault();
        wrapSelection("**", "**", "bold");
        break;
      case "i":
        event.preventDefault();
        wrapSelection("*", "*", "italic");
        break;
      case "e":
        event.preventDefault();
        wrapSelection("`", "`", "code");
        break;
      case "k":
        event.preventDefault();
        insertLinkOrImage("link");
        break;
    }
  };

  const showWrite = mode !== "preview";
  const showPreview = mode !== "write";
  const split = showWrite && showPreview;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow focus-within:border-[#ec7211] focus-within:ring-1 focus-within:ring-[#ec7211]/30",
        className
      )}
    >
      <div className="flex items-center gap-0.5 overflow-x-auto border-b border-neutral-200 bg-neutral-50 px-2 py-1.5">
        {TOOLS.map((tool) => (
          <button
            key={tool.label}
            type="button"
            title={tool.shortcut ? `${tool.label} (${tool.shortcut})` : tool.label}
            aria-label={tool.label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => runTool(tool.action)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-900 cursor-pointer"
          >
            <tool.icon size={14} />
          </button>
        ))}

        <div className="ml-auto flex shrink-0 items-center gap-0.5 pl-2">
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "h-7 rounded-md px-2.5 text-xs font-medium transition-colors cursor-pointer",
                mode === m
                  ? "bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200"
                  : "text-neutral-500 hover:text-neutral-800"
              )}
            >
              {MODE_LABEL[m]}
            </button>
          ))}
        </div>
      </div>

      <div
        className={cn(
          split && "grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200"
        )}
      >
        {showWrite && (
          <textarea
            id={id}
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            spellCheck
            className="block w-full resize-y bg-white px-4 py-3.5 font-serif text-[15px] leading-[1.7] text-neutral-900 outline-none placeholder:text-neutral-400"
            style={{ minHeight }}
          />
        )}

        {showPreview && (
          <div className="overflow-y-auto bg-white px-4 py-3.5" style={{ minHeight }}>
            {value.trim() ? (
              <div className="prose prose-sm prose-neutral max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                <Markdown remarkPlugins={[remarkGfm]}>{value}</Markdown>
              </div>
            ) : (
              <p className="text-sm italic text-neutral-400">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
