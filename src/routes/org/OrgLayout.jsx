import React from 'react';
import { Grid, Header, Icon, Menu } from 'semantic-ui-react';

import AppLayout from 'layouts/AppLayout';

function OrgLayout(props) {
  const {oid, title} = props;

  return (
    <AppLayout offset>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <Header>
              {title}
            </Header>
            <Menu secondary vertical fluid>
              <Menu.Item active={props.offset === 'members'} href={'/org/' + oid + '/members'}>
                <Icon name='user' />
                成员管理
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

export default OrgLayout;
