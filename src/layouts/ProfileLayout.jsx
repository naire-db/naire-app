import React from 'react';

import Nav from 'components/Nav';
import { Container, Grid, Icon, Menu } from 'semantic-ui-react';

function ProfileLayout(props) {
  return <>
    <Nav />
    <Container text style={{marginTop: '7em'}}>
      <Grid>
        <Grid.Column width={6}>
          <Menu secondary vertical>
            <Menu.Item active={props.page === 'profile'} href='../profile'>
              <Icon name='user' />
              个人信息
            </Menu.Item>
            <Menu.Item active={props.page === 'password'} href='../password'>
              <Icon name='lock' />
              修改密码
            </Menu.Item>
          </Menu>
        </Grid.Column>

        <Grid.Column width={10}>
          {props.children}
        </Grid.Column>
      </Grid>
    </Container>

  </>;
}

export default ProfileLayout;
