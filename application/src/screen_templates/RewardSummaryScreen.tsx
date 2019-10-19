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


    const totalCorrect = this.props.controller.getTotalCorrect();
    const totalProblems = this.props.controller.getNumProblems();
    const incorrect = numProblems - correct;
    const totalIncorrect = totalProblems - totalCorrect;
    const reward = correct*AppSettings.correctReward;
    const penalty = incorrect*AppSettings.incorrectPenalty;
    const netEarnings =  reward - penalty;
    const totalReward = totalCorrect*AppSettings.correctReward;
    const totalPenalty = totalIncorrect*AppSettings.incorrectPenalty;
    const totalNetEarnings = totalReward - totalPenalty;


    return <div>
      <div className={'text'}>
        You solved {correct} problems and missed {incorrect} problems this phase,
        earning {toUSD(reward)} - {toUSD(penalty)} = {toUSD(netEarnings)}.
        <br/><br/>
        Overall, you solved {totalCorrect} problems and missed {totalIncorrect} problems for a
        total of {toUSD(totalReward)} - {toUSD(totalPenalty)} = {toUSD(totalNetEarnings)}.
      </div>
      <div className={'continue'}>
        Press any key to continue.
      </div>
    </div>
  }
}

export default RewardSummaryScreen