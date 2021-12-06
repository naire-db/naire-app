import React, { useMemo, useState } from 'react';
import { Dropdown, Grid, Table } from 'semantic-ui-react';

import api, { api_unwrap_fut } from 'api';
import { formatTimestamp } from 'utils/render';
import ProfileLayout from 'layouts/ProfileLayout';
import { useAsyncEffect } from 'utils';
import { usePagination, useSorted } from 'utils/data';

function formatLog({action, object}) {
  return object ? action + ' (' + object + ')' : action;
}

function UserLogs() {
  const {data: logs, setData, headerProps} = useSorted();

  useAsyncEffect(async () => {
    const res = await api_unwrap_fut(api.user.get_logs());
    setData(res);
  });

  const [filterAction, setFilterAction] = useState(null);

  const options = useMemo(() => {
    const s = new Set();
    if (!logs)
      return [];
    for (const l of logs)
      s.add(l.action);
    const res = [];
    for (const v of s.keys())
      res.push({
        key: v, value: v, text: v
      });
    return res;
  }, [logs]);

  const filteredLogs = useMemo(() => {
    if (logs === null)
      return null;
    if (filterAction === null)
      return logs;
    return logs.filter(l => l.action === filterAction);
  }, [logs, filterAction]);

  const {activeItems, menu, reset} = usePagination(filteredLogs, {
    maxPageSize: 20,
    menuProps: {
      size: 'small'
    }
  });

  if (logs === null)
    return null;

  // TODO: pagination, filtering, sorting?
  return (
    <ProfileLayout page='logs'>
      <Grid>
        <Grid.Row
          style={{
            marginBottom: -20
          }}
        >
          <Grid.Column
            textAlign='center'
          >
            <Dropdown
              button
              className='icon'
              labeled
              icon='filter'
              text={filterAction ?? '筛选操作'}
              options={options}
              value={filterAction}
              clearable
              onChange={(e, {value}) => {
                setFilterAction(value || null);
                reset();
              }}
              style={{
                float: 'left'
              }}
            />
            {menu}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Table basic='very' compact textAlign='center' sortable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>操作</Table.HeaderCell>
                  <Table.HeaderCell>IP</Table.HeaderCell>
                  <Table.HeaderCell>设备</Table.HeaderCell>
                  <Table.HeaderCell
                    {...headerProps('time')}
                  >
                    时间
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {activeItems.map((o, i) => (
                  <Table.Row key={i}>
                    <Table.Cell width={5}>
                      {formatLog(o)}
                    </Table.Cell>
                    <Table.Cell width={2}>
                      {o.ip}
                    </Table.Cell>
                    <Table.Cell width={6}>
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
