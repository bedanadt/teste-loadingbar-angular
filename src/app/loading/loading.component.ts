import { Component, Input, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import Keyframe from './Interfaces/Keyframe';
import Step from './Interfaces/Step';
import StepClass from './Model/Step';
import StepStatus from './Enums/StepStatus';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  @Input() keyframes!: Keyframe[];
  @Input() loadingTime!: number; // In Seconds

  steps: Step[];
  secondsElapsed: number;
  barSize: number;
  timerInterval?: NodeJS.Timer;
  
  currentTitle: string;
  currentSubtitle: string;
  currentStep?: Step;
  currentKeyframeIndex?: number;
  
  constructor() {
    this.secondsElapsed = 0;
    this.barSize = 0;
    this.currentTitle = "Title";
    this.currentSubtitle = "Subtitle";
    this.steps = [];
  }

  ngOnInit(): void {
    this.keyframes.forEach(keyframe => {
      let newInternalKeyframe = {
        title: keyframe.title,
        subtitle: keyframe.subtitle,
        step: null
      };
    
      let newStep;
    
      if (keyframe.step) {
        newStep = new StepClass(keyframe.step);
        this.steps.push(newStep);
      }
    });
  }

  private updateInfo(): void {
    const newKeyframeIndex = this.keyframes.findIndex(
      (keyframe: Keyframe) => {
        return keyframe.time == this.secondsElapsed
      }
    );

    if (newKeyframeIndex == -1) {
      return;
    }

    const newKeyframe: Keyframe | null =  this.keyframes[newKeyframeIndex];

    this.currentKeyframeIndex = newKeyframeIndex;
    const { title, subtitle, step } = newKeyframe;

    if (title) {
      this.currentTitle = title;
    }

    if (subtitle) {
      this.currentSubtitle = subtitle;
    }

    if (step) {
      if (this.currentStep) {
        this.currentStep.status = StepStatus.PROCESSED;
      }

      const newStep: Step | null = this.steps.find(loopingStep => {
        return loopingStep.name == step;
      }) || null;

      if (newStep) {
        newStep.status = StepStatus.PROCESSING;
        this.currentStep = newStep;
      }
    }
  }

  private updateBar(keyframeIndex: number): void {
    const currentKeyframeTotalTime = this.getKeyframeTimeInSeconds(keyframeIndex);
    const currentKeyframeTotalPercentage = this.getKeyframePercentages(keyframeIndex);
    this.barSize += currentKeyframeTotalPercentage/currentKeyframeTotalTime;
  }

  start(): void {
    if (this.timerInterval) return;

    this.timerInterval = setInterval(() => {

      this.updateInfo();

      if (this.currentKeyframeIndex != null)
        this.updateBar(this.currentKeyframeIndex);

      this.secondsElapsed = this.secondsElapsed + 1;

      if (this.secondsElapsed > this.loadingTime) {
        this.pause();
      }
    }, 1000);
  }

  pause(): void {
    clearInterval(this.timerInterval);
    this.timerInterval = undefined;
  }

  stop(): void {
    this.pause();
    this.secondsElapsed = 0;
    this.currentStep = undefined;
    this.barSize = 0;
    this.steps.forEach(step => {
      step.status = StepStatus.NOT_PROCESSED;
    });
  }

  restart(): void {
    this.stop();
    this.start();
  }

  getKeyframeTimeInSeconds(indexOfStep: number): number {
    const frame = this.keyframes[indexOfStep];

    if (this.keyframes[indexOfStep + 1])
      return this.keyframes[indexOfStep + 1].time - frame.time;

    return this.loadingTime - frame.time;
  }

  getKeyframePercentages(indexOfStep: number): number {
    const returnValue = (this.getKeyframeTimeInSeconds(indexOfStep) * 100) / this.loadingTime;

    return returnValue;
  }
}
