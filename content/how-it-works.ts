import type { Step } from "./types";

export const steps: Step[] = [
  {
    number: "I",
    title: "Connect your tools",
    description: "Integrate with your existing stack in minutes. We support 200+ data sources out of the box.",
    code: `import { appkodes } from '@appkodes/core'

appkodes.connect({
  source: 'your-database',
  sync: true
})`,
  },
  {
    number: "II",
    title: "Build your workflow",
    description: "Design powerful automations with our visual builder or write code directly.",
    code: `appkodes.workflow('process', {
  trigger: 'event',
  actions: [
    'validate',
    'transform', 
    'deliver'
  ]
})`,
  },
  {
    number: "III",
    title: "Ship to production",
    description: "Deploy globally with zero configuration. Your app goes live in under 30 seconds.",
    code: `appkodes.deploy({
  target: 'production',
  regions: 'auto'
})

// Deployed to 12 regions`,
  },
];
