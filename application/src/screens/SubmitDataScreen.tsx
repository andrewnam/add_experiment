import * as React from "react";
import Screen from "../screen_templates/Screen";
import Controller from "../framework/Controller";

class SubmitDataScreen extends Screen {
  props!: {
    controller: Controller,
    screenName: string
  };

  componentDidMount() {
    super.componentDidMount();
    this.props.controller.sendData().then(() => {
      this.props.controller.submitHIT();
      this.props.controller.functions.goToNextScreen();
    });
  }

  render() {
    return <div>
      <div className={'text'}>
        Thank you for completing the experiment! Submitting data to Stanford servers. Please wait.
      </div>
    </div>
  }
}

export default SubmitDataScreen;