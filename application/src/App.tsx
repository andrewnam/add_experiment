import * as React from 'react';
import './App.css';

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "primeflex/primeflex.css"

import Experiment from "./Experiment";

class App extends React.Component {
  constructor(props: Readonly<{}>) {
    super(props);
  }
  public render() {
    return <Experiment/>
  }
}

export default App;
