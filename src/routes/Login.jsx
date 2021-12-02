import React, { useState } from 'react';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';

import AppLayout from 'layouts/AppLayout';
import api from 'api';

function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorPrompt, setErrorPrompt] = useState(null);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  async function onLogin() {
    const usernameOk = usernameOrEmail && /^[0-9a-zA-Z_.\-@]*$/.test(usernameOrEmail);
    const ok = usernameOk && password;
    setUsernameError(!usernameOk);
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
      const qs = window.location.search;
      if (qs.startsWith('?r='))
        window.location = qs.slice(3);
      else
        window.location = '/';
    } else
      setErrorPrompt('用户名或密码错误');
  }

  console.log(usernameOrEmail, password, errorPrompt);

  return (
    <AppLayout>
      <Grid centered style={{height: '100vh'}} verticalAlign='middle'>
        <Grid.Column style={{maxWidth: 450}}>
          <Header as='h2' className='text-center'>
            登录
          </Header>
          <Form size='large' error={errorPrompt !== null}>
            <Segment>
              <Form.Input
                fluid icon='user' iconPosition='left' placeholder='用户名或邮箱'
                error={usernameError}
                value={usernameOrEmail}
                onChange={e => setUsernameOrEmail(e.target.value)}
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
            新用户？ <a href={'/register' + window.location.search}>注册</a>
            {/* TODO: 1) pass redirection qs down; 2) try an icon? */}
          </Message>
        </Grid.Column>
      </Grid>
    </AppLayout>
  );
}

export default Login;
