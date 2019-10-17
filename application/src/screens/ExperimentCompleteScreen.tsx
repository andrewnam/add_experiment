import * as React from "react";
import Screen from "../screen_templates/Screen";
import Controller from "../framework/Controller";

class ExperimentCompleteScreen extends Screen {
  props!: {
    controller: Controller,
    screenName: string
  };

  render() {
    return <div>
      <div className={'text'}>
        Data successfully uploaded! You may close this window.
      </div>
    </div>
  }
}

export default ExperimentCompleteScreen;