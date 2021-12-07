import React from 'react';
import { useParams } from 'react-router-dom';

import api, { api_unwrap_fut } from 'api';
import { useAsyncResult } from 'utils';
import { showModal } from 'utils/modal';

import { FormEditor, makeEditorState } from './FormCreate';

function FormEdit() {
  const fid = parseInt(useParams().fid, 10);
  const stat = useAsyncResult(() => api_unwrap_fut(api.form.get_status(fid)));
  if (stat === null)
    return null;

  const {title, body} = stat;

  async function confirm(count, onConfirmed) {
    return await showModal({
      title: '警告',
      description: '若保存修改，已有的 ' + count + ' 份答卷将被删除。',
      confirmText: '保存',
      confirmNav: true,
      confirmProps: {
        negative: true
      },
      onConfirmed
    });
  }

  async function onSaved(body, title) {
    async function submit() {
      await api_unwrap_fut(api.form.remake(fid, title, body));  // TODO: concurrently unsafe
      window.location = '/form/all' + window.location.search;
    }

    const respCount = await api_unwrap_fut(api.form.get_resp_count(fid));
    if (respCount)
      await confirm(respCount, submit);
    else
      await submit();
  }

  return <FormEditor
    onSaved={onSaved}
    saveText='保存'
    initialStateFn={() => makeEditorState(body.questions, title)}
  />;
}

export default FormEdit;
