import React from 'react';
import { Form } from 'semantic-ui-react';

import NumberInput from 'components/NumberInput';
import { BaseQuestion, registerQuestionType, useQState } from './base';
import { makeRangeNumberInputProps, unwrap_nullable } from './utils';

class InputQuestion extends BaseQuestion {
  type = 'input';

  min_length = null;
  max_length = null;
  regex = '';

  onSave() {
    this.min_length = unwrap_nullable(this.min_length, 0);
    this.max_length = unwrap_nullable(this.max_length, 200);
  }
}

function InputEditor(props) {
  const [minLength, setMinLength] = useQState('min_length', props);
  const [maxLength, setMaxLength] = useQState('max_length', props);
  const [, setRegex] = useQState('regex', props);

  const [error, setError] = props.useErrorState();
  const [minProps, maxProps] = makeRangeNumberInputProps(
    minLength, setMinLength, 0, maxLength, setMaxLength, 200, setError
  );

  return (
    <Form>
      <Form.Group widths='equal'>
        <NumberInput
          label='最小输入长度'
          error={error}
          {...minProps}
        />
        <NumberInput
          label='最大输入长度'
          error={error}
          {...maxProps}
        />
      </Form.Group>
      {!props.noRegex && <Form.Input
        onChange={e => setRegex(e.target.value)}
        label='正则表达式（可选）'
      />}
    </Form>
  );
}

registerQuestionType('input', InputQuestion, InputEditor);

export { InputQuestion, InputEditor };
