import * as React from 'react';
import './Experiment.css';
import ResponseScreen from "./screen_templates/ResponseScreen";

class Experiment extends React.Component {
  static assignmentIdParam = 'assignmentId';
  static hitIdParam = 'hitId';
  static workerIdParam = 'workerId';

  // assignmentId: string;
  // hitId: string;
  // workerId: string;

  state: {
    current_screen: number,
  };

  screens: Array<any>;
  // screens: Scre

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      current_screen: 0
    };

    this.screens = [
      <ResponseScreen delay={500} stimulus={'3+4'}/>
    ]
  }

  renderScreen() {
    if (this.state.current_screen < this.screens.length) {
      return this.screens[this.state.current_screen];
    }
    return <p>Error: current screen is {this.state.current_screen}</p>;
  }

  render() {
    return <div>
      <div className={'Experiment center'}>
        <div className={"screen"} id-="screen">
          {this.renderScreen()}
        </div>
      </div>
    </div>
  }
}

export default Experiment