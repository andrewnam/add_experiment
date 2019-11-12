import * as React from 'react';
import Screen from "./Screen";
import Controller from "../framework/Controller";
import {timer} from "../utils";
import {Datatype} from "../framework/Datastore";

class ITIScreen extends Screen {
  props!: {
    controller: Controller,
    screenName: string,
    duration: number
  };

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();
    timer(this.props.duration, (() => {
      this.props.controller.functions.goToNextScreen();
    }).bind(this));

    this.props.controller.datastore.append({
      screenName: this.props.screenName,
      type: Datatype.TaskDetail,
      key: 'duration',
      value: this.props.duration
    });
  }

  render() {
    return <div style={{fontSize: "40px"}}>
      +
    </div>
  }
}

export default ITIScreen