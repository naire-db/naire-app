import React from 'react';
import { Form } from 'semantic-ui-react';

import { BaseQuestion, registerQuestionType, useErrorFlag, useQState } from './base';
import InputNumber from 'components/InputNumber';

import './question.css';

class InputQuestion extends BaseQuestion {
  type = 'input';

  min_length = 1;
  max_length = 200;
  regex = '';
}

function InputEditor(props) {
  const [minLength, setMinLength] = useQState('min_length', props);
  const [maxLength, setMaxLength] = useQState('max_length', props);
  const [, setRegex] = useQState('regex', props);

  const flag = useErrorFlag(props);

  function onMinLengthChanged(v) {
    flag.set_to(v > maxLength);
    setMinLength(v);
  }

  function onMaxLengthChanged(v) {
    flag.set_to(minLength > v);
    setMaxLength(v);
  }

  return <>
    <Form className='input-body'>
      <Form.Group widths='equal'>
        <InputNumber
          min={1}
          max={200}
          defaultValue={1}
          label='最小输入长度'
          value={minLength}
          onChange={onMinLengthChanged}
        />
        <InputNumber
          min={1}
          max={200}
          defaultValue={200}
          label='最大输入长度'
          value={maxLength}
          onChange={onMaxLengthChanged}
        />
      </Form.Group>
      <Form.Input
        onChange={e => setRegex(e.target.value)}
        label='正则表达式（可选）'
      />
    </Form>
  </>;
}

registerQuestionType('input', InputQuestion, InputEditor);

export { InputQuestion, InputEditor };
