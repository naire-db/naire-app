import React from 'react';

import { registerQuestionType, useQState } from './base';
import { CheckboxOptionTable, CheckboxQuestion } from './checkbox';


class RadioQuestion extends CheckboxQuestion {
  type = 'radio';
}

function RadioEditor(props) {
  const [options, setOptions] = useQState('options', props);

  return (
    <CheckboxOptionTable
      options={options}
      setOptions={setOptions}
      ctx={props.ctx}
      radio
    />
  );
}

registerQuestionType('radio', RadioQuestion, RadioEditor);

export { RadioQuestion, RadioEditor };
