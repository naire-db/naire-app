import React from 'react';
import { Form } from 'semantic-ui-react';

import NumberInput from 'components/NumberInput';
import { BaseQuestion, registerQuestionType, useQState } from './base';
import { makeRangeNumberInputProps, unwrap_nullable, wrap_nullable } from './utils';
import { regexMap, regexTemplates } from '../RegexMap';

const MAX_LENGTH = 200;


class InputQuestion extends BaseQuestion {
  type = 'input';

  min_length = null;
  max_length = null;
  regex = '';

  onSave() {
    this.min_length = unwrap_nullable(this.min_length, 0);
    this.max_length = unwrap_nullable(this.max_length, MAX_LENGTH);
  }

  afterLoad() {
    this.min_length = wrap_nullable(this.min_length, 0);
    this.max_length = wrap_nullable(this.max_length, MAX_LENGTH);
  }
}

function InputEditor(props) {
  const [minLength, setMinLength] = useQState('min_length', props);
  const [maxLength, setMaxLength] = useQState('max_length', props);
  const [regex, setRegex] = useQState('regex', props);

  const {maxLength: maxMaxLength = MAX_LENGTH, noRegex} = props;

  const [error, setError] = props.useErrorState();
  const [minProps, maxProps] = makeRangeNumberInputProps(
    minLength, setMinLength, 0, maxLength, setMaxLength, maxMaxLength, setError
  );
  console.log(regex, '!!!!!!!!!!!!!!!!');

  const handleSelection = (e, d) => {
    const v = regexMap[d.value];
    console.log(d.value, v);
    setRegex(v);
  };

  const ddValue = regexTemplates.filter(({value}) => regexMap[value] === regex)[0]?.value;
  console.log('ddv', ddValue);

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
      {
        !noRegex && <Form.Dropdown
          label={'输入格式限制'}
          value={ddValue || null}
          selection
          options={regexTemplates}
          onChange={handleSelection}
          placeholder='常用格式限制'
        />
      }

    </Form>
  );
}

registerQuestionType('input', InputQuestion, InputEditor);

export { InputQuestion, InputEditor };
