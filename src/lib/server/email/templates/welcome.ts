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
  const escapedoneWormUrl = oneWormUrl ? escapeAttribute(oneWormUrl) : null;
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
				</mj-attributes>
			</mj-head>
			<mj-body background-color="${emailTheme.bodyBackground}">
        <mj-section padding="0">
          <mj-column background-color="${emailTheme.accent}" padding="0">
            <mj-spacer height="8px" />
          </mj-column>
        </mj-section>
				<mj-section padding="32px 20px 16px">
					<mj-column background-color="${emailTheme.surface}" border="1px solid ${emailTheme.border}" padding="32px">
            ${
              escapedoneWormUrl
                ? `<mj-image src="${escapedoneWormUrl}" alt="${escapedLogoAlt}" width="80px" align="left" padding="0 0 16px" />`
                : `<mj-text font-size="28px" font-weight="700" line-height="1.2" padding="0 0 16px">Let's Worm</mj-text>`
            }
            
						<mj-text padding-top="24px">
							Hi ${escapedName},
						</mj-text>
						<mj-text>
							${escapedIntro}
						</mj-text>
						${escapedIssueTitle ? `<mj-text font-style="italic">Featured Issue: ${escapedIssueTitle}</mj-text>` : ""}
						<mj-button
							background-color="${emailTheme.accent}"
							color="${emailTheme.accentText}"
							font-size="15px"
							href="${escapedCtaUrl}"
							padding-top="24px"
              align="left"
						>
							${escapedCtaLabel}
						</mj-button>
            ${
              escapedLogoUrl
                ? `<mj-image src="${escapedLogoUrl}" alt="${escapedLogoAlt}" width="120px" align="left" padding="16px 16px 0" />`
                : `<mj-text font-size="28px" font-weight="700" line-height="1.2" padding="0 0 16px">Let's Worm</mj-text>`
            }
						<mj-text>
            
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
