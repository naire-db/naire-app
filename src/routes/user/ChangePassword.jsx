import React, { useState } from 'react';
import { Button, Checkbox, Form, Message } from 'semantic-ui-react';

import api from 'api';
import { checkPassword, useField } from 'utils/fieldHook';
import ProfileLayout from 'layouts/ProfileLayout';

function ChangePassword() {
  const [checked, setChecked] = useState(false);
  const [errorPrompt, setErrorPrompt] = useState(null);
  const [repeatedPassword, setRepeatedPassword] = useState('');

  const passwordField = useField(checkPassword);
  const newPasswordField = useField(checkPassword);

  const [loading, setLoading] = useState(false);

  const repeatedMisMatchError = newPasswordField.value !== repeatedPassword;

  async function onSubmit() {
    if (!passwordField.validate())
      return;
    setLoading(true);

    let res;
    try {
      res = await api.user.change_password(passwordField.value, newPasswordField.value);
    } catch (e) {
      return setErrorPrompt(e.toString());
    }
    if (res.code === 0)
      return window.location = '/login';
    else if (res.code === api.ERR_FAILURE)
      setErrorPrompt('当前密码输入错误');
    else
      setErrorPrompt(res.code);
    setLoading(false);
  }

  let toggle = () => setChecked(v => !v);

  return (
    <ProfileLayout page={'password'}>
      <Form error={errorPrompt !== null}>
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
            label='显示新密码'
            onChange={toggle}
          />
        </Form.Field>
        <Message error header={'保存失败'} content={errorPrompt} />
        <Button
          primary
          onClick={onSubmit}
          disabled={repeatedMisMatchError || loading}
          loading={loading}
        >
          保存
        </Button>
      </Form>
    </ProfileLayout>
  );
}

export default ChangePassword;
