import React, { useState } from 'react';

import { Form } from 'semantic-ui-react';

function NumberInput(props) {
  const [empty, setEmpty] = useState(props.defaultValue !== null);
  const handler = props.onChanged;

  function onChange(e) {
    const v = e.target.value;
    if (v === '') {
      if (props.onEmpty)
        props.onEmpty();
      setEmpty(true);
      return handler(props.nullable ? null : props.defaultValue);
    }
    if (empty) {
      if (props.onNonEmpty)
        props.onNonEmpty();
      setEmpty(false);
    }
    const x = parseInt(v, 10);
    if (x < props.min)
      return handler(props.min);
    if (x > props.max)
      return handler(props.max);
    return handler(x);
  }

  return (
    <Form.Input
      type='number'
      min={props.min}
      max={props.max}
      label={props.label}
      placeholder={`${props.defaultValue}`}
      onChange={onChange}
      value={empty ? '' : `${props.value}`}
      error={props.error}
    />
  );
}

export default NumberInput;
