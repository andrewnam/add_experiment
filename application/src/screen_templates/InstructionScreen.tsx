import Screen from "../screen_templates/Screen";
import Controller from "../framework/Controller";
import * as React from "react";

class InstructionScreen extends Screen {
  props!: {
    instructions: any,
    controller: Controller,
    screenName: string
  };

  handleKeyDown(key: string) {
    super.handleKeyDown(key);
    this.props.controller.functions.goToNextScreen();
  }

  render() {
    let instructions = this.props.instructions;
    if (typeof instructions == 'string') {
      instructions = [instructions];
    }
    let instructionElements = [];
    if (Array.isArray(instructions)) {
      for (let i=0; i<instructions.length; i++) {
        if (typeof instructions[i] == 'string') {
          instructionElements.push(<div className={'text'} key={i}>{instructions[i]}</div>)
        } else {
          instructionElements.push(<div key={i}>{instructions[i]}</div>)
        }
        instructionElements.push(<br/>);
        instructionElements.push(<br/>);
      }
    } else {
      instructionElements.push(instructions);
    }
    return <div>
      {instructionElements}
      <div className={'continue'}>
        Press any key to continue.
      </div>
    </div>
  }
}

export default InstructionScreen