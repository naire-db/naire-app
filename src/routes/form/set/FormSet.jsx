import React, { useState } from 'react';
import { Button, Card, Dropdown, Form, Grid, Icon, Input, Label, Menu, Segment } from 'semantic-ui-react';

import api, { api_unwrap, api_unwrap_fut } from 'api';
import AppLayout from 'layouts/AppLayout';
import { ModalTransition } from 'components/transitedModal';
import { useAsyncEffect } from 'utils';
import { usePagination } from 'utils/paginate';
import { closeModal, showModal } from 'utils/modal';

import { FOLDER_NAME_MAX_LENGTH } from '../config';
import ShareRow from './ShareRow';
import RetitleModal from './RetitleModal';
import RemoveModal from './RemoveModal';

import './form-set.css';

function formatTimestamp(ts) {
  const dt = new Date(ts * 1000);
  return dt.toLocaleString();
}

function getFormUrl(fid) {
  return window.location.origin + '/f/' + fid;
}

function getFormDetailUrl(fid) {
  return window.location.origin + '/form/' + fid + '/resps';
}

function makeOption(value, text) {
  return {
    key: value, value, text
  };
}

const sortOptions = [
  makeOption('ctime', '最早创建'),
  makeOption('ctime_', '最新创建'),
  makeOption('resp_count_', '最多答卷'),
  makeOption('resp_count', '最少答卷'),
  makeOption('title', '按标题'),
];

function nc(a, b) {
  return a > b ? 1 : (a < b ? -1 : 0);
}

const sortComps = {
  ctime: (a, b) => nc(a.ctime, b.ctime),
  ctime_: (a, b) => nc(b.ctime, a.ctime),
  resp_count: (a, b) => (nc(a.resp_count, b.resp_count) || nc(a.id, b.id)),
  resp_count_: (a, b) => (nc(b.resp_count, a.resp_count) || nc(a.id, b.id)),
  title: (a, b) => (a.title.localeCompare(b.title) || nc(a.id, b.id)),
};

const formMap = new Map();
const folderMap = new Map();

let userRootFid = null;

function FormSet() {
  const [sharingFid, setSharingFid] = useState(null);

  const [retitlingFid, setRetitlingFid] = useState(null);
  const [removingFid, setRemovingFid] = useState(null);

  const [folders, setFolders_] = useState(null);

  const [forms, setForms_] = useState(null);
  const [filteredForms, setFilteredForms] = useState(null);
  const [currFolderId, setCurrFolderId] = useState(null);

  const [filterWord, setFilterWord_] = useState('');

  function updateFilterWord(v, withForms) {
    setFilterWord_(v);
    const pin = v.trim();
    if (pin)
      setFilteredForms(withForms.filter(f => f.title.includes(pin)));
    else
      setFilteredForms(withForms);
  }

  function setForms(nextForms) {
    for (const form of nextForms)
      formMap.set(form.id, form);
    setForms_(nextForms);
  }

  function setFolders(nextFolders) {
    nextFolders.sort((a, b) => {
      if (a.id === userRootFid)
        return -1;
      if (b.id === userRootFid)
        return 1;
      return a.name.localeCompare(b.name);
    });
    for (const folder of nextFolders)
      folderMap.set(folder.id, folder);
    setFolders_(nextFolders);
  }

  async function refreshOverview() {
    const {folders, root_forms, root_fid} = api_unwrap(await api.form.get_overview());
    userRootFid = root_fid;
    setCurrFolderId(root_fid);
    setFolders(folders);
    updateFilterWord('', root_forms);
    setForms(root_forms);
  }

  useAsyncEffect(refreshOverview);

  async function onFolderChanged(folder) {
    console.log('folder changed', folder);
    const {forms} = await api_unwrap_fut(api.form.get_folder_all(folder.id));
    setCurrFolderId(folder.id);
    setForms(forms);
    updateFilterWord(filterWord, forms);
  }

  async function addFolder() {
    let value = '新目录';
    await showModal({
      title: '创建目录',
      inputProps: {
        onChange: e => (value = e.target.value),
        maxLength: FOLDER_NAME_MAX_LENGTH,
        placeholder: '新目录'
      },
      onConfirmed: async () => {
        const res = await api_unwrap_fut(api.form.create_folder(value.trim() || '新目录'));
        setFolders([...folders, res]);
        closeModal();
      }
    });
  }

  async function removeFolder() {
    const folder = folderMap.get(currFolderId);
    await showModal({
      title: '删除目录',
      confirmText: '删除',
      confirmProps: {negative: true},
      subtitle: folder.name,
      description: folder.form_count ? `已有的 ${folder.form_count} 个问卷将被移动到默认目录。` : '将删除该空目录。',
      onConfirmed: async () => {
        await api_unwrap_fut(api.form.remove_folder(currFolderId));
        await refreshOverview();  // refresh form_count
        // setFolders(folders.filter(f => f.id !== currFolderId));
        // setCurrFolderId(userRootFid);
        closeModal();
      }
    });
  }

  async function renameFolder() {
    const folder = folderMap.get(currFolderId);
    let value = null;
    await showModal({
      title: '重命名目录',
      confirmText: '保存',
      inputProps: {
        onChange: e => (value = e.target.value),
        maxLength: FOLDER_NAME_MAX_LENGTH,
        placeholder: folder.name
      },
      onConfirmed: async () => {
        const v = value.trim();
        if (v) {
          await api_unwrap_fut(api.form.rename_folder(currFolderId, v));
          folderMap.get(currFolderId).name = v;
          setFolders([...folders]);
        }
        closeModal();
      }
    });
  }

  async function moveToFolder(form) {
    await showModal({
      title: '移动到目录',
      subtitle: form.title,
      content: s => {
        return <Form>
          <Form.Dropdown
            label='新目录'
            defaultValue={currFolderId}
            selection
            options={folders.map(f => ({
              key: f.id,
              value: f.id,
              text: f.name
            }))}
            onChange={(e, d) => {
              s.value = d.value;
            }}
          />
        </Form>;
      },
      onConfirmed: async s => {
        await api_unwrap_fut(api.form.move_to_folder(form.id, s.value));
        window.location.reload();  // TODO: do it better
      },
      initialState: {
        value: currFolderId
      },
      confirmProps: s => ({
        disabled: s.value === currFolderId
      })
    });
  }

  const {activeItems, menu} = usePagination(filteredForms, {
    maxPageSize: 15
  });

  if (forms === null)
    return null;

  function share(form) {
    const fid = form.id;
    window.sharingUrl = getFormUrl(fid);
    window.sharingFormTitle = form.title;
    setSharingFid(fid);  // TODO: clear this when navigated to another page
  }

  function open(form) {
    window.location = getFormUrl(form.id);
  }

  function detail(form) {
    window.location = getFormDetailUrl(form.id);
  }

  function onSorted(key) {
    console.log('sort', key);
    setForms([...forms].sort(sortComps[key]));
    setFilteredForms([...filteredForms].sort(sortComps[key]));
  }

  function onFiltered(v) {
    updateFilterWord(v, forms);
  }

  const content = filteredForms.length ? (
    <Card.Group itemsPerRow={3}>
      {activeItems.map(form => (
        <Card
          href={getFormDetailUrl(form.id)}
          key={form.id}
        >
          <Card.Content header={form.title} meta={
            '创建于 ' + formatTimestamp(form.ctime)
          } />
          <Card.Content extra>
            <Grid>
              <Grid.Column width={12} verticalAlign='middle'>
                {form.resp_count + ' 份答卷'}
              </Grid.Column>
              <Grid.Column width={4} verticalAlign='middle' floated='right'>
                <Dropdown
                  className='form-card-dropdown icon'
                  icon='ellipsis vertical'
                  basic button size='mini' simple
                  onClick={e => e.preventDefault()}
                >
                  <Dropdown.Menu>
                    <Dropdown.Item
                      icon='setting' text='打开'
                      onClick={() => detail(form)}
                    />
                    <Dropdown.Item
                      icon='share alternate' text='分享'
                      onClick={() => share(form)}
                    />
                    <Dropdown.Item
                      icon='fire' text='作答'
                      onClick={() => open(form)}
                    />
                    <Dropdown.Item
                      icon='i cursor' text='重命名'
                      onClick={() => setRetitlingFid(form.id)}
                    />
                    <Dropdown.Item
                      icon='edit' text='编辑'
                    />
                    <Dropdown.Item icon='copy' text='复制' />
                    <Dropdown.Item
                      icon='folder' text='移动'
                      onClick={() => moveToFolder(form)}
                    />
                    <Dropdown.Item
                      className='ui negative' icon='delete' text='删除'
                      onClick={() => setRemovingFid(form.id)}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </Grid.Column>
            </Grid>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  ) : forms.length ? (
    <Segment>无搜索结果</Segment>
  ) : (
    <Segment>暂无问卷</Segment>
  );

  // FIXME: transition not working
  function buildModal(E, fid, setFid) {
    return (
      <ModalTransition open={fid !== null}>
        <E fid={fid} form={formMap.get(fid)} onClosed={() => setFid(null)} />
      </ModalTransition>
    );
  }

  // TODO: reimplement with showModal
  const modals = <>
    {buildModal(RetitleModal, retitlingFid, setRetitlingFid)}
    {buildModal(RemoveModal, removingFid, setRemovingFid)}
  </>;

  return (
    <AppLayout offset>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <Menu vertical pointing>
              {folders.map(f => (
                <Menu.Item
                  key={f.id}
                  active={f.id === currFolderId}
                  onClick={() => onFolderChanged(f)}
                >
                  <Label>{f.form_count}
                  </Label>
                  {f.name}
                </Menu.Item>
              ))}
            </Menu>
            <Menu icon size='mini' compact style={{
              float: 'right',
            }}>
              {currFolderId !== userRootFid &&
                <Menu.Item onClick={removeFolder}>
                  <Icon name='delete' />
                </Menu.Item>
              }
              <Menu.Item onClick={renameFolder}>
                <Icon name='edit' />
              </Menu.Item>
              <Menu.Item onClick={addFolder}>
                <Icon name='add' />
              </Menu.Item>
            </Menu>
          </Grid.Column>
          <Grid.Column width={1} />
          <Grid.Column width={12}>
            <Grid>
              <Grid.Row>
                <Grid.Column width={10} verticalAlign='middle'>
                  <Input
                    fluid
                    icon='search'
                    placeholder='搜索问卷'
                    size='large'
                    value={filterWord}
                    onChange={(e, d) => onFiltered(d.value)}
                  />
                </Grid.Column>
                <Grid.Column width={3} verticalAlign='middle'>
                  <Dropdown
                    className='form-card-sort-dd'
                    selection
                    simple
                    compact
                    fluid
                    placeholder='State'
                    options={sortOptions}
                    defaultValue='ctime'  // behaviour of API
                    style={{}}
                    onChange={(e, d) => onSorted(d.value)}
                  />
                </Grid.Column>
                <Grid.Column width={3} verticalAlign='middle'>
                  {/* TODO: provide folder id */}
                  <Button
                    floated='right'
                    primary size='large'
                    href='/form/create'
                  >
                    创建问卷
                  </Button>
                </Grid.Column>
              </Grid.Row>
              <ShareRow
                fid={sharingFid}
              />
              <Grid.Row>
                <Grid.Column>
                  {content}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column textAlign='center'>
                  {menu}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {modals}
    </AppLayout>
  );
}

export default FormSet;
