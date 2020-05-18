import { AnimationInfo } from './animation-info';
import { NoMysteryTask } from '../plugins/nomystery/nomystery-task';
import { Injectable } from '@angular/core';


export abstract class AnimationInitializer {

  constructor(protected svgContainerId: string) {}

  abstract restart();
}
