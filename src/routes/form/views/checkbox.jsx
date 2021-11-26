import React, { useMemo } from 'react';
import { Form, Label } from 'semantic-ui-react';

import { registerQuestionView, useAState, useErrorState } from './base';

function CheckboxView(props) {
  const q = props.question;
  const [, setSelectedOids] = useAState(q);
  const {min_choices, max_choices} = q;

  const [error, setError] = useErrorState(props, () => min_choices > 0);

  function addOid(oid) {
    setSelectedOids(a => {
      console.log('adding', oid, 'to', a);
      if (a.includes(oid))
        return;
      a.push(oid);
      console.log(a);
      setError(a.length > max_choices || a.length < min_choices);
      return a;
    });
  }

  function removeOid(oid) {
    setSelectedOids(o => {
      console.log('rming', oid, 'from', o);
      const a = o.filter(x => x !== oid);
      console.log(a);
      setError(a.length > max_choices || a.length < min_choices);
      return a;
    });
  }

  function getPrompt() {
    const mn = min_choices !== 0 && `至少选择 ${min_choices} 项`;
    const mx = max_choices !== q.options.length && `最多选择 ${max_choices} 项`;
    if (mn && mx)
      return mn + '，' + mx;
    return mn || mx;
  }

  const prompt = useMemo(getPrompt, [q]);

  return <Form>
    {
      q.options.map(o => (
        <Form.Checkbox
          key={o.id}
          label={o.text}
          error={props.tried && error}
          onChange={(_, d) => (d.checked ? addOid(o.id) : removeOid(o.id))}
        />
      ))
    }
    <Label>{prompt}</Label>
  </Form>;
}

registerQuestionView('checkbox', CheckboxView, () => []);
