import { renderMjml } from "../renderMjml.js";
import { emailTheme } from "../../../theme/tokens.js";

export interface WelcomeEmailInput {
  recipientName: string;
  ctaLabel: string;
  ctaUrl: string;
  oneWormUrl?: string;
  logoUrl?: string;
  logoAlt?: string;
  issueTitle?: string;
  intro?: string;
  previewText?: string;
  closing?: string;
}

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const escapeAttribute = (value: string) => escapeHtml(value);

const buildTextBody = ({
  recipientName,
  intro,
  issueTitle,
  ctaLabel,
  ctaUrl,
  closing,
}: Required<
  Pick<
    WelcomeEmailInput,
    "recipientName" | "intro" | "ctaLabel" | "ctaUrl" | "closing"
  >
> &
  Pick<WelcomeEmailInput, "issueTitle">) =>
  [
    `Hi ${recipientName},`,
    "",
    intro,
    issueTitle ? "" : null,
    issueTitle ? `Featured Issue: ${issueTitle}` : null,
    "",
    `${ctaLabel}: ${ctaUrl}`,
    "",
    closing,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");

export const renderWelcomeEmail = ({
  recipientName,
  ctaLabel,
  ctaUrl,
  oneWormUrl,
  logoUrl,
  logoAlt = "Let's Worm",
  issueTitle,
  intro = "Thanks for joining Let's Worm. We publish literary work that stays weird, sharp, and alive.",
  previewText = "A quick welcome note from Let's Worm.",
  closing = "See you in the next issue,\nLet's Worm",
}: WelcomeEmailInput) => {
  const escapedName = escapeHtml(recipientName);
  const escapedIntro = escapeHtml(intro);
  const escapedPreviewText = escapeHtml(previewText);
  const escapedCtaLabel = escapeHtml(ctaLabel);
  const escapedCtaUrl = escapeHtml(ctaUrl);
  const escapedOneWormUrl = oneWormUrl ? escapeAttribute(oneWormUrl) : null;
  const escapedLogoUrl = logoUrl ? escapeAttribute(logoUrl) : null;
  const escapedLogoAlt = escapeHtml(logoAlt);
  const escapedClosing = escapeHtml(closing).replaceAll("\n", "<br />");
  const escapedIssueTitle = issueTitle ? escapeHtml(issueTitle) : null;
  const escapedFontFamily = escapeAttribute(emailTheme.serifFont);

  const html = renderMjml(`
		<mjml>
			<mj-head>
				<mj-preview>${escapedPreviewText}</mj-preview>
				<mj-attributes>
					<mj-all font-family="${escapedFontFamily}" />
					<mj-text color="${emailTheme.text}" font-size="16px" line-height="1.6" />
					<mj-section padding="0" />
          <mj-column padding="0" />
				</mj-attributes>
			</mj-head>
			<mj-body background-color="${emailTheme.bodyBackground}" 
            width="320px">
        <mj-section padding="32px 20px 16px">
          <mj-column
            background-color="${emailTheme.surface}"
            border="1px solid ${emailTheme.border}"
            padding="28px 24px 28px"
          >
              ${
                escapedOneWormUrl
                  ? `
                    <mj-image
                      src="${escapedOneWormUrl}"
                      alt="One Worm illustration"
                      width="128px"
                      align="center"
                      padding="0 0 18px"
                    />
                  `
                  : ""
              }
              <mj-text padding="0">
                Hi ${escapedName},
              </mj-text>
              <mj-text padding="24px 0 0">
                ${escapedIntro}
              </mj-text>
              ${escapedIssueTitle ? `<mj-text font-style="italic" padding="24px 0 0">Featured Issue: ${escapedIssueTitle}</mj-text>` : ""}
              <mj-button
                background-color="${emailTheme.accent}"
                color="${emailTheme.accentText}"
                font-size="16px"
                href="${escapedCtaUrl}"
                padding="24px 0 0"
                align="left"
                width="100%"
                inner-padding="14px 18px"
              >
                ${escapedCtaLabel}
              </mj-button>
              <mj-spacer height="24px" />
              ${
                escapedLogoUrl
                  ? `<mj-image src="${escapedLogoUrl}" alt="${escapedLogoAlt}" width="160px" align="left" padding="0 0 14px" />`
                  : `<mj-text font-size="28px" font-weight="700" line-height="1.2" padding="0 0 16px">Let's Worm</mj-text>`
              }
              <mj-text padding="0">
                ${escapedClosing}
              </mj-text>
          </mj-column>
          </mj-section>
			</mj-body>
		</mjml>
	`);

  return {
    subject: issueTitle ? `Let's Worm: ${issueTitle}` : "Welcome to Let's Worm",
    html,
    text: buildTextBody({
      recipientName,
      intro,
      issueTitle,
      ctaLabel,
      ctaUrl,
      closing,
    }),
  };
};
