import React from 'react';

import { FormEditor } from './FormCreate';
import { useParams } from 'react-router-dom';
import { useAsyncResult } from '../../utils';
import api, { api_unwrap_fut } from '../../api';
import { showModal } from '../../utils/modal';

function makeEditorState(questions, title) {
  let maxQid = -1, maxOid = -1;
  const qids = [];
  for (const q of questions) {
    maxQid = Math.max(maxQid, q.id);
    qids.push(q.id);
    if (q.options) for (const o of q.options)
      maxOid = Math.max(maxOid, o.id);
  }
  return {
    nextQid: maxQid + 1,
    nextOid: maxOid + 1,
    qids,
    title,
    questions
  };
}

function FormEdit() {
  const fid = parseInt(useParams().fid, 10);
  const stat = useAsyncResult(() => api_unwrap_fut(api.form.get_status(fid)));
  if (stat === null)
    return null;

  const {title, body, folder_id} = stat;

  async function confirm(count, onConfirmed) {
    return await showModal({
      title: '警告',
      description: '若保存修改，已有的 ' + count + ' 份答卷将被删除。',
      confirmText: '保存',
      confirmProps: {
        negative: true
      },
      onConfirmed
    });
  }

  async function onSaved(body, title) {
    async function submit() {
      await api_unwrap_fut(api.form.remake(fid, title, body));  // TODO: concurrently unsafe
      window.location = '/form/all';
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
