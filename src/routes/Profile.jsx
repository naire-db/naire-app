import React, {useRef, useState} from 'react';
import {Button, Container, Grid, Header, Icon, Input, Menu, Ref} from 'semantic-ui-react';

import appState from '../appState';
import AppLayout from 'layouts/AppLayout';

function Profile() {
  const currentInfo = appState.user_info;

  const refDName = useRef<HTMLInputElement>('');
  const refUsername = useRef<HTMLInputElement>('');
  const refMail = useRef<HTMLInputElement>('');
  const refOrganization = useRef<HTMLInputElement>('');

  const [dname, setDName] = useState(currentInfo.dname);
  const [username, setUsername] = useState(currentInfo.username);
  const [email, setEmail] = useState(currentInfo.email);
  const [organization, setOrganization] = useState(currentInfo.organization);

  const canAlter = false;

  function onSubmit() {

  }

  return (
    <AppLayout>
      <Container text style={{marginTop : '7em'}}>
        <Grid>
          <Grid.Column width={6}>
            <Menu secondary vertical>
              <Menu.Item active={true} href='../profile'>
                <Icon name='user' />
                个人信息
              </Menu.Item>
              <Menu.Item href='../password'>
                <Icon name='lock' />
                密码管理
              </Menu.Item>
            </Menu>
          </Grid.Column>

          <Grid.Column width={10}>
            <Header size='tiny' content={'显示名称'} />
            <Ref innerRef={refDName}>
              <Input
                readOnly={!canAlter}
                fluid value={dname}
                onChange={({ value }) => value.length <  setUsername(value)}
              />
            </Ref>

            <Header size='tiny' content={'用户名'} />
            <Ref innerRef={refUsername}>
              <Input
                readOnly={!canAlter}
                fluid value={username}
              />
            </Ref>

            <Header size='tiny' content={'邮箱'} />
            <Ref innerRef={refMail}>
              <Input
                readOnly={!canAlter}
                fluid value={email}
              />
            </Ref>

            <Button fluid content={'确认修改'} onClick={onSubmit}/>
          </Grid.Column>
        </Grid>
      </Container>
    </AppLayout>
  );
}

export default Profile;
