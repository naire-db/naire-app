import React from 'react';

import { BaseQuestion, registerQuestionType, useQState } from './base';
import { CheckboxOptionTable } from './checkbox';


class DropdownQuestion extends BaseQuestion {
  type = 'dropdown';

  constructor(id, ctx) {
    super(id);
    this.options = [ctx.newOption()];
  }
}

function DropdownQuestionEditor(props) {
  const [options, setOptions] = useQState('options', props);
  // TODO: identical to RadioQuestionEditor now. Should show a modal with a textarea and better with some presets.

  return (
    <CheckboxOptionTable
      options={options}
      setOptions={setOptions}
      ctx={props.ctx}
      radio
    />
  );
}

registerQuestionType('dropdown', DropdownQuestion, DropdownQuestionEditor);

export { DropdownQuestion, DropdownQuestionEditor };
