import * as React from 'react';
import './Experiment.css';
import ResponseScreen from "./screen_templates/ResponseScreen";
import Controller from "./framework/Controller";
import {ComponentClass} from "react";
import InstructionScreen from "./screen_templates/InstructionScreen";
import AppSettings from './AppSettings';
import {randInt, toUSD} from "./utils";
import RewardSummaryScreen from "./screen_templates/RewardSummaryScreen";
const _ = require('lodash');


class Experiment extends React.Component {
  static assignmentIdParam = 'assignmentId';
  static hitIdParam = 'hitId';
  static workerIdParam = 'workerId';

  // assignmentId: string;
  // hitId: string;
  // workerId: string;

  state: {
    current_screen: number,
  };

  screens: Array<any>;
  controller: Controller;

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      current_screen: 0
    };

    this.controller = new Controller({goToNextScreen: this.goToNextScreen.bind(this)});
    this.screens = [];

    this.addInstructions();
    this.addDemonstrationPhase(AppSettings.maxAddend, AppSettings.numDemonstrationTrials);
    this.addCallibrationPhase(AppSettings.maxAddend, AppSettings.numCallibrationSets);
  }

  addScreen(screen: ComponentClass<any>, screenName: string, props?: object) {
    if (props == undefined) {
      props = {};
    }
    props['key'] = screenName;
    props['controller'] = this.controller;
    props['screenName'] = screenName;
    const component = React.createElement(screen, props);
    this.screens.push(component);
  }

  addInstructions() {
    this.addScreen(InstructionScreen, 'Instructions', {
      instructions: ['In this experiment, you will be shown a series of numbers and simple math problems.' +
        ' Please type the value of the expression shown.',
        'For example, if the screen shows 7, enter 7. If the screen shows 3 + 13, enter 16.']
    });

    const numAddProblems = (1+AppSettings.maxAddend) * (1+AppSettings.maxAddend);
    const numTypeProblems = AppSettings.numDemonstrationTrials +
      (AppSettings.maxAddend+1)*AppSettings.numCallibrationSets +
      AppSettings.numWarmupTrials*AppSettings.numAdd2Split;
    const totalProblems = numTypeProblems + numAddProblems;

    this.addScreen(InstructionScreen, 'Compensation', {
      instructions: [`You will receive ${toUSD(AppSettings.correctReward)} for each correct response and
       ${toUSD(AppSettings.incorrectReward)} for each incorrect response. There will be ${numTypeProblems} Type
       problems and ${numAddProblems} for a maximum compensation of
       ${toUSD(totalProblems*AppSettings.correctReward)}.`]
    });

    this.addScreen(InstructionScreen, 'Details', {
      instructions: [`Please response and type quickly. The program will proceed soon after the first entered key.
       You will receive ${AppSettings.numAdd2Split} breaks during the experiment.`]
    });
  }

  addDemonstrationPhase(maxNumber: number, numTrials: number) {
    this.addScreen(InstructionScreen, 'Demonstration', {
      instructions: [`To familiarize with the program, you will be presented with 
       ${AppSettings.numDemonstrationTrials} problems.`]
    });

    this.addScreen(InstructionScreen, 'Demonstration', {
      instructions: [`Please be absolutely careful in this phase. Producing more than
      ${AppSettings.allowedDemonstrationErrors} errors will terminate the experiment early.`]
    });

    for (let trial=0; trial < numTrials; trial++) {
      let stimulus = '';
      let target = '';
      if (Math.random() < .5) {
        stimulus = randInt(AppSettings.maxAddend).toString();
        target = stimulus;
      } else {
        let addend1 = randInt(AppSettings.maxAddend);
        let addend2 = randInt(AppSettings.maxAddend);
        stimulus = addend1 + '+' + addend2;
        target = (addend1 + addend2).toString();
      }

      let screenName = `demonstration_${trial}`;
      this.addScreen(ResponseScreen, screenName, {
        delay: randInt(AppSettings.delayLower, AppSettings.delayUpper),
        stimulus: stimulus.toString(),
        target: target.toString(),
        maxTypeTime: AppSettings.maxTypeTime,
        appendResult: this.controller.createAppendResultFunction(this.controller.demonstrationResults)
      })
    }

    this.addScreen(RewardSummaryScreen, 'rewardSummary_demonstration', {
      resultsArray: this.controller.demonstrationResults
    });
  }

  addCallibrationPhase(maxNumber: number, numSets: number) {
    for (let set=0; set < numSets; set++) {
      let numbers = _.shuffle(_.range(0, maxNumber+1));
      for (let i=0; i < numbers.length; i++) {
        let num = numbers[i];
        let screenName = `callibration_${set}_${num}`;
        this.addScreen(ResponseScreen, screenName, {
          delay: randInt(AppSettings.delayLower, AppSettings.delayUpper),
          stimulus: num.toString(),
          target: num.toString(),
          maxTypeTime: AppSettings.maxTypeTime,
          appendResult: this.controller.createAppendResultFunction(this.controller.callibrationResults)
        })
      }
    }
  }

  goToNextScreen() {
    this.setState((state: any) => {return {current_screen: state.current_screen + 1}},
      () => {
        // this.recordNewScreen();
        // // If the experiment is over:
        // if (this.state.current_screen == this.screens.length - 1) {
        //   emitHitComplete(this.onComplete);
        // }
      });
  }

  renderScreen() {
    if (this.state.current_screen < this.screens.length) {
      return this.screens[this.state.current_screen];
    }
    return <p>Error: current screen is {this.state.current_screen}</p>;
  }

  render() {
    return <div>
      <div className={'Experiment center'}>
        <div className={"screen"} id-="screen">
          {this.renderScreen()}
        </div>
      </div>
    </div>
  }
}

export default Experiment