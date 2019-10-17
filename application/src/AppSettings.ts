export const AppSettings = {
  saveDirectory: 'add2/test',
  maxTrialTime: 6000,
  maxTypeTime: 300,
  delayLower: 400,
  delayUpper: 1000,
  maxAddend: 20,

  numDemonstrationTrials: 5,
  allowedDemonstrationErrors: 2, // if they miss more than this, they are booted
  numCallibrationSets: 3,
  numWarmupTrials: 10,
  numAdd2Split: 3, // splits the add2 problems across n sets

  correctReward: .01,
  incorrectReward: 0
};

export default AppSettings