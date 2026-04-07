# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Email Templates

`mjml` is installed in this app for server-side email rendering.

- Render raw MJML with [`src/lib/server/email/renderMjml.ts`](/Users/pnawara/Code/personal/letsworm/letsworm-website/src/lib/server/email/renderMjml.ts).
- Start from the example template in [`src/lib/server/email/templates/welcome.ts`](/Users/pnawara/Code/personal/letsworm/letsworm-website/src/lib/server/email/templates/welcome.ts).
- Keep email code under `src/lib/server/email` so it stays on the server side in SvelteKit.
- Preview or export compiled email HTML with [`scripts/email/render.ts`](/Users/pnawara/Code/personal/letsworm/letsworm-website/scripts/email/render.ts).
- Shared design tokens now live in [`src/lib/theme/tokens.js`](/Users/pnawara/Code/personal/letsworm/letsworm-website/src/lib/theme/tokens.js) and generate [`src/routes/styles/_tokens.css`](/Users/pnawara/Code/personal/letsworm/letsworm-website/src/routes/styles/_tokens.css).

## Node Version

This app is now pinned to the Node `24.x` LTS line.

- [`package.json`](/Users/pnawara/Code/personal/letsworm/letsworm-website/package.json) declares `engines.node` as `>=24 <25`
- [`.nvmrc`](/Users/pnawara/Code/personal/letsworm/letsworm-website/.nvmrc) and [`.node-version`](/Users/pnawara/Code/personal/letsworm/letsworm-website/.node-version) both point to `24`

If you use `nvm`, run:

```bash
nvm install 24
nvm use 24
```

When you update design tokens, run:

```bash
npm run theme:build
```

`npm run check` now verifies that the generated CSS token file is up to date.

Example:

```ts
import { renderWelcomeEmail } from "$lib/server/email/templates/welcome";

const email = renderWelcomeEmail({
  recipientName: "Old Tony",
  ctaLabel: "Read the latest issue",
  ctaUrl: "https://www.letsworm.com/issues/001-2026",
  issueTitle: "Spring 2026",
});
```

Preview the default sample data:

```bash
npm run email:preview
```

That writes browser-openable HTML to `.tmp/email-previews/welcome.html`.

Watch and rebuild the preview while editing:

```bash
npm run email:watch
```

That reruns the preview render when email templates, sample props, or theme tokens change.

Export Zoho-ready HTML:

```bash
npm run email:export
```

That writes compiled email HTML to `dist/email/welcome.html`.

Useful variants:

```bash
npm run email:preview -- --template welcome --props scripts/email/examples/welcome.json
npm run email:export -- --template welcome --out /tmp/welcome.html
npm run email:export -- --template welcome --stdout > /tmp/welcome.html
```

For Zoho, use the compiled output from `email:export`, not the MJML source.

The email template can also render a hosted logo image. The Svelte component itself is not reusable in email, but the artwork is now available as [`static/branding/letsworm-logo-stacked.svg`](/Users/pnawara/Code/personal/letsworm/letsworm-website/static/branding/letsworm-logo-stacked.svg).
