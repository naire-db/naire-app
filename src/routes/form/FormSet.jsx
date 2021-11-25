import React, { useEffect, useState } from 'react';
import { Button, Card, Dropdown, Form, Grid, Icon, Input, Label, Menu, Message, Transition } from 'semantic-ui-react';

import AppLayout from 'layouts/AppLayout';
import api from 'api';

import './form.css';

function formatTimestamp(ts) {
  const dt = new Date(ts * 1000);
  return dt.toLocaleString();
}

function getFormUrl(fid) {
  return window.location.origin + '/f/' + fid;
}

function FormSet() {
  const [forms, setForms] = useState([]);
  const [sharingFid, setSharingFid] = useState(null);
  const [sharingSuccessToken, setSharingSuccessToken] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await api.form.get_all();
      setForms(res.data);
    })();
  }, []);

  function share(form) {
    const fid = form.id;
    window.sharingUrl = getFormUrl(fid);
    window.sharingFormTitle = form.title;
    setSharingFid(fid);  // TODO: clear this when navigated to another page
  }

  async function copy() {
    const tk = Math.random();
    setSharingSuccessToken(tk);
    setTimeout(() => {
      setSharingSuccessToken(tk_cur => (tk === tk_cur ? null : tk_cur));
    }, 1000);
    await navigator.clipboard.writeText(window.sharingUrl);
  }

  function open(form) {
    window.location = getFormUrl(form.id);
  }

  const sharingMessageRow = (
    <Transition visible={sharingFid !== null} animation='fade' duration={80}>
      <Grid.Row>
        <Grid.Column>
          {
            sharingFid !== null ?
              <Message success>
                <Message.Header>{'分享问卷：' + window.sharingFormTitle}</Message.Header>
                <Form className='share-link-form'>
                  <Form.Field inline>
                    <label>问卷地址：</label>
                    <Input
                      className='share-link-input'
                      size='small'
                      value={window.sharingUrl}
                    />
                    <Button
                      className='share-link-btn'
                      positive={sharingSuccessToken !== null}
                      icon labelPosition='left' size='small'
                      onClick={copy}
                    >
                      <Icon name={sharingSuccessToken === null ? 'copy' : 'checkmark'} />
                      复制
                    </Button>
                  </Form.Field>
                </Form>
              </Message> : <></>
          }
        </Grid.Column>
      </Grid.Row>
    </Transition>
  );

  const cards = forms.map(form =>
    <Card
      href={'/form/' + form.id}
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
                  icon='share alternate' text='分享'
                  onClick={() => share(form)}
                />
                <Dropdown.Item
                  icon='fire' text='打开'
                  onClick={() => open(form)}
                />
                <Dropdown.Item icon='i cursor' text='重命名' />
                <Dropdown.Item icon='edit' text='编辑' />
                <Dropdown.Item icon='copy' text='复制' />
                <Dropdown.Item icon='folder' text='移动' />
                <Dropdown.Item className='ui negative' icon='delete' text='删除' />
              </Dropdown.Menu>
            </Dropdown>
          </Grid.Column>
        </Grid>
      </Card.Content>
    </Card>
  );

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
                  <Menu pagination>
                    <Menu.Item as='a' icon>
                      <Icon name='chevron left' />
                    </Menu.Item>
                    <Menu.Item as='a'><code>{'TODO: pagination'}</code></Menu.Item>
                    <Menu.Item as='a'>2</Menu.Item>
                    <Menu.Item as='a'>3</Menu.Item>
                    <Menu.Item as='a'>4</Menu.Item>
                    <Menu.Item as='a' icon>
                      <Icon name='chevron right' />
                    </Menu.Item>
                  </Menu>
                  <Button
                    primary size='large' floated='right'
                    href='/form/create'
                  >
                    创建问卷
                  </Button>
                </Grid.Column>
              </Grid.Row>
              {sharingMessageRow}
              <Grid.Row>
                <Grid.Column>
                  <Card.Group itemsPerRow={3}>
                    {cards}
                  </Card.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </AppLayout>
  );
}

export default FormSet;
