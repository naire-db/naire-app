import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form, Grid, Message, Table } from 'semantic-ui-react';

import api, { api_unwrap_fut } from 'api';
import appState from 'appState';
import { useAsyncResult } from 'utils';
import { formatUser } from 'utils/render';

import { formatRole, renderRoleLabel } from './utils';
import OrgLayout from './OrgLayout';
import { showModal } from '../../utils/modal';
import { ROLE_DESCRIPTIONS, ROLE_OPTIONS, ROLE_OWNER } from './config';

function OrgMembers() {
  const oid = parseInt(useParams().oid, 10);
  const res = useAsyncResult(() => api_unwrap_fut(api.org.get_members(oid)));
  if (res === null)
    return null;

  const {members: users, role} = res;

  async function remove(member) {
    await showModal({
      title: '移除用户',
      description: '将移除' + formatRole(member.role) + ' ' + formatUser(member) + '。',
      confirmText: '移除',
      confirmProps: {
        negative: true
      },
      async onConfirmed() {
        await api_unwrap_fut(api.org.remove_member(member.id, oid));
        window.location.reload();
      }
    });
  }

  async function change_role(member) {
    await showModal({
      title: '变更用户权限',
      confirmText: '保存',
      size: 'small',
      content: s => {
        return <>
          <Form>
            <Form.Dropdown
              label={'将' + formatRole(member.role) + ' ' + formatUser(member) + ' 的权限变更为'}
              defaultValue={member.role}
              compact
              selection
              options={ROLE_OPTIONS}
              onChange={(e, d) => {
                s.value = d.value;
              }}
            />
          </Form>
          <Message>
            {ROLE_DESCRIPTIONS[s.value]}
          </Message>
        </>;
      },
      async onConfirmed(s) {
        await api_unwrap_fut(api.org.change_role(s.value, member.id, oid));
        window.location.reload();
      },
      initialState: {
        value: member.role
      },
      confirmProps: s => ({
        disabled: s.value === member.role
      })
    });
  }

  return (
    <OrgLayout offset='members' oid={oid} org={res}>
      <Grid>
        {role > 0 &&
          <Grid.Row style={{
            paddingBottom: 0,
            marginBottom: -5
          }}>
            <Grid.Column verticalAlign='middle'>
              <Button
                size='small'
                primary
                content='邀请用户'
                floated='right'
                href={'/org/' + oid + '/profile'}
              />
            </Grid.Column>
          </Grid.Row>
        }
        <Grid.Row>
          <Grid.Column>
            <Table size='large' basic>
              <Table.Body>
                {users.map(u => (
                  <Table.Row key={u.id}>
                    <Table.Cell width={4}>
                      {formatUser(u)}
                      {renderRoleLabel(u.role)}
                    </Table.Cell>
                    <Table.Cell width={5}>
                      {u.email}
                    </Table.Cell>
                    <Table.Cell width={7}>
                      {role >= ROLE_OWNER && u.id !== appState.user_info.id && <>
                        <Button
                          icon='user times'
                          negative
                          size='mini'
                          content='移除'
                          floated='right'
                          onClick={() => remove(u)}
                        />
                        <Button
                          className='left-btn'
                          icon='edit'
                          size='mini'
                          content='变更权限'
                          floated='right'
                          onClick={() => change_role(u)}
                        />
                      </>}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </OrgLayout>
  );
}

export default OrgMembers;
