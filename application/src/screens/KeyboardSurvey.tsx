import Screen from '../screen_templates/Screen';
import * as React from "react";
import './KeyboardSurvey.css';
import {RadioButton} from 'primereact/radiobutton';
import {Button} from "primereact/button";
import {Datatype} from "../framework/Datastore";

class KeyboardSurvey extends Screen {
  static keyboardKey = 'keyboard';
  state: {
    response: string | null
  };

  constructor(props: any) {
    super(props);
    this.state = {
      response: null
    };
  }

  onNextButtonClick() {
    this.props.controller.datastore.append({
      screenName: this.props.screenName,
      type: Datatype.SurveyResponse,
      key: KeyboardSurvey.keyboardKey,
      value: this.state.response!
    })
    this.props.controller.functions.goToNextScreen();
  }

  render() {
    return <div className={"KeyboardSurvey"}>
      <div className={'maintext'}>
        This concludes the main body of the experiment. For improved callibration,
        please select the keyboard layout you used to complete this experiment.
      </div>
      <div>
        <div className={'selection p-grid bg1'}>
          <span className={'numbar-radio-container p-col-4'}>
            <RadioButton value="numbar"
                       name="response"
                       onChange={(e) => this.setState({response: e.value})}
                       checked={this.state.response === 'numbar'}/>
            <label htmlFor="rb1" className="p-radiobutton-label">Number bar</label>
          </span>

          <span className={"image-container p-col-8"}>
            <img src={process.env.PUBLIC_URL + "/images/numbar.png"}
                 width="360"
            />
          </span>
        </div>
        <div className={'selection p-grid bg2'}>
          <span className={'numpad-radio-container p-col-4'}>
            <RadioButton value="numpad"
                         name="response"
                         onChange={(e) => this.setState({response: e.value})}
                         checked={this.state.response === 'numpad'}/>
            <label htmlFor="rb2" className="p-radiobutton-label">Number pad</label>
          </span>

          <span className={"image-container p-col-8"}>
            <img src={process.env.PUBLIC_URL + "/images/numpad.png"}
                 width="180"
            />
          </span>
        </div>
        <div className={'selection p-grid bg1'}>
          <span className={'other-radio-container p-col-4'}>
            <RadioButton value="other"
                         name="response"
                         onChange={(e) => this.setState({response: e.value})}
                         checked={this.state.response === 'other'}/>
            <label htmlFor="rb3" className="p-radiobutton-label">Other</label>
          </span>

          <span className={"image-container p-col-8"}/>
        </div>
      </div>
      <div className={'btn-container'}>
        <Button label="Next"
                className="p-button-success"
                onClick={this.onNextButtonClick.bind(this)}
                disabled={this.state.response == null}
        />
      </div>
    </div>
  }
}

export default KeyboardSurvey