import * as React from 'react';
import Controller from "../framework/Controller";

class Screen extends React.Component {
  props!: {controller: Controller};

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
    document.addEventListener('keydown', this.boundKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.boundKeyDown)
  }
}

export default Screen