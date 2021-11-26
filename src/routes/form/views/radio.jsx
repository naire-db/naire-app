import React from 'react';
import { Form } from 'semantic-ui-react';

import { registerQuestionView, useAState, useErrorFlag } from './base';

function RadioView(props) {
  const q = props.question;
  const [selectedOid, setSelectedOid] = useAState(q);

  const flag = useErrorFlag(props, true);

  function onChange(oid) {
    flag.unset();
    setSelectedOid(oid);
  }

  return <Form>
    {
      q.options.map(o => (
        <Form.Radio
          key={o.id}
          label={o.text}
          onChange={() => onChange(o.id)}
          checked={selectedOid === o.id}
          error={props.tried && selectedOid === null}
        />
      ))
    }
  </Form>;
}

registerQuestionView('radio', RadioView, () => null);
