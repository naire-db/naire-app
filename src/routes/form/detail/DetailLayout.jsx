import React from 'react';
import { Grid, Header, Icon, Menu } from 'semantic-ui-react';

import AppLayout from 'layouts/AppLayout';
import { onEditForm } from '../common';

function DetailLayout(props) {
  const {offset, fid, respCount, form} = props;
  const {title, published} = form;

  const editWarn = published || respCount;
  const statsDisabled = !respCount;

  async function edit() {
    const url = '/form/' + fid + '/edit';
    await onEditForm(url, editWarn);
  }

  return (
    <AppLayout offset>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={3} className='no-print'>
            <Header>
              {title}
            </Header>
            <Menu secondary vertical fluid>
              <Menu.Item active={offset === 'resps'} href={'/form/' + fid + '/resps'}>
                <Icon name='database' />
                浏览答卷
              </Menu.Item>
              <Menu.Item
                active={offset === 'stats'}
                href={statsDisabled ? undefined : '/form/' + fid + '/stats'}
                disabled={statsDisabled}
              >
                <Icon name='chart pie' />
                数据统计
              </Menu.Item>
              <Menu.Item active={offset === 'settings'} href={'/form/' + fid + '/settings'}>
                <Icon name='settings' />
                权限控制
              </Menu.Item>
              <Menu.Item active={offset === 'tmpl'} href={'/form/' + fid + '/tmpl'}>
                <Icon name='theme' />
                模板和导出
              </Menu.Item>
              <Menu.Item
                onClick={edit}
              >
                <Icon name='edit' />
                编辑问卷
              </Menu.Item>
            </Menu>
          </Grid.Column>
          <Grid.Column width={13} className='detail-content'>
            {props.children}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </AppLayout>
  );
}

export default DetailLayout;
