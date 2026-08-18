import type { CodeExample, DeveloperFeature } from "./types";

export const codeExamples: CodeExample[] = [
  {
    label: "Install",
    code: `npm install @appkodes/sdk

# or
yarn add @appkodes/sdk
pnpm add @appkodes/sdk`,
  },
  {
    label: "Initialize",
    code: `import { Appkodes } from '@appkodes/sdk'

const appkodes = new Appkodes({
  apiKey: process.env.APPKODES_KEY
})`,
  },
  {
    label: "Deploy",
    code: `const app = await appkodes.deploy({
  name: 'my-app',
  region: 'auto',
  scaling: {
    min: 1,
    max: 100
  }
})

console.log('Live at:', app.url)`,
  },
];
export const developerFeatures: DeveloperFeature[] = [
  { 
    title: "TypeScript native", 
    description: "Full type safety with auto-generated types."
  },
  { 
    title: "Zero config", 
    description: "Sensible defaults that just work."
  },
  { 
    title: "Edge-ready", 
    description: "Runs anywhere: Node, Deno, Bun, browsers."
  },
  { 
    title: "12KB gzipped", 
    description: "Lightweight with zero dependencies."
  },
];
