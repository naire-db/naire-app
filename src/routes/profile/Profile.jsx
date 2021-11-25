import React, { useState } from 'react';

import api from 'api';
import appState from 'appState';
import { checkDname, checkEmail, useField } from 'utils';
import ProfileLayout from 'layouts/ProfileLayout';
import { Form, Message } from 'semantic-ui-react';

function Profile() {
  const currentInfo = appState.user_info;

  const dnameField = useField(checkDname);
  const emailField = useField(checkEmail);

  const [errorPrompt, setErrorPrompt] = useState(null);

  async function onSubmit() {
    if (!emailField.validate())
      return;
    let res;
    try {
      res = await api.user.save_profile(
        emailField.value === '' ? currentInfo.email : emailField.value,
        dnameField.value === '' ? currentInfo.dname : dnameField.value);
    } catch (e) {
      return setErrorPrompt(e.toString());
    }
    if (res.code === 0)
      window.location = '/profile';
    else if (res.code === api.ERR_DUPL_EMAIL)
      setErrorPrompt('该邮箱已注册');
    else
      setErrorPrompt(res.code);
  }

  let emailError = emailField.value === '' ? false : emailField.renderError();

  return (
    <ProfileLayout page={'profile'}>
      <Form>
        <Form.Field
          label={'用户名'}
        />
        <Message>
          <p>{currentInfo.username}</p>
        </Message>
        <Form.Input
          label={'显示名称'}
          placeholder={currentInfo.dname}
          onChange={dnameField.handler}
        />
        <Form.Input
          label={'邮箱'}
          placeholder={currentInfo.email}
          onChange={emailField.handler}
          error={emailError}
        />
        <Message error header='修改失败' content={errorPrompt} />
        <Form.Button
          primary fluid
          onClick={onSubmit}
          disabled={emailError}
          className='profile-submit'
        >
          保存修改
        </Form.Button>
      </Form>
    </ProfileLayout>
  );
}

export default Profile;
