import React from 'react';
import { Container, Header, Icon } from 'semantic-ui-react';

import AppLayout from 'layouts/AppLayout';

function Profile() {
  return (
    <AppLayout>
      <Container text style={{marginTop : '7em'}}>
        <Header as={"h1"}>
          Profile
        </Header>

        <Icon name={"address book outline"} />
        <p>姓名</p>

        <Icon name={"id badge outline"} />
        <p>ID</p>

        <Icon name={'user'} />
        <p>用户名</p>

        <Icon name={'mail'} />
        <p>电子邮箱</p>

        <Icon name={'users'} />
        <p>隶属</p>


      </Container>
    </AppLayout>
  );
}

export default Profile;
