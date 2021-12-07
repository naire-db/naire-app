import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form, Grid } from 'semantic-ui-react';

import api, { api_unwrap_fut } from 'api';
import CopyButton from 'components/CopyButton';
import { useAsyncResult } from 'utils';
import { checkDname, useField } from 'utils/fieldHook';
import { get_invite_url, with_origin } from 'utils/url';
import { closeModal, showModal } from 'utils/modal';

import { ORG_NAME_MAX_LENGTH, ROLE_OWNER } from './config';
import OrgLayout from './OrgLayout';

function OrgProfile() {
  const oid = parseInt(useParams().oid, 10);
  const nameField = useField(checkDname);
  const [inviteToken, setInviteToken] = useState(null);
  const res = useAsyncResult(async () => {
    const res = await api_unwrap_fut(api.org.get_profile(oid));
    nameField.set(res.name);
    setInviteToken(res.invite_token);
    return res;
  });

  if (res === null)
    return null;

  const {name: oldName, member_count} = res;
  const invite_url = with_origin(get_invite_url(inviteToken));

  const nameValue = nameField.value.trim();

  async function refreshInviteToken() {
    await showModal({
      title: '重置邀请链接',
      description: '现有的邀请链接将失效。',
      confirmText: '重置',
      confirmNav: true,
      confirmProps: {
        negative: true
      },
      onConfirmed() {
        api_unwrap_fut(api.org.refresh_invite_token(oid)).then(setInviteToken);
        closeModal();
      }
    });
  }

  async function save() {
    await api_unwrap_fut(api.org.rename(oid, nameValue));
    window.location.reload();
  }

  async function dissolve() {
    await showModal({
      title: '解散组织',
      description: '全部 ' + member_count + ' 位成员将离开组织。',
      // TODO: 显示将被删除的问卷数量
      confirmText: '解散',
      confirmNav: true,
      confirmProps: {
        negative: true
      },
      async onConfirmed() {
        await api_unwrap_fut(api.org.dissolve(oid));
        window.location = '/user/orgs';
      }
    });
  }

  return (
    <OrgLayout offset='profile' oid={oid} org={res} role={ROLE_OWNER}>
      <Form>
        <Form.Input
          label='组织名称'
          maxLength={ORG_NAME_MAX_LENGTH}
          {...nameField.toProps()}
        />
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Form.Input
                label='邀请链接'
                value={invite_url}
              />
            </Grid.Column>
            <Grid.Column width={8} verticalAlign='bottom'>
              <CopyButton
                content={invite_url}
                btnProps={{
                  className: 'left-btn',
                  style: {
                    marginBottom: 3
                  },
                }}
              />
              <Button
                primary icon='redo' labelPosition='left' size='small'
                content='重置'
                onClick={refreshInviteToken}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Form.Group inline>
          <Form.Button
            className='form-submit-btn'
            primary size='small'
            content='保存'
            disabled={!nameField.visuallyValid() || nameValue === oldName}
            onClick={save}
          />
          <Form.Button
            className='form-submit-btn'
            primary size='small'
            negative
            content='解散'
            onClick={dissolve}
          />
        </Form.Group>
      </Form>
    </OrgLayout>
  );
}

export default OrgProfile;
