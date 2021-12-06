import React from 'react';

import { BaseQuestion, registerQuestionType } from './base';
import { InputEditor } from './input';
import { unwrap_nullable, wrap_nullable } from './utils';

const MAX_LENGTH = 20000;

class TextQuestion extends BaseQuestion {
  type = 'text';

  min_length = null;
  max_length = null;

  onSave() {
    this.min_length = unwrap_nullable(this.min_length, 0);
    this.max_length = unwrap_nullable(this.max_length, MAX_LENGTH);
  }

  afterLoad() {
    this.min_length = wrap_nullable(this.min_length, 0);
    this.max_length = wrap_nullable(this.max_length, MAX_LENGTH);
  }
}

function TextQuestionEditor(props) {
  return <InputEditor noRegex maxLength={MAX_LENGTH} {...props} />;
}

registerQuestionType('text', TextQuestion, TextQuestionEditor);
