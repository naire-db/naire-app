import React from 'react';
import { Container } from 'semantic-ui-react';

import Nav from 'components/Nav';

function AppLayout(props) {
  return <>
    <Nav />
    {props.offset ?
      <Container
        text={props.text}
        style={{
          marginTop: props.offset === true ? '5.5em' : props.offset,
          paddingBottom: 80
        }}
      >
        {props.children}
      </Container> :
      props.children
    }
  </>;
}

export default AppLayout;
