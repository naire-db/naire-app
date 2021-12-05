import React from 'react';
import { Grid, Table } from 'semantic-ui-react';

import api, { api_unwrap_fut } from 'api';
import { useAsyncResult } from 'utils';
import { formatTimestamp } from 'utils/render';
import ProfileLayout from 'layouts/ProfileLayout';

function UserLogs() {
  const logs = useAsyncResult(() => api_unwrap_fut(api.user.get_logs()));

  if (logs === null)
    return null;

  // TODO: pagination
  return (
    <ProfileLayout page='logs'>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Table basic='very' compact textAlign='center'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>操作</Table.HeaderCell>
                  <Table.HeaderCell>IP</Table.HeaderCell>
                  <Table.HeaderCell>设备</Table.HeaderCell>
                  <Table.HeaderCell>时间</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {logs.map((o, i) => (
                  <Table.Row key={i}>
                    <Table.Cell width={3}>
                      {o.action}
                    </Table.Cell>
                    <Table.Cell width={2}>
                      {o.ip}
                    </Table.Cell>
                    <Table.Cell width={8}>
                      {o.ua || '未知'}
                    </Table.Cell>
                    <Table.Cell width={3}>
                      {formatTimestamp(o.time)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </ProfileLayout>
  );
}

export default UserLogs;
