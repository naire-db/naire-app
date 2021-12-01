import React from 'react';
import { Button, Grid, Segment, Table } from 'semantic-ui-react';

import api, { api_unwrap_fut } from 'api';
import { useAsyncResult } from 'utils';
import { showModal } from 'utils/modal';
import ProfileLayout from 'layouts/ProfileLayout';

import { renderRoleLabel } from '../org/utils';
import { ORG_NAME_MAX_LENGTH, ROLE_OWNER } from '../org/config';

function UserOrgs() {
  const orgs = useAsyncResult(() => api_unwrap_fut(api.org.get_joined()));

  if (orgs === null)
    return null;

  async function create() {
    let value = null;
    await showModal({
      title: '创建组织',
      inputProps: {
        onChange: e => (value = e.target.value),
        maxLength: ORG_NAME_MAX_LENGTH,
        placeholder: '新组织'
      },
      onConfirmed: async () => {
        await api_unwrap_fut(api.org.create(value?.trim() || '新组织'));
        window.location.reload();
      }
    });
  }

  async function leave(org) {
    // TODO
  }

  return (
    <ProfileLayout page='orgs'>
      <Grid>
        <Grid.Row style={{
          paddingBottom: 0,
          marginBottom: -5
        }}>
          <Grid.Column verticalAlign='middle'>
            <Button
              size='small'
              primary
              content='创建组织'
              floated='right'
              onClick={create}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Table size='large' basic>
              <Table.Body>
                {orgs.length ?
                  orgs.map(o => (
                    <Table.Row>
                      <Table.Cell width={4}>
                        {o.name}
                        {renderRoleLabel(o.role)}
                      </Table.Cell>
                      <Table.Cell width={5}>
                        {o.member_count} 个成员
                      </Table.Cell>
                      <Table.Cell width={7}>
                        <Button
                          icon='log out'
                          negative
                          size='small'
                          content='退出'
                          floated='right'
                          onClick={() => leave(o)}
                        />
                        {
                          o.role >= ROLE_OWNER &&
                          <Button
                            className='left-btn'
                            icon='setting'
                            size='small'
                            content='设置'
                            floated='right'
                            href={'/org/' + o.id + '/members'}
                          />
                        }
                      </Table.Cell>
                    </Table.Row>
                  )) :
                  <Segment>
                    尚未加入任何组织
                  </Segment>}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </ProfileLayout>
  );
}

export default UserOrgs;
