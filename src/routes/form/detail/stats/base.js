const statMap = {};
const renderMap = {};

function registerQuestionStat(type, E, render) {
  statMap[type] = E;
  renderMap[type] = render;
}

export { registerQuestionStat, statMap, renderMap };
