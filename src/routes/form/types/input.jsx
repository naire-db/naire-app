import React from 'react';
import { Dropdown, Form, Input } from 'semantic-ui-react';

import NumberInput from 'components/NumberInput';
import { BaseQuestion, registerQuestionType, useQState } from './base';
import { makeRangeNumberInputProps, unwrap_nullable, wrap_nullable } from './utils';

const MAX_LENGTH = 200;

const regexTemplates = [
  {
    key: 'mobile',
    text: '移动电话号码（例如：13000000000）',
    value: 'mobile',
  },
  {
    key: 'email',
    text: '电子邮箱（例如：user@domain.com）',
    value: 'email',
  },
  {
    key: 'id',
    text: '身份证号码（15位或18位）',
    value: 'id'
  },
  {
    key: 'telephone',
    text: '固定电话（例如：010-88888888 或 0511-8888888）',
    value: 'telephone'
  }
];

const regexMap = {
  id: String.raw`(\d{18})|(\d{15})`,
  telephone: String.raw`\d{3}-\d{8}|\d{4}-\d{7}`,
  email: String.raw`(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))`,
  mobile: String.raw`(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}`
};

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
        !noRegex &&
        <Form.Field>
          <Input
            value={regex}
            onChange={e => setRegex(e.target.value)}
            label='正则表达式'
            placeholder='无正则匹配要求则留空'
          />
          <Dropdown
            value={ddValue || null}
            selection
            options={regexTemplates}
            onChange={handleSelection}
            placeholder='常用正则表达式'
          />
        </Form.Field>
      }
    </Form>
  );
}

registerQuestionType('input', InputQuestion, InputEditor);

export { InputQuestion, InputEditor };
