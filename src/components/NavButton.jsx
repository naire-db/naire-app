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

  return <Control
    {...props}
    control={undefined}
    recoverable={undefined}
    loading={loading}
    disabled={loading}
    onClick={onClick}
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
