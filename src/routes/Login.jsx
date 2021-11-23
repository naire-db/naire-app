import React, { useState } from 'react';
import { Grid, Header, Form, Segment, Button, Message } from "semantic-ui-react";

import AppLayout from 'layouts/AppLayout';
import api from 'api';

function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorPrompt, setErrorPrompt] = useState(null);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  async function onLogin() {
    const ok = usernameOrEmail && password;
    setUsernameError(!usernameOrEmail);
    setPasswordError(!password);
    if (!ok)
      return;
    let res;
    try {
      res = await api.login(usernameOrEmail, password);
    } catch (e) {
      return setErrorPrompt(e.toString());
    }
    if (res.code === 0) {
      const user = res.data;
      localStorage.setItem('user_info', JSON.stringify(user));
      window.location = '/';
      // TODO: redirect to url in the query param if existing
    } else
      setErrorPrompt('用户名或密码错误');
  }

  function onUsernameChanged(e) {
    const v = e.target.value;
    if (/^[0-9a-zA-Z_.\-@]*$/.test(v))
      setUsernameOrEmail(v);
  }

  console.log(usernameOrEmail, password, errorPrompt);

  return (
    <AppLayout>
      <Grid centered style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' className='text-center'>
            登录
          </Header>
          <Form size='large' error={errorPrompt !== null}>
            <Segment>
              <Form.Input
                fluid icon='user' iconPosition='left' placeholder='用户名或邮箱'
                error={usernameError}
                value={usernameOrEmail}
                onChange={onUsernameChanged}
              />
              <Form.Input
                fluid icon='lock' iconPosition='left' placeholder='密码' type='password'
                error={passwordError}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Message error header='登录失败' content={errorPrompt} />
              <Button
                primary fluid size='large'
                onClick={onLogin}
              >
                登录
              </Button>
            </Segment>
          </Form>
          <Message className='text-center'>
            新用户？ <a href='/register'>注册</a>
          </Message>
        </Grid.Column>
      </Grid>
    </AppLayout>
  );
}

export default Login;
