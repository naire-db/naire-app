import React from 'react';

import Nav from 'components/Nav';

function AppLayout(props) {
  return <>
    <Nav />
    {props.children}
  </>;
}

export default AppLayout;
