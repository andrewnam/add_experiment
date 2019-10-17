import * as React from 'react';
import Controller from "../framework/Controller";
import {Datatype} from "../framework/Datastore";

class Screen extends React.Component {
  props!: {
    controller: Controller,
    screenName: string
  };

  boundKeyDown: (event: any) => void;

  constructor(props: any) {
    super(props);
    this.boundKeyDown = this.keyDown.bind(this);
  }

  // Overload to use.
  handleKeyDown(key: string) {}

  keyDown(event: any) {
    let { key } = event;
    this.handleKeyDown(key);
  }

  componentDidMount() {
    this.props.controller.datastore.append({
      screenName: this.props.screenName,
      type: Datatype.Metadata,
      key: 'start',
      value: new Date()
    });

    document.addEventListener('keydown', this.boundKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.boundKeyDown)
  }
}

export default Screen