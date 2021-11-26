import React from 'react';
import { Label } from 'semantic-ui-react';

function QLabel(props) {
  return <Label basic color={props.error ? 'red' : undefined}>{props.text}</Label>;
}

export { QLabel };
