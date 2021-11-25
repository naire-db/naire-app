import React, { useState } from 'react';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';

import AppLayout from 'layouts/AppLayout';
import api from 'api';

function useField(checker) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(undefined);
  return {
    value, error,
    handler(e) {
      const v = e.target.value;
      setValue(v);
      setError(checker(v));
    },
    validate() {
      if (error === undefined) {
        setError(checker(value));
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

function checkUsername(v) {
  if (!v)
    return '用户名不能为空';
  if (!/^[0-9a-zA-Z_.\-@]*$/.test(v))
    return '用户名只能包含字母（a-z，A-Z）、数字（0-9）和下划线（_）';
  if (v.length > 140)
    return '用户名最多包含 140 个字符';
  return null;
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function checkEmail(v) {
  if (!v)
    return '';
  if (!validateEmail(v))
    return '邮箱地址格式错误';
  if (v.length > 250)
    return '邮箱地址最多包含 250 个字符';
  return null;
}

/*
function checkDname(v) {
  if (v.length > 120)
    return '显示名称最多包含 120 个字符';
  return null;
}
 */

function checkPassword(v) {
  return v ? null : '';
}

function Register() {
  const usernameField = useField(checkUsername);
  const emailField = useField(checkEmail);
  const passwordField = useField(checkPassword);

  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [errorPrompt, setErrorPrompt] = useState(null);

  const repeatedPasswordError = passwordField.value !== repeatedPassword;

  async function onSubmit() {
    let ok = usernameField.validate();
    ok = emailField.validate() && ok;
    ok = passwordField.validate() && ok;
    if (!ok || repeatedPasswordError)
      return;

    let res;
    try {
      res = await api.register(usernameField.value, emailField.value, passwordField.value, usernameField.value);
    } catch (e) {
      return setErrorPrompt(e.toString());
    }
    if (res.code === 0)
      window.location = '/login';
    else if (res.code === api.ERR_DUPL_USERNAME)
      setErrorPrompt('该用户名已注册');
    else if (res.code === api.ERR_DUPL_EMAIL)
      setErrorPrompt('该邮箱已注册');
    else
      setErrorPrompt(res.code);
  }

  return (
    <AppLayout>
      <Grid centered style={{height: '100vh'}} verticalAlign='middle'>
        <Grid.Column style={{maxWidth: 450}}>
          <Header as='h2' className='text-center'>
            注册
          </Header>
          <Form size='large' error={errorPrompt !== null}>
            <Segment>
              <Form.Input
                fluid icon='user' iconPosition='left' placeholder='用户名' required
                error={usernameField.renderError()}
                value={usernameField.value}
                onChange={usernameField.handler}
              />
              <Form.Input
                fluid icon='lock' iconPosition='left' placeholder='密码' type='password' required
                error={passwordField.renderError()}
                value={passwordField.value}
                onChange={passwordField.handler}
              />
              <Form.Input
                fluid icon='lock' iconPosition='left' placeholder='确认密码' type='password' required
                error={repeatedPasswordError}
                value={repeatedPassword}
                onChange={e => setRepeatedPassword(e.target.value)}
              />
              <Form.Input
                fluid icon='mail' iconPosition='left' placeholder='邮箱' required
                error={emailField.renderError()}
                value={emailField.value}
                onChange={emailField.handler}
              />
              <Message error header='注册失败' content={errorPrompt} />
              <Button
                primary fluid size='large'
                onClick={onSubmit}
              >
                注册
              </Button>
            </Segment>
          </Form>
          <Message className='text-center'>
            已经注册？ <a href='/login'>登录</a>
          </Message>
        </Grid.Column>
      </Grid>
    </AppLayout>
  );
}

export default Register;
