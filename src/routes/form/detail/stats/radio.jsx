import React from 'react';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Grid } from 'semantic-ui-react';
import { registerQuestionStat } from './base';

ChartJS.register(ArcElement, Tooltip, Legend);

function rand() {
  return Math.floor(Math.random() * 233);
}

function randColor() {
  return `rgb(${rand()}, ${rand()}, ${rand()})`;
}

const fluidOptions = {
  maintainAspectRatio: false,
  responsive: true
};

function RadioStat(props) {
  const {question: q, values} = props;
  const optMap = {};
  const labels = [];
  const counts = [];
  const colors = [];
  for (const o of q.options) {
    optMap[o.id] = counts.length;
    labels.push(o.text);
    counts.push(0);
    colors.push(randColor());
  }

  for (const v of values)
    ++counts[optMap[v]];

  console.log(q, values, optMap, counts, labels);

  const data = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: colors
      },
    ]
  };

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={7}>
          <Pie
            data={data}
          />
        </Grid.Column>
        <Grid.Column width={11} />
      </Grid.Row>
    </Grid>
  );
}

registerQuestionStat('radio', RadioStat);
