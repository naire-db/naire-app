import React from 'react';
import { Form } from 'semantic-ui-react';

import { registerQuestionView, useAState } from './base';

function DropdownView(props) {
  const q = props.question;
  const [choice, setChoice] = useAState(q);

  const downOptions = [];

  for (let i = 0; i < q.options.length; ++i) {
    const item = q.options[i];
    downOptions.push(
      {key: parseInt(item.id, 10), text: item.text, value: item.text}
    )
  }

  function onChange(_, d) {
    setChoice(d.value);
  }

  return <Form>
    {
      <Form.Dropdown
        fluid
        selection
        placeholder='选择...'
        options={downOptions}
        onChange={onChange}
      />
    }
  </Form>;
}

registerQuestionView('dropdown', DropdownView, () => null);
