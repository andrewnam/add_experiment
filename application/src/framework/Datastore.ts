export enum Datatype {
  ResponseTime = 'responseTime',
  Response = 'response',
  Metadata = 'metadata',
  SurveyResponse = 'surveyResponse'
}

export interface Datum {
  screenName: string,
  type: Datatype,
  key: string,
  value: string | Date | number
}

class Datastore {
  data: Array<Datum>;

  constructor() {
    this.data = new Array<Datum>();
  }

  append(datum: Datum) {
    this.data.push(datum);
  }
}
// export {Datastore, Datum}

export default Datastore