import { renderWelcomeEmail, type WelcomeEmailInput } from "./welcome.js";

export const emailTemplates = {
  welcome: renderWelcomeEmail,
} as const;

export type EmailTemplateName = keyof typeof emailTemplates;

export interface EmailTemplatePropsMap {
  welcome: WelcomeEmailInput;
}
