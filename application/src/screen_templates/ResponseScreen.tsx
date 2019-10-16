import './ResponseScreen.css';
import * as React from 'react';
import Screen from "./Screen";



class ResponseScreen extends Screen {
  props!: {
    delay: number;
    stimulus: string;
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