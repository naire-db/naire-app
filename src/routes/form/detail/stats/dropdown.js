import { registerQuestionStat } from './base';
import { RadioAnswerRenderFactory, RadioStat } from './radio';
import { chartOptions } from './utils';

function RadioDropdownStat(props) {
  return <RadioStat
    {...props}
    chartOptions={{
      ...chartOptions,
      maintainAspectRatio: props.question.options.length >= 5,
    }}
  />;
}

registerQuestionStat('dropdown', RadioDropdownStat, RadioAnswerRenderFactory);
