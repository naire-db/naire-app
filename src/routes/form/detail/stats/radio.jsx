import React from 'react';
import { Pie } from 'react-chartjs-2';

import { registerQuestionStat } from './base';
import { chartOptions } from './utils';
import OptionStatLayout, { OptionCounter } from './OptionStatLayout';

import './index.css';

function RadioStat(props) {
  const {question: q, values} = props;
  const stat = new OptionCounter(q.options);

  for (const oid of values)
    stat.update(oid);
  stat.setTotal(values.length);

  /*
  while (data.length < 10)
    data.push({
      text: 'qwq',
      count: 20
    });
   */

  return (
    <OptionStatLayout
      stat={stat}
    >
      <Pie
        data={stat.toChartData()}
        options={chartOptions}
      />
    </OptionStatLayout>
  );
}

function RadioAnswerRenderFactory(q) {
  const m = new Map();
  for (const o of q.options)
    m.set(o.id, o.text);
  return oid => m.get(oid);
}

registerQuestionStat('radio', RadioStat, RadioAnswerRenderFactory);

export { RadioStat, RadioAnswerRenderFactory };
