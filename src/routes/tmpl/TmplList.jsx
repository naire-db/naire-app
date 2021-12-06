import React from 'react';
import { Button, Grid, Table } from 'semantic-ui-react';

import api, { api_unwrap_fut } from 'api';
import appState from 'appState';
import { useAsyncResult } from 'utils';
import { formatUser } from 'utils/render';

import AppLayout from 'layouts/AppLayout';

function TmplList() {
  const tmpls = useAsyncResult(() => api_unwrap_fut(api.tmpl.get_all()));
  if (tmpls === null)
    return null;

  const me = appState.user_info;

  return (
    <AppLayout offset>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Table basic='very' compact>
              <Table.Header>
                <Table.HeaderCell>标题</Table.HeaderCell>
                <Table.HeaderCell>作者</Table.HeaderCell>
                <Table.HeaderCell textAlign='center'>
                  使用次数
                </Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Header>
              <Table.Body>
                {tmpls.map(t => (
                  <Table.Row key={t.id}>
                    <Table.Cell>
                      {t.title}
                    </Table.Cell>
                    <Table.Cell>
                      {formatUser(t.user)}
                    </Table.Cell>
                    <Table.Cell textAlign='center' width={2}>
                      {t.use_count}
                    </Table.Cell>
                    <Table.Cell width={4}>
                      <Button
                        primary
                        icon='edit'
                        size='mini'
                        content='创建问卷'
                        floated='right'
                      />
                      {me && t.user.id === me.id &&
                        <Button
                          icon='delete'
                          negative
                          size='mini'
                          content='撤下'
                          floated='right'
                          style={{
                            marginRight: 5
                          }}
                        />
                      }
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </AppLayout>
  );
}

export default TmplList;
