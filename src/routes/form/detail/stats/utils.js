import { ArcElement, BarElement, CategoryScale, Chart, Legend, LinearScale, Tooltip } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function formatPercent(ratio) {
  return (ratio * 100).toFixed(2) + '%';
}

const chartOptions = {
  maintainAspectRatio: false,
  responsive: true,
};

// Tableau20
// https://github.com/nagix/chartjs-plugin-colorschemes/blob/master/src/colorschemes/colorschemes.tableau.js
const colors = [
  '#4E79A7', '#A0CBE8', '#F28E2B', '#FFBE7D', '#59A14F', '#8CD17D', '#B6992D', '#F1CE63',
  '#499894', '#86BCB6', '#E15759', '#FF9D9A', '#79706E', '#BAB0AC', '#D37295', '#FABFD2',
  '#B07AA1', '#D4A6C8', '#9D7660', '#D7B5A6'
];

function rand() {
  return Math.floor(Math.random() * 233);
}

function randColor() {
  return `rgba(${rand()}, ${rand()}, ${rand()}, 0.9)`;
}

function makeColors(n) {
  while (colors.length < n)
    colors.push(randColor());
  return colors.slice(0, n);
}

export { formatPercent, chartOptions, makeColors };
