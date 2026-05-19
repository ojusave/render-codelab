export type StepManifest = {
  order: number;
  title: string;
  duration?: number;
  slug: string;
};

export type StepContent = StepManifest & {
  html: string;
};

export type CodelabStepContent = StepContent;
