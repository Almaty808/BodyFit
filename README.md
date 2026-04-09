# BodyFlow

BodyFlow is an Expo React Native fitness app with calorie planning, meal timing, workout guidance, and progress analysis.

## Local development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run start
```

Run the web version locally:

```bash
npm run web
```

## Vercel deployment

This project is configured to deploy to Vercel as an Expo web build.

Install dependencies:

```bash
npm install
```

Run the web build:

```bash
npm run build:web
```

The build output goes to `dist/`, and `vercel.json` tells Vercel to serve that folder.

If you import the repo into Vercel:

1. Set the framework preset to `Other`.
2. Use the build command `npm run build:web`.
3. Use `dist` as the output directory.

Because this is configured as a single-page Expo web app, `vercel.json` rewrites all routes back to `/`.
