import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, Header, Message } from 'semantic-ui-react';

import api from 'api';
import appState from 'appState';
import { useAsyncResult } from 'utils';
import { redirect_login } from 'utils/url';
import AppLayout from 'layouts/AppLayout';

function OrgInvitation() {
  const token = useParams().token;
  const res = useAsyncResult(async () => {
    const resp = await api.org.check_invite_token(token);
    if (resp.code === 0)
      return resp.data;
    return 0;
  });

  if (res === null)
    return null;

  if (res === 0)
    return (
      <AppLayout offset>
        <Message
          warning
          icon='warning circle'
          header='该组织邀请已失效或不存在。'
        />
      </AppLayout>
    );

  const {org, joined} = res;
  const {name, member_count, id: oid} = org;

  async function join() {
    if (appState.user_info) {
      const resp = await api.org.accept_invite(token, oid);
      if (resp.code === 0)
        window.location = '/user/orgs';
      else
        window.location.reload();
    } else
      redirect_login();
  }

  return (
    <AppLayout offset text>
      <Header
        content='组织邀请'
      />
      <Message
        icon='user plus'
        header={name}
        content={`${member_count} 位成员`}
      />
      <div
        style={{
          textAlign: 'center'
        }}
      >
        <Button
          disabled={joined}
          primary
          content={joined ? '已加入' : '加入该组织'}
          onClick={join}
        />
      </div>
    </AppLayout>
  );
}

export default OrgInvitation;
