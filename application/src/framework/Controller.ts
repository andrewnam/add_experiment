interface ControllerFunctions {
  goToNextScreen: () => void;
}

class Controller {
  functions: ControllerFunctions;

  constructor(functions: ControllerFunctions) {
    this.functions = functions;
  }

}

export default Controller;