import { describe, expect, it } from "vitest";

import { renderMjml } from "$lib/server/email/renderMjml";
import { renderWelcomeEmail } from "$lib/server/email/templates/welcome";

describe("renderMjml", () => {
  it("renders valid MJML into HTML", () => {
    const html = renderMjml(`
			<mjml>
				<mj-body>
					<mj-section>
						<mj-column>
							<mj-text>Hello worms</mj-text>
						</mj-column>
					</mj-section>
				</mj-body>
			</mjml>
		`);

    expect(html).toContain("Hello worms");
    expect(html).toContain("<!doctype html>");
  });

  it("throws on invalid MJML", () => {
    expect(() =>
      renderMjml(`
				<mjml>
					<mj-body>
						<mj-text>This is not allowed directly inside mj-body</mj-text>
					</mj-body>
				</mjml>
			`),
    ).toThrow("MJML render failed");
  });
});

describe("renderWelcomeEmail", () => {
  it("returns subject, html, and text output", () => {
    const email = renderWelcomeEmail({
      recipientName: "Old Tony <script>",
      ctaLabel: "Read the issue",
      ctaUrl: "https://www.letsworm.com/issues/001",
      issueTitle: "Spring 2026",
    });

    expect(email.subject).toBe("Let's Worm: Spring 2026");
    expect(email.html).toContain("Old Tony &lt;script&gt;");
    expect(email.html).toContain("Read the issue");
    expect(email.text).toContain("https://www.letsworm.com/issues/001");
  });
});
