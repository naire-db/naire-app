import React from 'react';
import { Grid, Header, Icon, Menu } from 'semantic-ui-react';

import AppLayout from 'layouts/AppLayout';
import { ROLE_OWNER } from './config';

function OrgLayout(props) {
  const {oid} = props;
  const {name} = props.org;
  const role = props.role === undefined ? props.org.role : props.role;

  return (
    <AppLayout offset>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <Header>
              {name}
            </Header>
            <Menu secondary vertical fluid>
              <Menu.Item active={props.offset === 'members'} href={'/org/' + oid + '/members'}>
                <Icon name='user' />
                成员管理
              </Menu.Item>
              {role >= ROLE_OWNER &&
                <Menu.Item active={props.offset === 'profile'} href={'/org/' + oid + '/profile'}>
                  <Icon name='setting' />
                  组织设置
                </Menu.Item>
              }
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

export default OrgLayout;
