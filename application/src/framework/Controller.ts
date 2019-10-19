import Datastore from "./Datastore";
import AppSettings from "../AppSettings";
import {HITParams, post, submitHIT} from "../service/psiturkService";
const _ = require('lodash');

interface ControllerFunctions {
  goToNextScreen: () => void;
  getCurrentScreen: () => number;
}

class Controller {
  hitParams: HITParams;
  functions: ControllerFunctions;
  datastore: Datastore;

  demonstrationResults: Array<boolean>;
  calibrationWarmupResults: Array<boolean>;
  calibrationResults: Array<boolean>;
  warmupResults: Array<Array<boolean>>;
  add2Results: Array<Array<boolean>>;

  startTime: Date;
  constructor(hitParams: HITParams, functions: ControllerFunctions) {
    this.hitParams = hitParams;
    this.functions = functions;
    this.datastore = new Datastore();
    this.startTime = new Date();

    this.demonstrationResults = new Array<boolean>();
    this.calibrationResults = new Array<boolean>();
    this.calibrationWarmupResults = new Array<boolean>();
    this.warmupResults = new Array<Array<boolean>>();
    this.add2Results = new Array<Array<boolean>>();

    for (let i=0; i<AppSettings.numAdd2Split; i++) {
      this.warmupResults.push(new Array<boolean>());
      this.add2Results.push(new Array<boolean>());
    }
  }

  createAppendResultFunction(resultsArray: Array<boolean>) {
    const appender = (result: boolean) => {
      resultsArray.push(result);
    };
    return appender;
  }

  getTotalCorrect(resultsArray?: Array<boolean> | Array<Array<boolean>>): number {
    if (resultsArray !== undefined) {
      if (typeof resultsArray[0] == "boolean") {
        return _.sum(resultsArray);
      } else {
        let sum = 0;
        for (let i=0; i<resultsArray.length; i++) {
          sum += _.sum(resultsArray[i]);
        }
        return sum;
      }
    }
    return this.getTotalCorrect(this.demonstrationResults) +
      this.getTotalCorrect(this.calibrationResults) +
      this.getTotalCorrect(this.calibrationWarmupResults) +
      this.getTotalCorrect(this.warmupResults) +
      this.getTotalCorrect(this.add2Results)
  }

  getNumProblems(resultsArray?: Array<boolean> | Array<Array<boolean>>): number {
    if (resultsArray !== undefined) {
      if (typeof resultsArray[0] == "boolean") {
        return resultsArray.length;
      } else {
        let length = 0;
        for (let i=0; i<resultsArray.length; i++) {
          length += (resultsArray[i] as Array<boolean>).length;
        }
        return length;
      }
    }
    return this.getNumProblems(this.demonstrationResults) +
      this.getNumProblems(this.calibrationResults) +
      this.getNumProblems(this.calibrationWarmupResults) +
      this.getNumProblems(this.warmupResults) +
      this.getNumProblems(this.add2Results)
  }

  addSummaryStatistics(summary: object, prefix: string, resultsArray?: Array<boolean> | Array<Array<boolean>>) {
    const numProblems = this.getNumProblems(resultsArray);
    const correct = this.getTotalCorrect(resultsArray);
    summary[prefix + '_' + 'problems'] = numProblems;
    summary[prefix + '_' + 'correct'] = correct;
    summary[prefix + '_' + 'incorrect'] = numProblems - correct;
  }

  async sendData() {
    const filename =  `${AppSettings.saveDirectory}/${this.hitParams.assignmentId}_${this.hitParams.workerId}_${this.hitParams.hitId}`;

    const data = {
      'datastore': this.datastore.data,
      'results': {
        'demonstration': this.demonstrationResults,
        'calibration_warmup': this.calibrationWarmupResults,
        'calibration': this.calibrationResults,
        'add2_warmup': this.warmupResults,
        'add2': this.add2Results,

      },
      'summary': {},
      'app_settings': AppSettings,
      'hit_params': this.hitParams,
      'start': this.startTime,
      'end': new Date()
    };

    this.addSummaryStatistics(data['summary'], 'total');
    this.addSummaryStatistics(data['summary'], 'demonstration', this.demonstrationResults);
    this.addSummaryStatistics(data['summary'], 'calibration_warmup', this.calibrationWarmupResults);
    this.addSummaryStatistics(data['summary'], 'calibration', this.calibrationResults);
    this.addSummaryStatistics(data['summary'], 'add2_warmup', this.warmupResults);
    this.addSummaryStatistics(data['summary'], 'add2', this.add2Results);
    for (let i=0; i<this.add2Results.length; i++) {
      this.addSummaryStatistics(data['summary'], 'add2_warmup_' + i, this.warmupResults[i]);
      this.addSummaryStatistics(data['summary'], 'add2_' + i, this.add2Results[i]);
    }

    await post(AppSettings.post_url, filename, data, true);
  }

  submitHIT() {
    submitHIT(this.hitParams.onComplete);
  }
}

export default Controller;