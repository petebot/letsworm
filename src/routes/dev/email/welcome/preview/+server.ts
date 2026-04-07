import { dev } from "$app/environment";
import { error } from "@sveltejs/kit";
import welcomeExample from "../../../../../../scripts/email/examples/welcome.json";
import { renderWelcomeEmail } from "$lib/server/email/templates/welcome";

export const prerender = false;

export const GET = async ({ url }) => {
  if (!dev) {
    throw error(404, "Not found");
  }

  const email = renderWelcomeEmail({
    ...welcomeExample,
    logoUrl: `${url.origin}/branding/oneworm.svg`,
  });

  return new Response(email.html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
};
