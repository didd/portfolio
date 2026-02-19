export type BadgeVariant = "oss" | "enterprise" | "perf" | "full";

export type ProjectLink = {
  label: string;
  href: string;
  dim?: boolean;
};

export type ProjectCodeBlock = {
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
};

export interface Project {
  id: string;
  badge: { label: string; variant: BadgeVariant };
  title: string;
  role: string;
  problem: string;
  impact: string[];
  stack: string[];
  links: ProjectLink[];
  code?: ProjectCodeBlock[];
}
