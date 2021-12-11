import React, { useMemo, useState } from 'react';
import { Card, Dropdown, Form, Grid, Icon, Input, Label, Menu, Segment } from 'semantic-ui-react';

import api, { api_unwrap_fut } from 'api';
import appState from 'appState';
import AppLayout from 'layouts/AppLayout';
import { ModalTransition } from 'components/transitedModal';
import { useAsyncEffect } from 'utils';
import { usePagination } from 'utils/paginate';
import { closeModal, showModal } from 'utils/modal';
import { formatTimestamp, formatUser } from 'utils/render';
import { get_query_param } from 'utils/url';

import { FOLDER_NAME_MAX_LENGTH, FORM_TITLE_MAX_LENGTH } from '../config';
import ShareRow from './ShareRow';
import RetitleModal from './RetitleModal';
import RemoveModal from './RemoveModal';

import './form-set.css';
import { onEditForm } from '../common';
import NavButton from '../../../components/NavButton';

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

function FormSet() {
  const [sharingFid, setSharingFid] = useState(null);

  const [retitlingFid, setRetitlingFid] = useState(null);
  const [removingFid, setRemovingFid] = useState(null);

  const [folders, setFolders_] = useState(null);

  const [forms, setForms_] = useState(null);
  const [filteredForms, setFilteredForms] = useState(null);
  const [currFolderId, setCurrFolderId] = useState(null);

  const [filterWord, setFilterWord_] = useState('');

  const [rootFid, setRootFid] = useState(null);
  const [orgs, setOrgs] = useState(null);
  const [ctx, setCtx] = useState(-1);

  function updateFilterWord(v, withForms) {
    setFilterWord_(v);
    const pin = v.trim().toLowerCase();
    if (pin)
      setFilteredForms(withForms.filter(f => f.title.toLowerCase().includes(pin)));
    else
      setFilteredForms(withForms);
  }

  function setForms(nextForms) {
    for (const form of nextForms)
      formMap.set(form.id, form);
    setForms_(nextForms);
  }

  function setFolders(nextFolders, rootFid) {
    nextFolders.sort((a, b) => {
      if (a.id === rootFid)
        return -1;
      if (b.id === rootFid)
        return 1;
      return a.name.localeCompare(b.name);
    });
    for (const folder of nextFolders)
      folderMap.set(folder.id, folder);
    setFolders_(nextFolders);
  }

  function loadOverview(res, folderId) {
    const {folders, root_forms, root_fid} = res;
    // TODO: store these in one state to reduce rerendering
    setRootFid(root_fid);
    if (folderId === undefined)
      setCurrFolderId(root_fid);
    else
      setCurrFolderId(folderId);
    setFolders(folders, root_fid);
    updateFilterWord('', root_forms);
    setForms(root_forms);
  }

  async function refreshOverview(ctx) {
    const fut = ctx < 0 ? api.form.get_overview() : api.form.get_org_overview(ctx);
    loadOverview(await api_unwrap_fut(fut));
  }

  useAsyncEffect(async () => {
    const folderId = parseInt(get_query_param('f'), 10);
    const hasFolderId = !isNaN(folderId);
    const res = await api_unwrap_fut(
      hasFolderId ? api.form.get_folder_overview(folderId) : api.form.get_overview()
    );
    const {admin_orgs} = res;
    setOrgs(admin_orgs);
    if (hasFolderId) {
      loadOverview(res, folderId);
      setCtx(res.context === null ? -1 : res.context);
      await onFolderChanged({id: folderId});
    } else
      loadOverview(res);
  });

  function reload() {
    window.location = '/form/all?f=' + currFolderId;
  }

  const ctxOptions = useMemo(() => {
    if (!orgs?.length)
      return null;
    return [{key: -1, value: -1, text: formatUser(appState.user_info)}, ...orgs.map(o => ({
      key: o.id, value: o.id, text: o.name
    }))];
  }, [orgs]);

  async function switchContext(ctx) {
    await refreshOverview(ctx);
    setCtx(ctx);
  }

  async function onFolderChanged(folder) {
    const {id} = folder;
    const {forms} = await api_unwrap_fut(api.form.get_folder_all(id));
    setCurrFolderId(id);
    setForms(forms);
    updateFilterWord(filterWord, forms);
    const url = window.location.protocol + '//' + window.location.host + window.location.pathname + '?f=' + id;
    window.history.pushState({path: url}, '', url);
  }

  async function addFolder() {
    let value = null;
    await showModal({
      title: '创建目录',
      confirmNav: true,
      inputProps: {
        onChange: e => (value = e.target.value),
        maxLength: FOLDER_NAME_MAX_LENGTH,
        placeholder: '新目录'
      },
      onConfirmed: async () => {
        const res = await api_unwrap_fut(api.form.create_folder(
          value?.trim() || '新目录',
          ctx < 0 ? null : ctx
        ));
        setFolders([...folders, res], rootFid);
        closeModal();
      }
    });
  }

  async function removeFolder() {
    const folder = folderMap.get(currFolderId);
    await showModal({
      title: '删除目录',
      confirmText: '删除',
      confirmNav: true,
      confirmProps: {negative: true},
      subtitle: folder.name,
      description: folder.form_count ? `已有的 ${folder.form_count} 个问卷将被移动到默认目录。` : '将删除该空目录。',
      onConfirmed: async () => {
        await api_unwrap_fut(api.form.remove_folder(currFolderId));
        await refreshOverview(ctx);  // refresh form_count
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
      confirmNav: true,
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
          setFolders([...folders], rootFid);
        }
        closeModal();
      }
    });
  }

  function makeContextFolderDropdowns(s) {
    return <>
      {ctxOptions &&
        <Form.Dropdown
          label='个人或组织'
          defaultValue={ctx}
          selection
          options={ctxOptions}
          onChange={async (e, d) => {
            s.loading = true;
            const res = await api_unwrap_fut(api.form.get_org_folders(d.value));
            s.folders = res.folders;
            s.value = res.root_fid;
            s.loading = false;
          }}
        />
      }
      <Form.Dropdown
        label='目标目录'
        value={s.value}
        selection
        loading={s.loading}
        disabled={s.loading}
        options={s.folders.map(f => ({
          key: f.id,
          value: f.id,
          text: f.name
        }))}
        onChange={(e, d) => {
          s.value = d.value;
        }}
      />
    </>;
  }

  function makeContextFolderDropdownsInitialState() {
    return {
      value: currFolderId,
      folders,
      loading: false
    };
  }

  async function moveToFolder(form) {
    await showModal({
      title: '移动到目录',
      confirmText: '移动',
      confirmNav: true,
      subtitle: form.title,
      content: s => {
        return <Form>
          {makeContextFolderDropdowns(s)}
        </Form>;
      },
      initialState: makeContextFolderDropdownsInitialState(),
      onConfirmed: async s => {
        await api_unwrap_fut(api.form.move_to_folder(form.id, s.value));
        reload();
      },
      confirmProps: s => ({
        disabled: s.value === currFolderId
      })
    });
  }

  async function edit(form) {
    const url = '/form/' + form.id + '/edit?f=' + currFolderId;
    await onEditForm(url, form.resp_count || form.published, form.title);
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

  // TODO: Allow copying / moving to another context (org), which will make it possible
  //  to have a form created from a template as an org.
  async function copy(form) {
    let newTitle = null;
    await showModal({
      title: '复制问卷',
      confirmText: '复制',
      confirmNav: true,
      subtitle: form.title,
      content: s => {
        return <Form>
          {makeContextFolderDropdowns(s)}
          <Form.Input
            label='问卷标题'
            onChange={(e, d) => {
              newTitle = d.value;
            }}
            placeholder={form.title}
            maxLength={FORM_TITLE_MAX_LENGTH}
          />
        </Form>;
      },
      initialState: makeContextFolderDropdownsInitialState(),
      onConfirmed: async s => {
        const title = newTitle?.trim() || form.title;
        await api_unwrap_fut(api.form.copy(form.id, s.value, title));
        reload();
      }
    });
  }

  function onSorted(key) {
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
                {form.resp_count + ' 份答卷'
                  + (form.published ? '' : '，已暂停')
                }
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
                      icon='setting' text='管理'
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
                      onClick={() => edit(form)}
                    />
                    <Dropdown.Item
                      icon='copy' text='复制'
                      onClick={() => copy(form)}
                    />
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
      <Grid relaxed stackable>
        <Grid.Row>
          <Grid.Column width={4}>
            {ctxOptions && <Dropdown
              fluid
              selection
              value={ctx}
              options={ctxOptions}
              onChange={(e, d) => switchContext(d.value)}
            />}
            <Menu vertical pointing fluid>
              {folders.map(f => (
                <Menu.Item
                  key={f.id}
                  active={f.id === currFolderId}
                  onClick={() => onFolderChanged(f)}
                >
                  <Label>
                    {f.form_count}
                  </Label>
                  {f.name}
                </Menu.Item>
              ))}
            </Menu>
            <Menu icon size='mini' compact style={{
              float: 'right',
            }}>
              {currFolderId !== rootFid &&
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
          <Grid.Column width={12}>
            <Grid>
              <Grid.Row>
                <Grid.Column verticalAlign='middle'>
                  <Input
                    icon='search'
                    placeholder='搜索问卷'
                    size='large'
                    value={filterWord}
                    onChange={(e, d) => onFiltered(d.value)}
                    style={{
                      width: 'calc(100% - 270px)'
                    }}
                  />
                  <div style={{float: 'right'}}>
                    <Dropdown
                      className='form-card-sort-dd'
                      size='large'
                      compact
                      selection
                      simple
                      placeholder='State'
                      options={sortOptions}
                      defaultValue='ctime'  // behaviour of API
                      onChange={(e, d) => onSorted(d.value)}
                      style={{
                        width: 110,
                      }}
                    />
                    <NavButton
                      size='large'
                      primary
                      href={'/form/create?f=' + currFolderId}
                      style={{
                        marginLeft: 20
                      }}
                    >
                      创建问卷
                    </NavButton>
                  </div>
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
