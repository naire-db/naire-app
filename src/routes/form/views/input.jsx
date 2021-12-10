import React, { useMemo } from 'react';
import { Form } from 'semantic-ui-react';

import { registerQuestionView, useAState } from './base';
import { QLabel } from './utils';
import { regexMap } from '../RegexMap';

function InputView(props) {
  const q = props.question;
  const [value, setValue] = useAState(q);
  const {min_length, max_length, regex} = q;

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

  function regexQLabel() {
    if (regex === regexMap['id']) {
      return '身份证号码';
    } else if (regex === regexMap['telephone']) {
      return '固定电话号码';
    } else if (regex === regexMap['email']) {
      return '电子邮箱';
    } else if (regex === regexMap['mobile']) {
      return '移动电话号码';
    } else if (regex === regexMap['n']) {
      return '';
    } else return regex;
  }

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
    {
      regex !== null && regexQLabel() !== '' &&
      <QLabel
        text={regexQLabel()}
        error={props.tried && !matchRegex(value)}
      />
    }
  </Form>;
}

registerQuestionView('input', InputView, () => '');
