import React, { useState } from 'react';
import {Checkbox, Container, Form, Grid, Icon, Menu, Message} from 'semantic-ui-react';

import api from "../api";
import AppLayout from 'layouts/AppLayout';

function checkPassword(v) {
  return v ? null : '';
}

function usePasswordField() {
  const [value, setValue] = useState('');
  const [error, setError] = useState(undefined);
  return {
    value,
    error,
    handler(e) {
      const v = e.target.value;
      setValue(v);
      setError(checkPassword(v));
    },
    validate() {
      if (error === undefined) {
        setError(checkPassword(value));
        return false;
      }
      return error === null;
    },
    renderError() {
      if (error === null || error === undefined)
        return null;
      if (!error)
        return true;
      return {
        'content': error,
        'position': 'bottom'
      };
    }
  };
}

function Profile() {
  const [checked, setChecked] = useState(false);

  const passwordField = usePasswordField();

  const [errorPrompt, setErrorPrompt] = useState(null);

  async function onSubmit() {
    let ok = passwordField.validate();
    if (!ok)
      return;

    let res;
    try {
      res = await api.register()
    } catch (e) {
      return setErrorPrompt(e.toString());
    }
    if (res.code === 0)
      window.location = '/password';
    else if (res.code === api.ERR_PASSWORD_RESET_INCORRECT)
      setErrorPrompt('当前密码输入错误')
    else if (res.code === api.ERR_PASSWORD_RESET_MISMATCH)
      setErrorPrompt('新密码两次输入不一致')
    else
      setErrorPrompt(res.code);
  }

  let toggle = () => setChecked(!checked);

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
            <Form>
              <Form.Input
                label={'当前密码'}
                type={'password'}
                error={passwordField.renderError()}
                onChange={passwordField.handler}
              />
              <Form.Input
                label={'新密码'}
                type={'password'}
                error={passwordField.renderError()}
                onChange={passwordField.handler}
              />
              <Form.Input
                label={'确认新密码'}
                error={passwordField.renderError()}
                onChange={passwordField.handler}
                type={checked ? 'text' : 'password'}
              />
              <Form.Field>
                <Checkbox
                  slider
                  label='显示新密码'
                  onChange={toggle}
                />
              </Form.Field>
              <Message error header={'修改失败'} content={errorPrompt} />
              <Form.Button
                fluid
                onClick={onSubmit}>
                确认修改
              </Form.Button>
            </Form>
          </Grid.Column>
        </Grid>
      </Container>
    </AppLayout>
  );
}

export default Profile;
