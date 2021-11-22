import React from 'react';
import { Container, Icon, Menu } from 'semantic-ui-react';

function Nav() {
  return (
    <Menu fixed='top'>
      <Container>
        <Menu.Item header href='/'>
          <Icon name='fire' size='large' />
          Naire
        </Menu.Item>
        <Menu.Item href='/demo'>
          Demo
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item href='/login'>
            登录
          </Menu.Item>
        </Menu.Menu>
      </Container>
    </Menu>
  );
}

export default Nav;
