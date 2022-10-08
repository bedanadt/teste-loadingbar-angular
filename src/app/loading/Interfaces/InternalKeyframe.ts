import Step from "src/app/loading/Interfaces/Step";

interface InternalKeyframe {
  title: string
  subtitle: string
  step: Step
}

interface Timeframes {
  [index: number]: InternalKeyframe
}

export { InternalKeyframe, Timeframes };