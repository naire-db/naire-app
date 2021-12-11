import React from 'react';
import { Form } from 'semantic-ui-react';

import { unwrap_nullable } from 'utils';
import { MAX_LENGTH } from '../types/text';
import { registerQuestionView, useAState } from './base';
import { QLabel } from './utils';

function TextView(props) {
  const q = props.question;
  const [resp, setResp] = useAState(q);

  const min_length = unwrap_nullable(q.min_length, 0);
  const max_length = unwrap_nullable(q.max_length, MAX_LENGTH);
  const [, setError] = props.useErrorState(() => min_length > 0);

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
      onChange={onChange}
      value={resp}
    />
    {min_length !== 0 &&
      <QLabel
        text={`至少输入 ${min_length} 个字符`}
        error={props.tried && resp.length < min_length}
      />
    }
    {max_length !== MAX_LENGTH &&
      <QLabel
        text={`最多输入 ${max_length} 个字符`}
      />
    }
  </Form>;
}

registerQuestionView('text', TextView, () => '');
