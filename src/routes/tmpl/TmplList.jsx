import React, { useMemo, useState } from 'react';
import { Button, Grid, Input, Table } from 'semantic-ui-react';

import api, { api_unwrap_fut } from 'api';
import appState from 'appState';
import { useAsyncEffect } from 'utils';
import { formatTimestamp, formatUser } from 'utils/render';
import { useSorted } from 'utils/data';

import AppLayout from 'layouts/AppLayout';

function TmplList() {
  const [filterWord, setFilterWord] = useState('');

  const {data: tmpls, setData, headerProps} = useSorted();
  useAsyncEffect(async () => {
    setData(await api_unwrap_fut(api.tmpl.get_all()));
  });

  const filteredTmpls = useMemo(() => {
    if (tmpls === null)
      return null;
    const s = filterWord.toLowerCase().trim();
    return tmpls.filter(t => t.title.toLowerCase().trim().includes(s) || formatUser(t.user).includes(s));
  }, [filterWord, tmpls]);

  if (tmpls === null)
    return null;

  const me = appState.user_info;

  async function create({id}) {
    window.location = '/form/create?t=' + id;
  }

  async function remove({id}) {
    await api_unwrap_fut(api.tmpl.remove(id));
    window.location.reload();
  }

  return (
    <AppLayout offset>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Input
              fluid
              icon='search'
              placeholder='搜索模板'
              iconPosition='left'
              value={filterWord}
              onChange={(e, d) => setFilterWord(d.value)}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Table basic='very' compact sortable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell
                    {...headerProps('title')}
                  >
                    标题
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    {...headerProps('user', t => formatUser(t.user))}
                  >
                    作者
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    textAlign='center'
                    {...headerProps('use_count')}
                  >
                    使用次数
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    textAlign='center'
                    {...headerProps('mtime')}
                  >
                    更新时间
                  </Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredTmpls.map(t => (
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
                    <Table.Cell textAlign='center'>
                      {formatTimestamp(t.mtime)}
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        primary
                        icon='edit'
                        size='mini'
                        content='创建问卷'
                        floated='right'
                        onClick={() => create(t)}
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
                          onClick={() => remove(t)}
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
