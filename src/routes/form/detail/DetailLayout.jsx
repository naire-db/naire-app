import React from 'react';
import { Grid, Header, Icon, Menu } from 'semantic-ui-react';

import AppLayout from 'layouts/AppLayout';

function DetailLayout(props) {
  const {offset, fid} = props;
  return (
    <AppLayout offset>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <Header>
              {props.title}
            </Header>
            <Menu secondary vertical fluid>
              <Menu.Item active={offset === 'resps'} href={'/form/' + fid + '/resps'}>
                <Icon name='database' />
                浏览答卷
              </Menu.Item>
              <Menu.Item active={offset === 'stats'} href={'/form/' + fid + '/stats'}>
                <Icon name='chart pie' />
                数据统计
              </Menu.Item>
              <Menu.Item active={offset === 'settings'} href={'/form/' + fid + '/settings'}>
                <Icon name='settings' />
                问卷设置
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

export default DetailLayout;
