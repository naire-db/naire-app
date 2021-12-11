import React from 'react';
import { Form } from 'semantic-ui-react';

import { unwrap_nullable } from 'utils';
import { registerQuestionView, useAState } from './base';
import { QLabel } from './utils';

function CheckboxView(props) {
  const q = props.question;
  const [selectedOids, setSelectedOids] = useAState(q);
  const {options} = q;
  const min_choices = unwrap_nullable(q.min_choices, 0);
  const max_choices = unwrap_nullable(q.max_choices, options.length);

  const [error, setError] = props.useErrorState(() => min_choices > 0);

  function addOid(oid) {
    const o = selectedOids;
    // using a update action causes "Cannot update a component
    // (`FormView`) while rendering a different component
    // (`CheckboxView`)"
    console.log('adding', oid, 'to', o);
    if (o.includes(oid))
      return o;
    const a = [oid, ...o];
    console.log(a);
    setError(a.length > max_choices || a.length < min_choices);
    setSelectedOids(a);
  }

  function removeOid(oid) {
    const a = selectedOids.filter(x => x !== oid);
    console.log(a);
    setError(a.length > max_choices || a.length < min_choices);
    setSelectedOids(a);
  }

  return <Form>
    {
      options.map(o => (
        <Form.Checkbox
          key={o.id}
          label={o.text}
          error={props.tried && error}
          checked={selectedOids.includes(o.id)}
          onChange={(_, d) => (
            d.checked ? addOid(o.id) : removeOid(o.id)
          )}
        />
      ))
    }
    {min_choices !== 0 && <QLabel
      text={`至少选择 ${min_choices} 项`}
      error={props.tried && selectedOids.length < min_choices}
    />}
    {max_choices !== options.length && <QLabel
      text={`最多选择 ${max_choices} 项`}
      error={props.tried && selectedOids.length > max_choices}
    />}
  </Form>;
}

registerQuestionView('checkbox', CheckboxView, () => []);
