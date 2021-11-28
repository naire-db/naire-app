import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Grid, Header, Modal, Table } from 'semantic-ui-react';

import api, { api_unwrap } from 'api';
import { useAsyncResult } from 'utils';
import { usePagination } from 'utils/paginate';

import DetailLayout from './DetailLayout';
import RespView, { loadResp } from './RespView';

function formatTimestamp(ts) {
  const dt = new Date(ts * 1000);
  return dt.toLocaleString();
}

function formatUser(desc) {
  if (desc === null)
    return '未登录';
  const {username, dname} = desc;
  if (username === dname)
    return username;
  return `${dname} (${username})`;
}

function RemoveModal(props) {
  const {ind, fid, rid, onClosed} = props;

  async function onSubmit() {
    const res = await api.form.remove_resp(fid, rid);
    if (res.code !== 0)
      console.error(res);
    window.location.reload();
  }

  return (
    <Modal
      open={rid !== null}
      size='mini'
      onClose={onClosed}
    >
      <Header>
        删除答卷
      </Header>
      <Modal.Content>
        <Modal.Description>
          将删除序号为 {ind + 1} 的答卷。
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content='取消'
          onClick={onClosed}
        />
        <Button
          negative
          content='删除'
          onClick={onSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
}

function RespViewModal(props) {
  const {fid, resp, form, onClosed} = props;

  const content = resp !== null && <>
    <Header>
      查看答卷
      <Header.Subheader>
        用户：{formatUser(resp.user)}
      </Header.Subheader>
      <Header.Subheader>
        时间：{formatTimestamp(resp.ctime)}
      </Header.Subheader>
    </Header>
    <Modal.Content>
      <Modal.Description>
        <RespView
          form={form}
          fid={fid}
          rid={resp.id}
        />
      </Modal.Description>
    </Modal.Content>
    <Modal.Actions>
      <Button
        content='关闭'
        onClick={onClosed}
      />
    </Modal.Actions>
  </>;

  return (
    <Modal
      open={resp !== null}
      onClose={onClosed}
    >
      {content}
    </Modal>
  );
}

function FormRespsInner(props) {
  const [removingInd, setRemovingInd] = useState(null);
  const [viewingInd, setViewingInd] = useState(null);

  const onRemoveModalClosed = () => setRemovingInd(null);
  const onViewModalClosed = () => setViewingInd(null);

  const {fid, form, resps} = props;
  console.log(props);

  const {activeItems, menu, activeOffset} = usePagination(resps, {
    maxPageSize: 20
  });

  async function openView(rid, ind) {
    console.log('open view', fid, rid, form);
    await loadResp(fid, rid, form);
    // FIXME: this can stuck for a while before a modal pops, but avoids showing a empty modal
    setViewingInd(ind);
  }

  return <>
    <Grid>
      <Grid.Row>
        <Grid.Column textAlign='center'>
          {menu}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Table celled basic='very' compact='very' textAlign='center'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>序号</Table.HeaderCell>
                <Table.HeaderCell>提交时间</Table.HeaderCell>
                <Table.HeaderCell>用户</Table.HeaderCell>
                <Table.HeaderCell>操作</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {resps.length ? activeItems.map((r, i) => (
                <Table.Row key={i}>
                  <Table.Cell>{i + 1 + activeOffset}</Table.Cell>
                  <Table.Cell>{formatTimestamp(r.ctime)}</Table.Cell>
                  <Table.Cell>{formatUser(r.user)}</Table.Cell>
                  <Table.Cell width={4}>
                    <Button
                      icon='eye' content='查看' size='mini'
                      onClick={() => openView(r.id, i + activeOffset)}
                    />
                    <Button
                      icon='delete' content='删除' negative size='mini'
                      onClick={() => setRemovingInd(i + activeOffset)}
                      style={{marginLeft: 5}}
                    />
                  </Table.Cell>
                </Table.Row>
              )) : (
                <Table.Row>
                  <Table.Cell>
                    暂无答卷
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          <RemoveModal
            fid={fid}
            rid={removingInd === null ? null : resps[removingInd].id}
            ind={removingInd}
            onClosed={onRemoveModalClosed}
          />
          <RespViewModal
            fid={fid}
            resp={viewingInd === null ? null : resps[viewingInd]}
            form={form}
            onClosed={onViewModalClosed}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </>;
}

function FormResps() {
  const fid = parseInt(useParams().fid, 10);
  const resData = useAsyncResult(async () =>
      api_unwrap(await api.form.get_form_resps(fid))
    , [fid]);

  if (resData === null)
    return null;

  const {form, resps} = resData;
  return (
    <DetailLayout title={form.title} fid={fid} offset='resps'>
      <FormRespsInner fid={fid} form={form} resps={resps} />
    </DetailLayout>
  );
}

export default FormResps;
