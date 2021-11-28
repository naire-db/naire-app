const statMap = {};

function registerQuestionStat(type, E) {
  statMap[type] = E;
}

export { registerQuestionStat, statMap };
