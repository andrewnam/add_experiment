import {sleep} from "../utils";

const _ = require('lodash');
const stringify = require('json-stable-stringify');

const testAssignmentId = 'testAssignmentId';
const testHitId = 'testHitId';
const testWorkerId = 'testWorkerId';

export interface HITParams {
  onComplete: string;
  assignmentId: string;
  hitId: string;
  workerId: string;
}

async function attemptPost(url: string, filename: string, data: any) {
  const stringForm = stringify(data);
  return await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "filename": filename,
      data: data,
    })
  }).then(response => response.json())
    .then(function (response: any) {
      const result = stringify(response['data']) == stringForm;
      if (result) {
        return true;
      } else {
        console.log(response);
        return false;
      }
    })
    .catch(function (error: any) {
      console.log(error);
      return false;
    });
}

export async function post(url: string, filename: string, data: any, wait: boolean) {
  let retry = true;
  let i = 1;
  if (wait) {
    while (retry) {
      console.log(`Attempt with await ${i}: posting to ${filename}`);
      retry = !await attemptPost(url, filename, data);
      i += 1;
      await sleep(Math.pow(2, i)*50); // exponential backoff
    }
    console.log("Post success!");
  } else {
    console.log(`Posting to ${filename}`);
    attemptPost(url, filename, data);
  }
}

export function getHitParams(): HITParams {
  const urlParams = new URL(window.location.href).searchParams;
  // @ts-ignore
  const keys = Array.from(urlParams.keys());
  const values = _.map(keys, (k: string) => urlParams.get(k));

  const params: HITParams = _.zipObject(keys, values);
  params.assignmentId = params.assignmentId ? params.assignmentId : testAssignmentId;
  params.hitId= params.hitId ? params.hitId : testHitId;
  params.workerId = params.workerId ? params.workerId : testWorkerId;
  return params
}

export function submitHIT(message: string) {
  window.top.postMessage(message,"*")
}