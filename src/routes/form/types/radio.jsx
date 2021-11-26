import React from 'react';

import { registerQuestionType } from './base';
import { CheckboxEditor, CheckboxQuestion } from './checkbox';

class RadioQuestion extends CheckboxQuestion {
  type = 'radio';
}

function RadioEditor(props) {
  return <CheckboxEditor radio {...props} />;
}

registerQuestionType('radio', RadioQuestion, RadioEditor);

export { RadioQuestion, RadioEditor };
