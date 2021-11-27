import React from 'react';
import { Form, Label } from 'semantic-ui-react';

import { registerQuestionView, useAState } from './base';
import { QLabel } from './utils';

function InputView(props) {
  const q = props.question;
  const [value, setValue] = useAState(q);
  const {min_length, max_length, regex} = q;

  const [error, setError] = props.useErrorState(() => min_length > 0);

  function onChange(e) {
    const v = e.target.value;
    if (v.length > max_length)
      return;
    setError(v.length < min_length);
    setValue(v);
  }

  // TODO: regex

  function makeLabel(text, error) {
    return <Label basic color={error ? 'red' : undefined}>{text}</Label>;
  }

  return <Form>
    <Form.Input
      value={value}
      onChange={onChange}
      maxLength={max_length}
      error={props.tried && error}
      type={regex === '\\d+' || regex === '\\d*' ? 'number' : undefined}
    />
    {
      min_length !== 0 &&
      <QLabel
        text={`至少输入 ${min_length} 个字符`}
        error={props.tried && value.length < min_length}
      />
    }
    <QLabel
      text={`最多输入 ${max_length} 个字符`}
    />
  </Form>;
}

registerQuestionView('input', InputView, () => '');
