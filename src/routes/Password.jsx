import React, {useRef, useState} from 'react';
import {Button, Container, Grid, Header, Icon, Input, Menu, Ref} from 'semantic-ui-react';

import appState from '../appState';
import AppLayout from 'layouts/AppLayout';

function Profile() {
  function onSubmit() {

  }

  const currentInfo = appState.user_info;

  const refOld = useRef<HTMLInputElement>('');
  const refNew = useRef<HTMLInputElement>('');
  const refAgain = useRef<HTMLInputElement>('');

  return (
    <AppLayout>
      <Container text style={{marginTop : '7em'}}>
        <Grid>
          <Grid.Column width={6}>
            <Menu secondary vertical>
              <Menu.Item href='../profile'>
                <Icon name='user' />
                个人信息
              </Menu.Item>
              <Menu.Item active={true} href='../password'>
                <Icon name='lock' />
                修改密码
              </Menu.Item>
            </Menu>
          </Grid.Column>

          <Grid.Column width={10}>
            <Header size='tiny' content={'当前密码'} />
            <Ref innerRef={refOld}>
              <Input
                fluid value={''}
              />
            </Ref>

            <Header size='tiny' content={'新密码'} />
            <Ref innerRef={refNew}>
              <Input
                fluid value={''}
              />
            </Ref>

            <Header size='tiny' content={'确认新密码'} />
            <Ref innerRef={refAgain}>
              <Input
                fluid value={''}
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
