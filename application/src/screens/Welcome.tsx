import * as React from 'react';
import Screen from "../screen_templates/Screen";

class Welcome extends Screen {

  handleKeyDown(key: string) {
    this.props.controller.functions.goToNextScreen();
  }

  render() {
    return <div>
      Blahblahblah. Instructions. Press any key
      to continue.
    </div>
  }
}

export default Welcome