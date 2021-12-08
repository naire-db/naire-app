import React from 'react';
import { Container, Dropdown, Icon, Menu } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

import appState from 'appState';
import api from 'api';

const Nav = observer(() => {
  console.log('Rendering nav');

  async function onLogout() {
    await api.logout();
    localStorage.removeItem('user_info');
    window.location = '/';
  }

  const info = appState.user_info;

  return (
    <Menu fixed='top' className='no-print' inverted>
      <Container>
        <Menu.Item header href='/'>
          <Icon name='fire' size='large' />
          naire
        </Menu.Item>
        {
          info ?
            <Menu.Item href='/form/all'>
              我的问卷
            </Menu.Item> : null
        }
        <Menu.Item href='/tmpl/all'>
          模板列表
        </Menu.Item>
        <Menu.Menu position='right'>
          {
            info ?
              <Dropdown simple item text={info.dname ? info.dname : info.username}>
                <Dropdown.Menu>
                  <Dropdown.Item as='a' href='/user/profile'>个人资料</Dropdown.Item>
                  <Dropdown.Item as='a' href='/user/orgs'>我的组织</Dropdown.Item>
                  <Dropdown.Item onClick={onLogout}>注销</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown> :
              <Menu.Item href='/login'>
                登录
              </Menu.Item>
          }
        </Menu.Menu>
      </Container>
    </Menu>
  );
});

export default Nav;
