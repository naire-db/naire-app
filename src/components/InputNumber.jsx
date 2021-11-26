import React, { useState } from 'react';

import { Form } from 'semantic-ui-react';

function InputNumber(props) {
  const [empty, setEmpty] = useState(props.defaultValue !== null);

  function onChange(e) {
    const v = e.target.value;
    if (v === '') {
      setEmpty(true);
      return props.onChange(props.defaultValue);
    }
    if (empty)
      setEmpty(false);
    const x = parseInt(v, 10);
    if (x < props.min)
      return props.onChange(props.min);
    if (x > props.max)
      return props.onChange(props.max);
    return props.onChange(x);
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
    >
    </Form.Input>
  );
}

export default InputNumber;
