import React from 'react';
import { Form } from 'semantic-ui-react';

import { BaseQuestion, registerQuestionType, useQState } from './base';
import NumberInput from '../../../components/NumberInput';

class TextQuestion extends BaseQuestion {
  type = 'text';

  min_length = 1;
  max_length = 200;
  regex = '';
}


function TextQuestionEditor(props) {
  const [minLength, setMinLength] = useQState('min_length', props);
  const [maxLength, setMaxLength] = useQState('max_length', props);

  return <>
    <Form>
      <Form.Group widths='equal'>
        <NumberInput
          min={1}
          max={200}
          defaultValue={1}
          label='最小输入长度'
          value={minLength}
          onChange={setMinLength}
        />
        <NumberInput
          min={1}
          max={200}
          defaultValue={200}
          label='最大输入长度'
          value={maxLength}
          onChange={setMaxLength}
        />
      </Form.Group>
    </Form>
  </>;
}

registerQuestionType('text', TextQuestion, TextQuestionEditor);

export { TextQuestion, TextQuestionEditor };
