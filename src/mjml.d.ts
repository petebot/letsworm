declare module "mjml" {
  export type MjmlValidationLevel = "strict" | "soft" | "skip";

  export interface MjmlError {
    line?: number;
    message: string;
    tagName?: string;
    formattedMessage?: string;
  }

  export interface MjmlOptions {
    filePath?: string;
    minify?: boolean;
    validationLevel?: MjmlValidationLevel;
  }

  export interface MjmlResult {
    html: string;
    errors: MjmlError[];
  }

  export default function mjml2html(
    input: string,
    options?: MjmlOptions,
  ): MjmlResult;
}
