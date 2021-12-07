import React from 'react';
import { Form } from 'semantic-ui-react';

import { registerQuestionView, useAState } from './base';

function DropdownView(props) {
  const q = props.question;
  const [choice, setChoice] = useAState(q);

  const [error, setError] = props.useErrorState(true);

  const downOptions = q.options.map(
    ({id, text}) =>
      ({key: id, text, value: id})
  );

  function onChange(_, d) {
    setChoice(d.value);
    setError(false);
  }

  return (
    <Form>
      <Form.Dropdown
        error={props.tried && error}
        fluid
        selection
        placeholder='请选择'
        options={downOptions}
        value={choice}
        onChange={onChange}
      />
    </Form>
  );
}

registerQuestionView('dropdown', DropdownView, () => null);
