import './ResponseScreen.css';
import * as React from 'react';
import Screen from "./Screen";
import Controller from "../framework/Controller";

class ResponseScreen extends Screen {
  props!: {
    controller: Controller,
    delay: number,
    stimulus: string
  };

  state: {
    showStimulus: boolean
  };

  constructor(props: any) {
    super(props);
    this.state = {
      showStimulus: false
    }
  }

  render() {
    return <div>
      <div className="stimulus">
        {this.props.stimulus}
      </div>
    </div>
  }

}

export default ResponseScreen