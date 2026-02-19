"use client";

import { Highlight } from "prism-react-renderer";

type CodeBlockProps = {
  code: string;
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
};

const TOKEN_CLASS_MAP: Record<string, string> = {
  keyword: "code-kw",
  operator: "code-kw",
  tag: "code-kw",
  function: "code-fn",
  "class-name": "code-fn",
  method: "code-fn",
  string: "code-str",
  "attr-value": "code-str",
  comment: "code-cm",
  prolog: "code-cm",
  doctype: "code-cm",
  cdata: "code-cm",
  number: "code-num",
  boolean: "code-num",
  builtin: "code-fn",
  constant: "code-num",
  property: "code-fn",
  "attr-name": "code-fn",
};

function getTokenClass(types: string[]): string | undefined {
  for (const type of types) {
    if (TOKEN_CLASS_MAP[type]) return TOKEN_CLASS_MAP[type];
  }
  return undefined;
}

export function CodeBlock({ code, language = "tsx" }: CodeBlockProps) {
  return (
    <Highlight
      code={code.trimEnd()}
      language={language}
      theme={{
        plain: { color: "inherit", backgroundColor: "transparent" },
        styles: [],
      }}
    >
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre className="m-0 p-0 bg-transparent text-p-text font-mono text-[0.938rem] leading-relaxed">
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => {
                const props = getTokenProps({ token });
                const cls = getTokenClass(token.types);
                return (
                  <span
                    key={key}
                    {...props}
                    className={cls || props.className}
                    style={cls ? undefined : props.style}
                  />
                );
              })}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
