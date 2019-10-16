import './ResponseScreen.css';
import * as React from 'react';
import Screen from "./Screen";
import Controller from "../framework/Controller";
import {timer} from "../utils";

class ResponseScreen extends Screen {
  props!: {
    controller: Controller,
    delay: number,
    stimulus: string,
    target: string,
    maxTypeTime?: number
  };

  state: {
    showStimulus: boolean
  };

  stimulusTimestamp: number | null;

  constructor(props: any) {
    super(props);
    this.state = {
      showStimulus: false
    };
    this.stimulusTimestamp = null;
  }

  handleKeyDown(key: string) {

  }

  componentDidMount() {
    super.componentDidMount();
    const start = Date.now();
    timer(this.props.delay, 25, (() => {
      console.log(Date.now() - start);
      this.setState({showStimulus: true},
        () => {this.stimulusTimestamp = Date.now()});
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