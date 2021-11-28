import React from 'react';

import { BaseQuestion, registerQuestionType } from './base';
import { InputEditor } from './input';

class TextQuestion extends BaseQuestion {
  type = 'text';

  min_length = 1;
  max_length = 200;
  regex = '';
}


function TextQuestionEditor(props) {
  return <InputEditor noRegex {...props} />;
}

registerQuestionType('text', TextQuestion, TextQuestionEditor);

export { TextQuestion, TextQuestionEditor };
