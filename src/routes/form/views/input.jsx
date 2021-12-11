import React, { useMemo } from 'react';
import { Form } from 'semantic-ui-react';

import { unwrap_nullable } from 'utils';
import { regexMap, regexTemplates } from '../RegexMap';
import { MAX_LENGTH } from '../types/input';
import { registerQuestionView, useAState } from './base';
import { QLabel } from './utils';

function InputView(props) {
  const q = props.question;
  const [value, setValue] = useAState(q);
  const {regex} = q;
  const min_length = unwrap_nullable(q.min_length, 0);
  const max_length = unwrap_nullable(q.max_length, MAX_LENGTH);

  const [error, setError] = props.useErrorState(() => min_length > 0 || !matchRegex(''));

  const reg = useMemo(() => {
    return new RegExp(regex);
  }, [regex]);

  function onChange(e) {
    const v = e.target.value;
    if (v.length > max_length)
      return;
    setError(v.length < min_length || !matchRegex(v));
    setValue(v);
  }

  const label = regex && regexTemplates.find(
    ({value}) => regexMap[value] === regex
  )?.text;

  function matchRegex(value) {
    return reg.test(value);
  }

  return <Form>
    <Form.Input
      value={value}
      onChange={onChange}
      maxLength={max_length}
      error={props.tried && error}
      type={regex === '\\d+' || regex === '\\d*' ? 'number' : undefined}
    />
    {min_length !== 0 &&
      <QLabel
        text={`至少输入 ${min_length} 个字符`}
        error={props.tried && value.length < min_length}
      />
    }
    {max_length !== MAX_LENGTH &&
      <QLabel
        text={`最多输入 ${max_length} 个字符`}
      />
    }
    {label &&
      <QLabel
        text={label}
        error={props.tried && !matchRegex(value)}
      />
    }
  </Form>;
}

registerQuestionView('input', InputView, () => '');
