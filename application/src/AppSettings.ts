export const AppSettings = {
  post_url: "https://web.stanford.edu/~ajhnam/cgi-bin/post_endpoint.py",
  // saveDirectory: 'add2/test',
  saveDirectory: 'add2/exp01',

  maxTrialTime: 6000,
  maxTypeTime: 300,
  delayLower: 400,
  delayUpper: 1000,

  maxAddend: 20,
  numWarmupTrials: 10,
  numDemonstrationTrials: 5,
  numCalibrationSets: 3,
  numAdd2Split: 3, // splits the add2 problems across n sets

  correctReward: .01,
  incorrectPenalty: .01
};

export default AppSettings