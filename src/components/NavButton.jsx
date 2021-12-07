import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';

function NavButton(props) {
  const {control: Control = Button, recoverable = false} = props;
  const [loading, setLoading] = useState(false);

  const onClick = recoverable ? async (...args) => {
    setLoading(true);
    await props.onClick?.(...args);
    setLoading(false);
  } : (...args) => {
    setLoading(true);
    props.onClick?.(...args);
  };

  const p = {
    ...props,
    loading: props.loading || loading,
    disabled: props.disabled || loading,
    control: undefined,
    recoverable: undefined,
    onClick
  };

  return <Control
    {...p}
  />;
}

function NavFormButton(props) {
  return <NavButton
    {...props}
    control={Form.Button}
  />;
}

NavButton.Form = NavFormButton;

export default NavButton;
