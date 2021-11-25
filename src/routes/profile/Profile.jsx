import React, { useState } from 'react';

import api from 'api';
import appState from 'appState';
import { checkDname, checkEmail, useField } from 'utils';
import ProfileLayout from 'layouts/ProfileLayout';
import { Form, Message } from 'semantic-ui-react';

function Profile() {
  const currentInfo = appState.user_info;

  const emailField = useField(checkEmail, currentInfo.email);
  const dnameField = useField(checkDname, currentInfo.dname);

  const [errorPrompt, setErrorPrompt] = useState(null);

  async function onSubmit() {
    if (!emailField.validate())
      return;
    let res;
    try {
      res = await api.user.save_profile(emailField.value, dnameField.value);
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
          label={'邮箱'}
          {...emailField.toProps()}
        />
        <Form.Input
          label={'显示名称'}
          {...dnameField.toProps()}
        />
        <Message error header='修改失败' content={errorPrompt} />
        <Form.Button
          primary fluid
          onClick={onSubmit}
          disabled={!(emailField.visuallyValid() && dnameField.visuallyValid()) ||
          (currentInfo.email === emailField.value && currentInfo.dname === dnameField.value)}
          className='profile-submit'
        >
          保存修改
        </Form.Button>
      </Form>
    </ProfileLayout>
  );
}

export default Profile;
