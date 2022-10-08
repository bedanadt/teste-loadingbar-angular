import StepInterface from "src/app/loading/Interfaces/Step";
import StepStatus from "src/app/loading/Enums/StepStatus";

class Step implements StepInterface {
  name: string;
  status: StepStatus;

  constructor(name:string) {
    this.name = name;
    this.status = StepStatus.NOT_PROCESSED;
  }

  get statusName() {
    return StepStatus[this.status]
  }
}

export default Step;