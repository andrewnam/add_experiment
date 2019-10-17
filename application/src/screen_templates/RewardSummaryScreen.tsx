import Screen from "../screen_templates/Screen";
import Controller from "../framework/Controller";
import * as React from "react";
import {toUSD} from "../utils";
import AppSettings from "../AppSettings";

class RewardSummaryScreen extends Screen {
  props!: {
    resultsArray: Array<boolean>,
    warmupResultsArray?: Array<boolean>,
    controller: Controller,
    screenName: string
  };

  handleKeyDown(key: string) {
    this.props.controller.functions.goToNextScreen();
  }

  render() {
    let correct = this.props.controller.getTotalCorrect(this.props.resultsArray);
    let numProblems = this.props.resultsArray.length;

    if (this.props.warmupResultsArray !== undefined) {
      correct += this.props.controller.getTotalCorrect(this.props.warmupResultsArray);
      numProblems += this.props.warmupResultsArray.length;
    }

    const totalSolved = this.props.controller.getTotalCorrect();
    return <div>

      <div className={'text'}>
        You solved {correct} problems out of {numProblems} in this phase,
        earning {toUSD(correct*AppSettings.correctReward)}!
        <br/><br/>
        Overall, you solved {totalSolved} out of {this.props.controller.getNumProblems()} problems for a
        total of {toUSD(totalSolved*AppSettings.correctReward)}.
      </div>
      <div className={'continue'}>
        Press any key to continue.
      </div>
    </div>
  }
}

export default RewardSummaryScreen