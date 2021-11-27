import React from 'react';

import { BaseQuestion, registerQuestionType, useQState } from './base';
import { CheckboxOptionTable } from './checkbox';


class RadioQuestion extends BaseQuestion {
  type = 'radio';

  constructor(id, ctx) {
    super(id);
    this.options = [ctx.newOption()];
  }
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
