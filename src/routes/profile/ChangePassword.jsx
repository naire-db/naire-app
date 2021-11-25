import React, { useState } from 'react';
import { Checkbox, Form, Message } from 'semantic-ui-react';

import api from 'api';
import { checkPassword, useField } from 'utils';
import ProfileLayout from '../../layouts/ProfileLayout';

function ChangePassword() {
  const [checked, setChecked] = useState(false);
  const [errorPrompt, setErrorPrompt] = useState(null);
  const [repeatedPassword, setRepeatedPassword] = useState('');

  const passwordField = useField(checkPassword);
  const newPasswordField = useField(checkPassword);

  const repeatedMisMatchError = newPasswordField.value !== repeatedPassword;

  async function onSubmit() {
    if (!passwordField.validate())
      return;

    let res;
    try {
      res = await api.user.change_password(passwordField.value, newPasswordField.value);
    } catch (e) {
      return setErrorPrompt(e.toString());
    }
    if (res.code === 0)
      window.location = '/login';
    else if (res.code === api.ERR_FAILURE)
      setErrorPrompt('当前密码输入错误');
    else
      setErrorPrompt(res.code);
  }

  let toggle = () => setChecked(!checked);

  return (
    <ProfileLayout page={'password'}>
      <Form>
        <Form.Input
          label={'当前密码'}
          type={'password'}
          onChange={passwordField.handler}
        />
        <Form.Input
          label={'新密码'}
          type={'password'}
          onChange={newPasswordField.handler}
        />
        <Form.Input
          label={'确认新密码'}
          error={repeatedMisMatchError}
          onChange={e => setRepeatedPassword(e.target.value)}
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
          onClick={onSubmit}
          disabled={repeatedMisMatchError}
        >
          确认修改
        </Form.Button>
      </Form>
    </ProfileLayout>
  );
}

export default ChangePassword;
