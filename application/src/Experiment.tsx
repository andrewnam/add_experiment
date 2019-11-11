import * as React from 'react';
import './Experiment.css';
import ResponseScreen from "./screen_templates/ResponseScreen";
import Controller from "./framework/Controller";
import {ComponentClass} from "react";
import InstructionScreen from "./screen_templates/InstructionScreen";
import AppSettings from './AppSettings';
import {randInt, toUSD} from "./utils";
import RewardSummaryScreen from "./screen_templates/RewardSummaryScreen";
import DemographicSurvey from "./screens/DemographicSurvey";
import {getHitParams} from "./service/psiturkService";
import SubmitDataScreen from "./screens/SubmitDataScreen";
import ExperimentCompleteScreen from "./screens/ExperimentCompleteScreen";
import KeyboardSurvey from "./screens/KeyboardSurvey";
const _ = require('lodash');


class Experiment extends React.Component {

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

    this.controller = new Controller(getHitParams(),
      {goToNextScreen: this.goToNextScreen.bind(this),
      getCurrentScreen: (() => this.state.current_screen).bind(this)
    });
    this.screens = [];

    this.addInstructions();
    this.addDemonstrationPhase(AppSettings.maxAddend, AppSettings.numDemonstrationTrials);
    this.addCalibrationPhase(AppSettings.maxAddend*2, AppSettings.numCalibrationSets, AppSettings.numWarmupTrials);
    this.addAdd2Phase(AppSettings.maxAddend, AppSettings.numAdd2Split, AppSettings.numWarmupTrials);
    this.addScreen(KeyboardSurvey, 'keyboard_survey');
    this.addScreen(DemographicSurvey, 'demographic_survey');
    this.addScreen(SubmitDataScreen, 'submit_data');
    this.addScreen(ExperimentCompleteScreen, 'experiment_complete');
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
    this.addScreen(InstructionScreen, 'inst_welcome', {
      instructions: ['In this experiment, you will be shown a series of simple math problems.' +
        ' Please type the value of the expression shown.',
        'For example, if the screen shows 7, enter 7. If the screen shows 3 + 13, enter 16.']
    });

    const numAddProblems = (1+AppSettings.maxAddend) * (1+AppSettings.maxAddend);
    const numTypeProblems = AppSettings.numDemonstrationTrials +
      (AppSettings.maxAddend*2 + 1)*AppSettings.numCalibrationSets +
      AppSettings.numWarmupTrials*(1+AppSettings.numAdd2Split);
    const totalProblems = numTypeProblems + numAddProblems;

    this.addScreen(InstructionScreen, 'inst_compensation', {
      instructions: [`You will earn ${toUSD(AppSettings.correctReward)} for each correct response and
       lose ${toUSD(AppSettings.incorrectPenalty)} for each incorrect response. There will be ${numTypeProblems} number
       problems and ${numAddProblems} addition problems for a maximum compensation of
       ${toUSD(totalProblems*AppSettings.correctReward)}.`,
        `You will receive ${AppSettings.numAdd2Split} breaks during the experiment.`]
    });

    this.addScreen(InstructionScreen, 'inst_details', {
      instructions: [`Please respond and type quickly and accurately, especially when typing numbers with
      multiple digits.
      The program will only register a second keystroke if it is made immediately after the first.`]
    });
  }

  addWarmup(phase: string, resultsArray: Array<boolean>, maxNumber: number, numTrials: number) {
    for (let i = 0; i < numTrials; i++) {
      let screenName = phase + '_warmup_' + i;
      let stimulus = randInt(maxNumber).toString();
      this.addScreen(ResponseScreen, screenName, {
        delay: randInt(AppSettings.delayLower, AppSettings.delayUpper),
        stimulus: stimulus,
        target: stimulus,
        maxTypeTime: AppSettings.maxTypeTime,
        appendResult: this.controller.createAppendResultFunction(resultsArray)
      })
    }
  }

  addDemonstrationPhase(maxNumber: number, numTrials: number) {
    this.addScreen(InstructionScreen, 'inst_demonstration', {
      instructions: [`To familiarize with the program, you will be presented with ${numTrials} problems.`]
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

    this.addScreen(RewardSummaryScreen, 'reward_demonstration', {
      resultsArray: this.controller.demonstrationResults
    });
  }

  addCalibrationPhase(maxNumber: number, numSets: number, numWarmupTrials: number) {
    this.addScreen(InstructionScreen, 'inst_calibration', {
      instructions: [`In this phase, you will be presented with 
       ${numWarmupTrials + (numSets * (maxNumber+1))} number problems.`]
    });

    this.addWarmup('calibration',
      this.controller.calibrationWarmupResults, maxNumber, numWarmupTrials);

    for (let set=0; set < numSets; set++) {
      let numbers = _.shuffle(_.range(0, maxNumber+1));
      for (let i=0; i < numbers.length; i++) {
        let num = numbers[i];
        let screenName = `calibration_${set}_${num}`;
        this.addScreen(ResponseScreen, screenName, {
          delay: randInt(AppSettings.delayLower, AppSettings.delayUpper),
          stimulus: num.toString(),
          target: num.toString(),
          maxTypeTime: AppSettings.maxTypeTime,
          appendResult: this.controller.createAppendResultFunction(this.controller.calibrationResults)
        })
      }
    }

    this.addScreen(RewardSummaryScreen, 'reward_calibration', {
      resultsArray: this.controller.calibrationResults,
      warmupResultsArray: this.controller.calibrationWarmupResults
    });
  }

  addAdd2Phase(maxNumber: number, numAdd2Split: number, numWarmupTrials: number) {
    let stimuli = [];
    let targets = [];
    for (let i=0; i <= maxNumber; i++) {
      for (let j=0; j <= maxNumber; j++) {
        stimuli.push(i + '+' + j);
        targets.push((i+j).toString());
      }
    }
    let indices = _.shuffle(_.range(0, stimuli.length));
    const chunkSize = Math.ceil(stimuli.length / numAdd2Split);
    stimuli = _.chunk(_.at(stimuli, indices), chunkSize);
    targets = _.chunk(_.at(targets, indices), chunkSize);

    for (let set = 0; set < numAdd2Split; set++) {

      let chunk_stimuli = stimuli[set];
      let chunk_targets = targets[set];
      this.addScreen(InstructionScreen, 'inst_calibration', {
        instructions: [`In this phase, you will be presented with
       ${numWarmupTrials} number problems and ${chunk_stimuli.length} addition problems.`]
      });

      this.addWarmup('add2_part' + set,
        this.controller.warmupResults[set], maxNumber, numWarmupTrials);

      for (let i=0; i < chunk_stimuli.length; i++) {
        let screenName = 'add2_part' + set + '_' + i;
        this.addScreen(ResponseScreen, screenName, {
          delay: randInt(AppSettings.delayLower, AppSettings.delayUpper),
          stimulus: chunk_stimuli[i],
          target: chunk_targets[i],
          maxTypeTime: AppSettings.maxTypeTime,
          appendResult: this.controller.createAppendResultFunction(this.controller.add2Results[set])
        })
      }

      this.addScreen(RewardSummaryScreen, 'reward_add2_' + set, {
        resultsArray: this.controller.add2Results[set],
        warmupResultsArray: this.controller.warmupResults[set]
      });
    }
  }

  goToNextScreen() {
    this.setState((state: any) => {return {current_screen: state.current_screen + 1}});
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