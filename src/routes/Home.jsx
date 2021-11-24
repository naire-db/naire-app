import React from 'react';
import { Container, Header } from 'semantic-ui-react';

import AppLayout from 'layouts/AppLayout';

function Home() {
  return (
    <AppLayout>
      <Container text style={{marginTop: '7em'}}>
        <Header as='h1'>
          <code>{'// TODO: home page >_<'}</code>
        </Header>
      </Container>
    </AppLayout>
  );
}

export default Home;
