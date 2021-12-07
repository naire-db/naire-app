import React from 'react';
import { Form } from 'semantic-ui-react';

import { registerQuestionView, useAState } from './base';

function DropdownView(props) {
  const q = props.question;
  const [choice, setChoice] = useAState(q);

  const downOptions = q.options.map(
    ({id, text}) =>
      ({key: id, text, value: id}
    ));

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
        value={choice}
        onChange={onChange}
      />
    }
  </Form>;
}

registerQuestionView('dropdown', DropdownView, () => null);
