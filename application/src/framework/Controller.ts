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

  getNumProblems(): number { // returns the total number of problems presented so far
    let total = 0;
    total += this.demonstrationResults.length;
    total += this.calibrationResults.length;
    total += this.calibrationWarmupResults.length;

    for (let i=0; i < this.add2Results.length; i++) {
      total += this.add2Results[i].length;
      total += this.warmupResults[i].length;
    }
    return total;
  }

  async sendData() {
    const filename =  `${AppSettings.saveDirectory}/${this.hitParams.assignmentId}
    _${this.hitParams.workerId}_${this.hitParams.hitId}`;

    const data = {
      'datastore': this.datastore.data,
      'results': {
        'demonstration': this.demonstrationResults,
        'calibration_warmup': this.calibrationWarmupResults,
        'calibration': this.calibrationResults,
        'add2_warmup': this.warmupResults,
        'add2': this.add2Results,
        'total_correct': this.getTotalCorrect()
      },
      'app_settings': AppSettings,
      'hit_params': this.hitParams,
      'start': this.startTime,
      'end': new Date()
    };
    await post(AppSettings.post_url, filename, data, True);
  }

  submitHIT() {
    submitHIT(this.hitParams.onComplete);
  }
}

export default Controller;