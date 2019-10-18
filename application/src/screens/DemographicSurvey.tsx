import './DemographicSurvey.css'
import Screen from '../screen_templates/Screen';
import * as React from "react";
import {Spinner} from 'primereact/spinner';
import {Dropdown} from "primereact/dropdown";
import {ListBox} from "primereact/listbox";
import {Button} from "primereact/button";
import {Datatype} from "../framework/Datastore";

class DemographicSurvey extends Screen {

  static ageKey = 'age';
  static ageQuestion = 'What is your age?';
  static genderKey = 'gender';
  static genderQuestion = 'What is your gender?';
  static genderResponses = [{'label': 'Male'}, {'label': 'Female'}, {'label': 'Prefer not to say'}];
  static educationKey = 'education';
  static educationQuestion = 'What is your highest level of education (including currently attending)?';
  static educationResponses = [
    {'label': 'None'},
    {'label': '1st - 8th grade'},
    {'label': 'Some high school, no diploma'},
    {'label': 'High school graduate, diploma or the equivalent (for example: GED)'},
    {'label': 'Some college credit, no degree'},
    {'label': 'Associate\'s degree, occupational'},
    {'label': 'Associate\'s degree, academic'},
    {'label': 'Bachelor’s degree'},
    {'label': 'Master’s degree'},
    {'label': 'Professional degree'},
    {'label': 'Doctoral degree'}
  ];
  static mathKey = 'mathEducation';
  static mathQuestion = 'Which of the following topics in mathematics have you studied (select all that apply)?';
  static mathResponses = [
    {'label': 'Algebra'},
    {'label': 'Trigonometry'},
    {'label': 'Single-variable calculus'},
    {'label': 'Multi-variable calculus'},
    {'label': 'Linear algebra'},
    {'label': 'Probability & statistics'},
    {'label': 'Discrete mathematics'},
    {'label': 'Formal logic'}
  ];
  state: {
    age?: number,
    gender: any | null,
    education: any | null,
    mathEducation: Array<any>
  };

  constructor(props: any) {
    super(props);
    this.state = {
      age: undefined,
      gender: null,
      education: null,
      mathEducation: []
    }
  }

  onFinishButtonClick() {
    this.props.controller.datastore.append({
      screenName: this.props.screenName,
      type: Datatype.SurveyResponse,
      key: DemographicSurvey.ageKey,
      value: this.state.age!
    })
    this.props.controller.datastore.append({
      screenName: this.props.screenName,
      type: Datatype.SurveyResponse,
      key: DemographicSurvey.genderKey,
      value: this.state.gender!
    })
    this.props.controller.datastore.append({
      screenName: this.props.screenName,
      type: Datatype.SurveyResponse,
      key: DemographicSurvey.educationKey,
      value: this.state.education!
    })

    if (this.state.mathEducation.length == 0) {
      this.props.controller.datastore.append({
        screenName: this.props.screenName,
        type: Datatype.SurveyResponse,
        key: DemographicSurvey.mathKey,
        value: 'None'
      })
    } else {
      for (let i=0; i < this.state.mathEducation.length; i++) {
        this.props.controller.datastore.append({
          screenName: this.props.screenName,
          type: Datatype.SurveyResponse,
          key: DemographicSurvey.mathKey,
          value: this.state.mathEducation[i]
        })
      }
    }
    this.props.controller.functions.goToNextScreen();
  }

  render() {
    return (
      <div className={"DemographicSurvey"}>
        <div className={'inner'}>
          <div className={'maintext'}>
            Before you exit, as is commonly done in experiments involving
            human participants, we would like to collect some data about our sample population.
          </div>
          <br/>
          <div className={"question p-grid"}>
            <span className={"question-text p-col-8"}>
              {DemographicSurvey.ageQuestion}
            </span>
            <span className={"question-response p-col-4"}>
              <Spinner value={this.state.age}
                       size={17.5}
                       onChange={(e) => this.setState({age: e.value})}
                       min={0}
                       max={99}/>
            </span>
          </div>
          <div className={"question p-grid"}>
            <span className={"question-text p-col-8"}>
              {DemographicSurvey.genderQuestion}
            </span>
            <span className={"question-response p-col-4"}>
              <Dropdown value={this.state.gender}
                        options={DemographicSurvey.genderResponses}
                        optionLabel={'label'}
                        style={{'width': '170px'}}
                        onChange={(e) => this.setState({gender: e.value})}/>
            </span>
          </div>
          <div className={"question p-grid"}>
            <span className={"question-text p-col-8"}>
              {DemographicSurvey.educationQuestion}
            </span>
            <span className={"question-response p-col-4"}>
              <Dropdown value={this.state.education}
                        options={DemographicSurvey.educationResponses}
                        optionLabel={'label'}
                        autoWidth={false}
                        style={{'width': '170px'}}
                        onChange={(e) => this.setState({education: e.value})}/>
            </span>
          </div>
          <div className={"question p-grid"}>
            <span className={"question-text p-col-8"}>
              {DemographicSurvey.mathQuestion}
            </span>
            <span className={"question-response p-col-4"}>
              <ListBox value={this.state.mathEducation}
                       options={DemographicSurvey.mathResponses}
                       onChange={(e) => this.setState({mathEducation: e.value})}
                       multiple={true}
                       optionLabel={"label"}/>
            </span>
          </div>
          <div className="empty"/>
          <div className={'btn-container'}>
            <Button label="Finish"
                    className="p-button-success"
                    onClick={this.onFinishButtonClick.bind(this)}
                    disabled={this.state.age === undefined ||
                    this.state.gender === null ||
                    this.state.education === null}
            />
          </div>
        </div>

      </div>
    );
  }
}

export default DemographicSurvey