import './ResponseScreen.css';
import * as React from 'react';
import Screen from "./Screen";
import Controller from "../framework/Controller";
import {timer} from "../utils";
import {Datatype} from "../framework/Datastore";

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

  constructor(props: any) {
    super(props);
    this.state = {
      showStimulus: false
    };
    this.stimulusTimestamp = null;
    this.responseStartTimestamp = null;
    this.response = '';
  }

  handleKeyDown(key: string) {
    const timestamp = new Date();
    if (this.state.showStimulus){
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
    console.log(this.props.controller.datastore.data);
    this.props.controller.functions.goToNextScreen();
  }

  componentDidMount() {
    super.componentDidMount();

    this.props.controller.datastore.append({
      screenName: this.props.screenName,
      type: Datatype.Metadata,
      key: 'delay',
      value: this.props.delay
    });

    timer(this.props.delay, this.timer_period, (() => {
      this.setState({showStimulus: true},
        () => {this.stimulusTimestamp = new Date()});
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