import React, { useState } from 'react';
import { Button, Card, Dropdown, Grid, Label, Menu, Segment } from 'semantic-ui-react';

import api, { api_unwrap } from 'api';
import AppLayout from 'layouts/AppLayout';
import { ModalTransition } from 'components/transitedModal';
import { useAsyncResult } from 'utils';
import { usePagination } from 'utils/paginate';

import ShareRow from './ShareRow';
import RetitleModal from './RetitleModal';
import RemoveModal from './RemoveModal';

import './form-set.css';

function formatTimestamp(ts) {
  const dt = new Date(ts * 1000);
  return dt.toLocaleString();
}

function getFormUrl(fid) {
  return window.location.origin + '/f/' + fid;
}

function getFormDetailUrl(fid) {
  return window.location.origin + '/form/' + fid + '/resps';
}

const formMap = new Map();

function FormSet() {
  const [sharingFid, setSharingFid] = useState(null);

  const [retitlingFid, setRetitlingFid] = useState(null);
  const [removingFid, setRemovingFid] = useState(null);

  const forms = useAsyncResult(async () => {
    const forms = api_unwrap(await api.form.get_all());
    formMap.clear();
    for (const form of forms)
      formMap.set(form.id, form);
    return forms;
  });

  const {activeItems, menu} = usePagination(forms, {
    maxPageSize: 15
  });

  if (forms === null)
    return null;

  function share(form) {
    const fid = form.id;
    window.sharingUrl = getFormUrl(fid);
    window.sharingFormTitle = form.title;
    setSharingFid(fid);  // TODO: clear this when navigated to another page
  }

  function open(form) {
    window.location = getFormUrl(form.id);
  }

  function detail(form) {
    window.location = getFormDetailUrl(form.id);
  }

  const content = forms.length ? (
    <Card.Group itemsPerRow={3}>
      {activeItems.map(form => (
        <Card
          href={getFormDetailUrl(form.id)}
          key={form.id}
        >
          <Card.Content header={form.title} meta={
            '创建于 ' + formatTimestamp(form.ctime)
          } />
          <Card.Content extra>
            <Grid>
              <Grid.Column width={12} verticalAlign='middle'>
                {form.resp_count + ' 份答卷'}
              </Grid.Column>
              <Grid.Column width={4} verticalAlign='middle' floated='right'>
                <Dropdown
                  className='form-card-dropdown icon'
                  icon='ellipsis vertical'
                  basic button size='mini' simple
                  onClick={e => e.preventDefault()}
                >
                  <Dropdown.Menu>
                    <Dropdown.Item
                      icon='setting' text='打开'
                      onClick={() => detail(form)}
                    />
                    <Dropdown.Item
                      icon='share alternate' text='分享'
                      onClick={() => share(form)}
                    />
                    <Dropdown.Item
                      icon='fire' text='作答'
                      onClick={() => open(form)}
                    />
                    <Dropdown.Item
                      icon='i cursor' text='重命名'
                      onClick={() => setRetitlingFid(form.id)}
                    />
                    <Dropdown.Item
                      icon='edit' text='编辑'
                    />
                    <Dropdown.Item icon='copy' text='复制' />
                    <Dropdown.Item icon='folder' text='移动' />
                    <Dropdown.Item
                      className='ui negative' icon='delete' text='删除'
                      onClick={() => setRemovingFid(form.id)}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </Grid.Column>
            </Grid>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  ) : (
    <Segment>暂无问卷</Segment>
  );

  // FIXME: transition not working
  function buildModal(E, fid, setFid) {
    return (
      <ModalTransition open={fid !== null}>
        <E fid={fid} form={formMap.get(fid)} onClosed={() => setFid(null)} />
      </ModalTransition>
    );
  }

  const modals = <>
    {buildModal(RetitleModal, retitlingFid, setRetitlingFid)}
    {buildModal(RemoveModal, removingFid, setRemovingFid)}
  </>;

  return (
    <AppLayout offset>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <Menu vertical pointing>
              <Menu.Item active>
                <Label>1</Label>
                <code>{'TODO: folders'}</code>
              </Menu.Item>
              <Menu.Item>
                <Label>51</Label>
                Folder 2
              </Menu.Item>
              <Menu.Item>
                <Label>1</Label>
                Folder 3
              </Menu.Item>
            </Menu>
          </Grid.Column>
          <Grid.Column width={1} />
          <Grid.Column width={12}>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  {menu}
                  <Button
                    primary size='large' floated={menu ? 'right' : undefined}
                    href='/form/create'
                  >
                    创建问卷
                  </Button>
                </Grid.Column>
              </Grid.Row>
              <ShareRow
                fid={sharingFid}
              />
              <Grid.Row>
                <Grid.Column>
                  {content}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {modals}
    </AppLayout>
  );
}

export default FormSet;
