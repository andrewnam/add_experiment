import * as React from 'react';
import './Experiment.css';
import ResponseScreen from "./screen_templates/ResponseScreen";
import Controller from "./framework/Controller";
import Welcome from "./screens/Welcome";

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
  controller: Controller;

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      current_screen: 0
    };

    this.controller = new Controller({goToNextScreen: this.goToNextScreen.bind(this)});
    this.screens = [
      <Welcome controller={this.controller}/>,
      <ResponseScreen controller={this.controller} delay={500} stimulus={'3+4'}/>
    ]
  }

  goToNextScreen() {
    this.setState((state: any) => {return {current_screen: state.current_screen + 1}},
      () => {
        // this.recordNewScreen();
        // // If the experiment is over:
        // if (this.state.current_screen == this.screens.length - 1) {
        //   emitHitComplete(this.onComplete);
        // }
      });
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