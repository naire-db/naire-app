import React, { useState } from 'react';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';

import api from 'api';
import { get_query_param } from 'utils/url';
import AppLayout from 'layouts/AppLayout';

function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorPrompt, setErrorPrompt] = useState(null);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [loading, setLoading] = useState(false);

  async function onLogin() {
    const usernameOk = usernameOrEmail && /^[0-9a-zA-Z_.\-@]*$/.test(usernameOrEmail);
    const ok = usernameOk && password;
    setUsernameError(!usernameOk);
    setPasswordError(!password);
    if (!ok)
      return;
    setLoading(true);
    let res;
    try {
      res = await api.login(usernameOrEmail, password);
    } catch (e) {
      return setErrorPrompt(e.toString());
    }
    if (res.code === 0) {
      const user = res.data;
      localStorage.setItem('user_info', JSON.stringify(user));
      const target = get_query_param('r');
      return window.location = target || '/';
    }
    setErrorPrompt('用户名或密码错误');
    setLoading(false);
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
                maxLength={50}
              />
              <Form.Input
                fluid icon='lock' iconPosition='left' placeholder='密码' type='password'
                error={passwordError}
                value={password}
                onChange={e => setPassword(e.target.value)}
                maxLength={500}
              />
              <Message error header='登录失败' content={errorPrompt} />
              <Button
                primary fluid size='large'
                onClick={onLogin}
                loading={loading}
                disabled={loading}
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
