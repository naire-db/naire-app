import React from 'react';
import { Grid, Icon, Menu } from 'semantic-ui-react';

import AppLayout from './AppLayout';

import './profile.css';

function ProfileLayout(props) {
  return (
    <AppLayout offset>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={3}>
            <Menu secondary vertical fluid>
              <Menu.Item active={props.page === 'profile'} href='/user/profile'>
                <Icon name='user' />
                个人资料
              </Menu.Item>
              <Menu.Item active={props.page === 'password'} href='/user/password'>
                <Icon name='lock' />
                修改密码
              </Menu.Item>
              <Menu.Item active={props.page === 'orgs'} href='/user/orgs'>
                <Icon name='group' />
                我的组织
              </Menu.Item>
              <Menu.Item active={props.page === 'logs'} href='/user/logs'>
                <Icon name='history' />
                操作日志
              </Menu.Item>
            </Menu>
          </Grid.Column>
          <Grid.Column width={13}>
            {props.children}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </AppLayout>
  );
}

export default ProfileLayout;
