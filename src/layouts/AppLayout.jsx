import React from 'react';
import { Container } from 'semantic-ui-react';

import Nav from 'components/Nav';

function AppLayout(props) {
  return <>
    <Nav />
    {props.offset ?
      <Container style={{marginTop: props.offset === true ? '5.5em' : props.offset}}>
        {props.children}
      </Container> :
      props.children
    }
  </>;
}

export default AppLayout;
