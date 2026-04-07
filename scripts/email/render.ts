import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import {
  emailTemplates,
  type EmailTemplateName,
} from "../../src/lib/server/email/templates/index.js";

type RenderMode = "preview" | "export";

interface CliOptions {
  template: EmailTemplateName;
  propsPath: string;
  outPath?: string;
  stdout: boolean;
}

const cwd = process.cwd();
const previewDir = path.join(cwd, ".tmp", "email-previews");
const exportDir = path.join(cwd, "dist", "email");

const fail = (message: string): never => {
  console.error(message);
  process.exit(1);
};

const parseFlag = (args: string[], flag: string) => {
  const index = args.indexOf(flag);

  if (index === -1) {
    return undefined;
  }

  const value = args[index + 1];

  if (!value || value.startsWith("--")) {
    fail(`Missing value for ${flag}`);
  }

  return value;
};

const hasFlag = (args: string[], flag: string) => args.includes(flag);

const resolveTemplate = (templateArg?: string): EmailTemplateName => {
  const template = (templateArg ?? "welcome") as EmailTemplateName;

  if (!(template in emailTemplates)) {
    fail(
      `Unknown template "${template}". Available templates: ${Object.keys(emailTemplates).join(", ")}`,
    );
  }

  return template;
};

const parseArgs = (mode: RenderMode, args: string[]): CliOptions => {
  const template = resolveTemplate(parseFlag(args, "--template"));
  const propsPath = path.resolve(
    cwd,
    parseFlag(args, "--props") ??
      path.join("scripts", "email", "examples", `${template}.json`),
  );
  const outPath = parseFlag(args, "--out");

  return {
    template,
    propsPath,
    outPath: outPath ? path.resolve(cwd, outPath) : undefined,
    stdout: mode === "export" && hasFlag(args, "--stdout"),
  };
};

const readProps = async (propsPath: string) => {
  const raw = await readFile(propsPath, "utf8");
  return JSON.parse(raw) as Record<string, unknown>;
};

const getDefaultOutPath = (mode: RenderMode, template: EmailTemplateName) =>
  path.join(mode === "preview" ? previewDir : exportDir, `${template}.html`);

const main = async () => {
  const [modeArg, ...args] = process.argv.slice(2);

  if (modeArg !== "preview" && modeArg !== "export") {
    fail(
      "Usage: node .tmp/email-cli/scripts/email/render.js <preview|export> [--template name] [--props path] [--out path] [--stdout]",
    );
  }

  const mode = modeArg as RenderMode;
  const options = parseArgs(mode, args);
  const templateRenderer = emailTemplates[options.template];
  const props = await readProps(options.propsPath);
  const email = templateRenderer(props as never);

  if (options.stdout) {
    process.stdout.write(email.html);
    return;
  }

  const outPath = options.outPath ?? getDefaultOutPath(mode, options.template);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, email.html, "utf8");

  console.log(
    `${mode === "preview" ? "Preview" : "Export"} written to ${outPath}`,
  );
  console.log(`Subject: ${email.subject}`);
  console.log(`Props: ${options.propsPath}`);
};

main().catch((error) => {
  if (error instanceof Error) {
    fail(error.message);
  }

  fail("Unknown render error");
});
