import React from 'react';
import { Button, Grid, Segment, Table } from 'semantic-ui-react';

import api, { api_unwrap_fut } from 'api';
import { useAsyncResult } from 'utils';
import { showModal } from 'utils/modal';
import NavButton from 'components/NavButton';
import ProfileLayout from 'layouts/ProfileLayout';

import { renderRoleLabel } from '../org/utils';
import { ORG_NAME_MAX_LENGTH } from '../org/config';

function UserOrgs() {
  const orgs = useAsyncResult(() => api_unwrap_fut(api.org.get_joined()));

  if (orgs === null)
    return null;

  async function create() {
    let value = null;
    await showModal({
      title: '创建组织',
      confirmNav: true,
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
    await showModal({
      title: '退出组织',
      description: '将离开组织 ' + org.name + ' 。',
      confirmText: '退出组织',
      confirmNav: true,
      confirmProps: {
        negative: true
      },
      async onConfirmed() {
        await api_unwrap_fut(api.org.leave(org.id));
        window.location.reload();
      }
    });
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
            {orgs.length ?
              <Table basic compact>
                <Table.Body>
                  {orgs.map(o => (
                    <Table.Row key={o.id}>
                      <Table.Cell width={4}>
                        <a
                          href={'/org/' + o.id + '/members'}
                          target='_blank'
                          rel='noreferrer'
                        >
                          {o.name}
                        </a>
                        {renderRoleLabel(o.role)}
                      </Table.Cell>
                      <Table.Cell width={5}>
                        {o.form_count === undefined
                          ? `${o.member_count} 位成员`
                          : `${o.member_count} 位成员，${o.form_count} 份问卷`
                        }
                      </Table.Cell>
                      {/* TODO: __ 份问卷，若 >= ADMIN */}
                      <Table.Cell width={7}>
                        <NavButton
                          icon='setting'
                          size='mini'
                          content='详情'
                          floated='right'
                          href={'/org/' + o.id + '/members'}
                        />
                        {o.can_leave &&
                          <Button
                            className='left-btn'
                            icon='log out'
                            negative
                            size='mini'
                            content='退出'
                            floated='right'
                            onClick={() => leave(o)}
                          />
                        }
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table> : <Segment>
                尚未加入任何组织
              </Segment>
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </ProfileLayout>
  );
}

export default UserOrgs;
