import { dev } from "$app/environment";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import welcomeExample from "../../../../../scripts/email/examples/welcome.json";

export const load: PageServerLoad = async ({ url }) => {
  if (!dev) {
    throw error(404, "Not found");
  }

  return {
    previewUrl: "/dev/email/welcome/preview",
    subject: `Let's Worm: ${welcomeExample.issueTitle}`,
    propsPath: "scripts/email/examples/welcome.json",
    localOneWormUrl: `${url.origin}/branding/oneworm.png`,
    localLogoUrl: `${url.origin}/branding/letsworm-logo.png`,
  };
};
