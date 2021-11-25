import React from 'react';

import { registerQuestionType } from './base';
import { CheckboxEditor, CheckboxQuestion } from './checkbox';

class RadioQuestion extends CheckboxQuestion {
  type = 'radio';

  constructor(id, ctx) {
    super(id, ctx);
    this.options = [ctx.newOption()];
  }
}

function RadioEditor(props) {
  return <CheckboxEditor radio {...props} />;
}

registerQuestionType('radio', RadioQuestion, RadioEditor);

export { RadioQuestion, RadioEditor };
