import './ResponseScreen.css';
import * as React from 'react';
import Screen from "./Screen";
import Controller from "../framework/Controller";
import {clear_timer, timer} from "../utils";
import {Datatype} from "../framework/Datastore";
import AppSettings from "../AppSettings";

class ResponseScreen extends Screen {

  props!: {
    controller: Controller,
    screenName: string,
    stimulus: string,
    target: string,
    maxTypeTime: number,
    appendResult: (result: boolean) => void
  };

  state: {
    showStimulus: boolean
  };

  stimulusTimestamp: Date | null;
  responseStartTimestamp: Date | null;
  response: string;
  maxTimerKey: number | null;

  constructor(props: any) {
    super(props);
    this.state = {
      showStimulus: false
    };
    this.stimulusTimestamp = null;
    this.responseStartTimestamp = null;
    this.response = '';
    this.maxTimerKey = null;
  }

  handleKeyDown(key: string) {
    super.handleKeyDown(key);
    const timestamp = new Date();
    clear_timer(this.maxTimerKey!);

    if (this.responseStartTimestamp == null) {
      this.responseStartTimestamp = timestamp;
      timer(this.props.maxTypeTime, this.submitResponse.bind(this));
    }

    this.response += key;
  }

  submitResponse() {
    this.props.controller.datastore.append({
      screenName: this.props.screenName,
      type: Datatype.Response,
      key: 'response',
      value: this.response
    });
    this.props.appendResult(this.response == this.props.target);
    this.props.controller.functions.goToNextScreen();
  }

  componentDidMount() {
    super.componentDidMount();
    this.stimulusTimestamp = new Date();

    this.props.controller.datastore.append({
      screenName: this.props.screenName,
      type: Datatype.TaskDetail,
      key: 'stimulus',
      value: this.props.stimulus
    });

    this.props.controller.datastore.append({
      screenName: this.props.screenName,
      type: Datatype.TaskDetail,
      key: 'target',
      value: this.props.target
    });

    // Basically, need to kill the timeout timer once a keystroke is made
    const currentScreen = this.props.controller.functions.getCurrentScreen();
    this.maxTimerKey = timer(AppSettings.maxTrialTime, (() => {
      if (this.props.controller.functions.getCurrentScreen() == currentScreen) {
        this.props.controller.functions.goToNextScreen()
      }
    }).bind(this));
  }

  render() {
    return <div className="stimulus">
      {this.props.stimulus}
    </div>
  }
}

export default ResponseScreen