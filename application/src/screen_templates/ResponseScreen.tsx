import './ResponseScreen.css';
import * as React from 'react';
import Screen from "./Screen";
import Controller from "../framework/Controller";
import {clear_timer, timer} from "../utils";
import {Datatype} from "../framework/Datastore";
import AppSettings from "../AppSettings";
// import AppSettings from "../AppSettings";

class ResponseScreen extends Screen {
  timer_period = 25;

  props!: {
    controller: Controller,
    screenName: string,
    delay: number,
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
    const timestamp = new Date();
    if (this.state.showStimulus){
      clear_timer(this.maxTimerKey!);

      if (this.responseStartTimestamp == null) {
        this.responseStartTimestamp = timestamp;
        timer(this.props.maxTypeTime, this.timer_period, this.submitResponse.bind(this)
          );
      }

      this.response += key;

      this.props.controller.datastore.append({
        screenName: this.props.screenName,
        type: Datatype.ResponseTime,
        key: 'input' + this.response.length,
        value: +timestamp - +this.stimulusTimestamp!
      });
    }
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

    this.props.controller.datastore.append({
      screenName: this.props.screenName,
      type: Datatype.TaskDetail,
      key: 'delay',
      value: this.props.delay
    });

    // Basically, need to kill the timeout timer once a keystroke is made
    timer(this.props.delay, this.timer_period, (() => {
      this.setState({showStimulus: true},
        () => {
        this.stimulusTimestamp = new Date();
        const currentScreen = this.props.controller.functions.getCurrentScreen();
        this.maxTimerKey = timer(AppSettings.maxTrialTime, 200, (() => {
          if (this.props.controller.functions.getCurrentScreen() == currentScreen) {
            this.props.controller.functions.goToNextScreen()
          }
        }).bind(this));
      });
    }).bind(this));
  }

  render() {
    return <div>
      {this.state.showStimulus
      ?  <div className="stimulus">{this.props.stimulus}</div>
        : <div className="fixationPoint">+</div>
      }
    </div>
  }

}

export default ResponseScreen