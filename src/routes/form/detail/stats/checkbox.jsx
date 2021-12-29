import React from 'react';
import { Bar } from 'react-chartjs-2';

import { registerQuestionStat } from './base';
import { chartOptions } from './utils';
import OptionStatLayout, { OptionCounter } from './OptionStatLayout';

import './index.css';

function CheckboxStat(props) {
  const {question: q, values} = props;
  const stat = new OptionCounter(q.options);

  for (const oids of values)
    for (const oid of oids)
      stat.update(oid);
  stat.setTotal(values.length);

  return (
    <OptionStatLayout
      stat={stat}
    >
      <Bar
        data={stat.toFullChartData()}
        options={{
          scale: {
            ticks: {
              precision: 0
            }
          },
          plugins: {
            legend: {
              display: false
            },
          },
          ...chartOptions
        }}
      />
    </OptionStatLayout>
  );
}

function CheckboxAnswerRenderFactory(q) {
  const m = new Map();
  for (const o of q.options)
    m.set(o.id, o.text);
  return oids => oids.map(oid => m.get(oid)).join('；');
}

registerQuestionStat('checkbox', CheckboxStat, CheckboxAnswerRenderFactory);
