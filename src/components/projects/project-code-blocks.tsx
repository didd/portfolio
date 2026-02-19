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
              className="font-mono text-[0.6rem] text-p-text3 tracking-widest uppercase mb-2"
            >
              {block.label}
            </div>

            <div
              role="region"
              aria-roledescription="code"
              aria-labelledby={codeLabelId}
              tabIndex={0}
              className="bg-p-bg3 border border-p-border2 p-5 mb-6 overflow-x-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-p-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-p-bg"
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
