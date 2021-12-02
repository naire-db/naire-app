import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, Grid, Table } from 'semantic-ui-react';

import api, { api_unwrap_fut } from 'api';
import appState from 'appState';
import { useAsyncResult } from 'utils';
import { formatUser } from 'utils/render';

import { renderRoleLabel } from './utils';
import OrgLayout from './OrgLayout';

function OrgMembers() {
  const oid = parseInt(useParams().oid, 10);
  const res = useAsyncResult(() => api_unwrap_fut(api.org.get_members(oid)));
  if (res === null)
    return null;

  const {members: users} = res;

  async function invite() {
    // TODO
  }

  async function remove(member) {
    // TODO
  }

  async function change_role(member) {
    // TODO
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
                content='邀请成员'
                floated='right'
                onClick={invite}
              />
            </Grid.Column>
          </Grid.Row>
        }
        <Grid.Row>
          <Grid.Column>
            <Table size='large' basic>
              <Table.Body>
                {users.map(u => (
                  <Table.Row>
                    <Table.Cell width={4}>
                      {formatUser(u)}
                      {renderRoleLabel(u.role)}
                    </Table.Cell>
                    <Table.Cell width={5}>
                      {u.email}
                    </Table.Cell>
                    <Table.Cell width={7}>
                      {role > 0 && u.id !== appState.user_info.id && <>
                        <Button
                          icon='user times'
                          negative
                          size='small'
                          content='移除'
                          floated='right'
                          onClick={() => remove(u)}
                        />
                        <Button
                          className='left-btn'
                          icon='edit'
                          primary
                          size='small'
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
