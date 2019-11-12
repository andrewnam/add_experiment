export enum Datatype {
  KeyPress = 'keyPress',
  TaskDetail = 'taskDetail',
  Response = 'response',
  Metadata = 'metadata',
  SurveyResponse = 'surveyResponse'
}

export interface Datum {
  screenName: string,
  type: Datatype,
  key: string,
  value: string | Date | number,
  timestamp?: Date
}

class Datastore {
  data: Array<Datum>;

  constructor() {
    this.data = new Array<Datum>();
  }

  append(datum: Datum) {
    datum.timestamp = new Date();
    this.data.push(datum);
  }
}

export default Datastore