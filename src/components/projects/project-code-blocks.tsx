import { CodeBlock } from "./code-block";

type ProjectCodeBlocksProps = {
  projectId: string;
  code?: {
    label: string;
    content: string;
    language?:
      | "ts"
      | "tsx"
      | "js"
      | "jsx"
      | "json"
      | "bash"
      | "css"
      | "html"
      | "md";
  }[];
};

export function ProjectCodeBlocks({ projectId, code }: ProjectCodeBlocksProps) {
  if (!code?.length) return null;

  return (
    <>
      {code.map((block) => {
        const codeLabelId = `code-${projectId}-${block.label
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")}`;

        return (
          <div key={block.label}>
            <div
              id={codeLabelId}
              className="mb-2 font-mono text-[0.55rem] uppercase tracking-widest text-p-text3 sm:text-[0.6rem]"
            >
              {block.label}
            </div>

            <div
              role="region"
              aria-roledescription="code"
              aria-labelledby={codeLabelId}
              tabIndex={0}
              className="mb-6 min-w-0 overflow-hidden border border-p-border2 bg-p-bg3 p-3 sm:p-5"
            >
              <CodeBlock
                code={block.content}
                language={block.language ?? "tsx"}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}
