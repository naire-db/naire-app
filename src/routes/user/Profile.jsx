import React, { useState } from 'react';
import { Form, Message } from 'semantic-ui-react';

import api from 'api';
import appState from 'appState';
import ProfileLayout from 'layouts/ProfileLayout';
import { checkDname, checkEmail, useField, validateFields } from 'utils/fieldHook';

function Profile() {
  const currentInfo = appState.user_info;

  const emailField = useField(checkEmail, currentInfo.email);
  const dnameField = useField(checkDname, currentInfo.dname);

  const [errorPrompt, setErrorPrompt] = useState(null);

  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!validateFields(emailField, dnameField))
      return;
    setLoading(true);
    let res;
    try {
      res = await api.user.save_profile(emailField.value, dnameField.value);
    } catch (e) {
      return setErrorPrompt(e.toString());
    }
    if (res.code === 0) {
      localStorage.setItem('user_info', JSON.stringify(res.data));
      window.location.reload();
    } else if (res.code === api.ERR_DUPL_EMAIL)
      setErrorPrompt('该邮箱已注册');
    else
      setErrorPrompt(res.code);
    setLoading(false);
  }

  return (
    <ProfileLayout page='profile'>
      <Form error={errorPrompt !== null}>
        <Form.Input
          label='用户名'
          value={currentInfo.username}
        />
        <Form.Input
          label='邮箱'
          {...emailField.toProps()}
        />
        <Form.Input
          label='显示名称'
          {...dnameField.toProps()}
        />
        <Message error header='保存失败' content={errorPrompt} />
        <Form.Button
          primary
          className='profile-submit'
          onClick={onSubmit}
          disabled={
            !(emailField.visuallyValid() && dnameField.visuallyValid()) ||
            (currentInfo.email === emailField.value && currentInfo.dname === dnameField.value) ||
            loading
          }
          loading={loading}
        >
          保存
        </Form.Button>
      </Form>
    </ProfileLayout>
  );
}

export default Profile;
