import mjml2html, { type MjmlError, type MjmlOptions } from "mjml";

export interface RenderMjmlOptions
  extends Pick<MjmlOptions, "filePath" | "minify"> {
  validationLevel?: MjmlOptions["validationLevel"];
}

const formatMjmlErrors = (errors: MjmlError[]) =>
  errors
    .map((error) => {
      const linePrefix = error.line ? `line ${error.line}: ` : "";
      return `${linePrefix}${error.message}`;
    })
    .join("\n");

export const renderMjml = (
  template: string,
  {
    filePath,
    minify = false,
    validationLevel = "strict",
  }: RenderMjmlOptions = {},
) => {
  try {
    const result = mjml2html(template, {
      filePath,
      minify,
      validationLevel,
    });

    if (result.errors.length > 0) {
      throw new Error(
        `MJML render failed:\n${formatMjmlErrors(result.errors)}`,
      );
    }

    return result.html;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.startsWith("MJML render failed:\n")) {
        throw error;
      }

      throw new Error(`MJML render failed:\n${error.message}`);
    }

    throw error;
  }
};
