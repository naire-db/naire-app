import React from 'react';
import { Form } from 'semantic-ui-react';

import { registerQuestionView, useAState } from './base';
import { QLabel } from './utils';

function TextView(props) {
  const q = props.question;
  const [resp, setResp] = useAState(q);

  const {min_length, max_length} = q;
  const [error, setError] = props.useErrorState(() => min_length > 0);

  function onChange(e) {
    const v = e.target.value;
    if (v.length > max_length)
      return;
    setError(v.length < min_length);
    setResp(v);
  }

  return <Form>
    <Form.TextArea
      maxLength={max_length}
      placeholder='输入...'
      onChange={onChange}
      value={resp}
    />
    {
      min_length !== 0 &&
      <QLabel
        text={`至少输入 ${min_length} 个字符`}
        error={props.tried && resp.length < min_length}
      />
    }
    <QLabel
      text={`最多输入 ${max_length} 个字符`}
    />
  </Form>
}

registerQuestionView('text', TextView, () => '');
