import type { DetailedHTMLProps, HTMLAttributes } from "react";

type GoogleCodelabAttrs = HTMLAttributes<HTMLElement> & {
  title?: string;
  environment?: string;
  selected?: number | string;
  "feedback-link"?: string;
};

type GoogleCodelabStepAttrs = HTMLAttributes<HTMLElement> & {
  label?: string;
  duration?: number | string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "google-codelab": DetailedHTMLProps<GoogleCodelabAttrs, HTMLElement>;
      "google-codelab-step": DetailedHTMLProps<GoogleCodelabStepAttrs, HTMLElement>;
    }
  }
}

export {};
