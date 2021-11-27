import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Header, Icon, Menu, Modal, Table } from 'semantic-ui-react';

import api from 'api';
import { ModalTransition } from 'components/transitedModal';

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

function formatUserFull(desc) {
  if (desc === null)
    return '未登录用户';
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
        用户：{formatUserFull(resp.user)}
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

  const removeModalOpen = removingInd !== null;
  const onRemoveModalClosed = () => setRemovingInd(null);

  const viewModalOpen = viewingInd !== null;
  const onViewModalClosed = () => setViewingInd(null);

  const {fid, form, resps} = props;
  console.log(props);

  async function openView(rid, ind) {
    console.log('open view', fid, rid, form);
    await loadResp(fid, rid, form);
    // FIXME: this can stuck for a while before a modal pops, but avoids showing a empty modal
    setViewingInd(ind);
  }

  // TODO: pagination
  return <>
    <Table celled basic compact>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>序号</Table.HeaderCell>
          <Table.HeaderCell>提交时间</Table.HeaderCell>
          <Table.HeaderCell>用户</Table.HeaderCell>
          <Table.HeaderCell>操作</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {resps.map((r, i) => (
          <Table.Row key={i}>
            <Table.Cell>{i + 1}</Table.Cell>
            <Table.Cell>{formatTimestamp(r.ctime)}</Table.Cell>
            <Table.Cell>{formatUser(r.user)}</Table.Cell>
            <Table.Cell>
              <Button
                icon='eye' content='查看' size='mini'
                onClick={() => openView(r.id, i)}
              />
              <Button
                icon='delete' content='删除' negative size='mini'
                onClick={() => setRemovingInd(i)}
                style={{marginLeft: 5}}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>

      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan='4'>
            <Menu floated='right' pagination>
              <Menu.Item as='a' icon>
                <Icon name='chevron left' />
              </Menu.Item>
              <Menu.Item as='a'><code>TODO: pagination</code></Menu.Item>
              <Menu.Item as='a'>2</Menu.Item>
              <Menu.Item as='a'>3</Menu.Item>
              <Menu.Item as='a'>4</Menu.Item>
              <Menu.Item as='a' icon>
                <Icon name='chevron right' />
              </Menu.Item>
            </Menu>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
    <ModalTransition open={removeModalOpen}>
      <RemoveModal
        fid={fid} rid={removingInd === null ? 0 : resps[removingInd].id} ind={removingInd}
        onClosed={onRemoveModalClosed}
      />
    </ModalTransition>
    <ModalTransition open={viewModalOpen}>
      <RespViewModal
        fid={fid}
        resp={viewingInd === null ? null : resps[viewingInd]}
        form={form}
        onClosed={onViewModalClosed}
      />
    </ModalTransition>
  </>;
}

function FormResps() {
  const [resData, setResData] = useState(null);
  const fid = parseInt(useParams().fid, 10);

  useEffect(() => {
    (async () => {
      const res = await api.form.get_form_resps(fid);
      if (res.code !== 0)
        return console.error(res);
      setResData(res.data);
    })();
  }, [fid]);

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
