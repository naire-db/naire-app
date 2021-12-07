import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  Label,
  Message,
  Segment,
  Sticky,
  Transition
} from 'semantic-ui-react';
import _ from 'lodash';

import AppLayout from 'layouts/AppLayout';
import api, { api_unwrap_fut } from 'api';
import { int_or_null, useAsyncResult } from 'utils';
import { get_query_param } from 'utils/url';
import { closeModal, showModal } from 'utils/modal';

import { editorMap, nameMap, qMap, typeMap } from './types';
import { useErrorContext } from './errorContext';
import { FORM_TITLE_MAX_LENGTH, QUESTION_TITLE_MAX_LENGTH } from './config';
import { consume_signed } from './exchange';

import './form.css';

function loadQMap(questions, ctx) {
  console.log('loading qmap', questions);
  for (const q of questions) {
    const n = qMap[q.id] = new typeMap[q.type](q.id, ctx);
    Object.assign(n, _.cloneDeep(q));
    n.afterLoad?.();
  }
  console.log('loaded qmap', qMap);
}

class Option {
  text = '';

  constructor(id) {
    this.id = id;
  }
}

const qTypes = [
  ['radio', '单选题', 'radio'],
  ['checkbox', '多选题', 'checkmark box'],
  ['input', '填空题', 'text cursor'],
  ['text', '简答题', 'file text'],
  ['dropdown', '下拉列表', 'dropdown'],
  ['file', '文件上传', 'file']
];

// TODO: save state in localStorage / IndexedDB? to restore after leaving the page (not a priority)

function FormEditor(props) {
  const [nextQid, setNextQid] = useState(0);
  const [nextOid, setNextOid] = useState(0);
  const [qids, setQids] = useState([]);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const errorCtx = useErrorContext();

  const {onSaved, saveText, initialStateFn} = props;

  const ctx = {
    getOid() {
      const v = nextOid;
      setNextOid(v + 1);
      return v;
    },
    newOption() {
      return new Option(this.getOid());
    }
  };

  function loadEditorState(state) {
    console.log('load editor state', state);
    const {nextQid, nextOid, qids, title, questions} = state;
    loadQMap(questions, ctx);
    setNextQid(nextQid);
    setNextOid(nextOid);
    setQids(qids);
    setTitle(title);
    // Assume initialStateFn never changes after FormEditor's first time rendering
  }

  useEffect(() => {
    if (initialStateFn)
      loadEditorState(initialStateFn());
  }, []);

  // XXX: Putting initialStateFn in deps causes random reloading.

  function addQuestion(type) {
    console.log('adding question type', type);
    const qid = nextQid;
    setNextQid(qid + 1);
    qids.push(qid);
    setQids(qids);
    window.qidsNonEmpty = true;
    console.log(typeMap, editorMap, ctx);
    qMap[qid] = new typeMap[type](qid, ctx);
  }

  async function onSubmit() {
    const titleValue = title.trim();
    if (!titleValue)
      return setTitleError(true);

    const body = {
      questions: qids.map(qid => {
        const q = qMap[qid];
        if (q.onSave)
          q.onSave();
        return q;
      })
    };
    // TODO: Recover the flags?
    window.qidsNonEmpty = window.titleNonEmpty = false;
    onSaved(body, titleValue);
  }

  function onRemoved(qid) {
    // TODO: show a confirm modal
    setQids(qids => {
      const n = qids.filter(x => x !== qid);
      window.qidsNonEmpty = n.length;
      return n;
    });
  }

  useEffect(() => {
    const fn = e => {
      const edited = window.qidsNonEmpty || window.titleNonEmpty;
      if (edited)
        e.returnValue = false;
    };
    window.addEventListener('beforeunload', fn);
    return () => window.removeEventListener('beforeunload', fn);
  }, []);

  function refreshQuestions() {
    setQids([...qids]);
  }

  async function openImage(qid, iid) {
    await showModal({
      title: '查看图片',
      size: 'small',
      confirmText: '删除',
      content() {
        const src = api.file.image_url(iid);
        return <Image
          size='huge'
          src={src}
          href={src}
          target='_blank'
        />;
      },
      confirmProps: {
        negative: true
      },
      onConfirmed() {
        const q = qMap[qid];
        q.images = q.images.filter(x => x !== iid);
        refreshQuestions();
        closeModal();
      }
    });
  }

  async function addImage(qid) {
    let file = null;
    await showModal({
      title: '添加图片',
      size: 'small',
      confirmText: '上传',
      content(s) {
        return <Form className='image-form'>
          <Form.Input
            label='上传图片文件（最大 10 MiB）'
            type='file'
            accept='image/*'
            onChange={e => {
              file = e.target.files[0];
              if (file) {
                s.uploaded = true;
                s.size = file.size / 1024 / 1024;
                s.oversized = s.size > 10;
              } else {
                s.uploaded = false;
                s.oversized = false;
              }
            }}
          />
          {s.uploaded && s.oversized &&
            <Message
              negative
              content={`文件过大（${s.size.toFixed(3)} MiB）`}
            />
          }
        </Form>;
      },
      confirmProps(s) {
        return {
          disabled: !s.uploaded || s.oversized
        };
      },
      async onConfirmed() {
        const data = new FormData();
        data.append('file', file);
        const image_id_fut = api_unwrap_fut(api.file.upload_image(data));
        const q = qMap[qid];
        if (q.images)
          q.images.push(await image_id_fut);
        else
          q.images = [await image_id_fut];
        refreshQuestions();
        closeModal();
      },
      initialState: {
        size: null,
        uploaded: false,
        oversized: false,
      }
    });
  }

  async function onImport() {
    // TODO
    let text;
    const res = await showModal({
      title: '导入问卷题目',
      cancelText: '从剪切板导入',
      confirmText: '上传文件',
      description: '正在编辑的内容将被覆盖。',
      confirmProps: s => ({
        size: 'small',
        loading: s.loading === 1,
        disabled: s.loading !== 0,
      }),
      cancelProps: s => ({
        size: 'small',
        loading: s.loading === 2,
        disabled: s.loading !== 0,
      }),
      content() {
        return (
          <input
            type='file'
            id='import-input'
            style={{
              display: 'none'
            }}
          />
        );
      },
      async onCancelled(s, close) {
        s.loading = 2;
        try {
          text = await navigator.clipboard.readText();
        } catch (e) {  // denied
          return close(1);
        }
        return close(0);
      },
      onConfirmed(s, close) {
        s.loading = 1;
        const input = document.getElementById('import-input');

        function handleFile(e) {
          text = e.target.result;
          close(0);
        }

        function handler(e) {
          const f = e.target.files[0];
          console.log('uploaded', f);
          if (f) {
            const reader = new FileReader();
            reader.onload = handleFile;
            reader.readAsText(f);
          }
          input.removeEventListener('change', handler);
        }

        input.addEventListener('change', handler);
        input.click();
      },
      initialState: {
        loading: 0
      }
    });

    function work() {
      if (res === 0) {
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {  // bad json
          return '提供的问卷数据不合法。';
        }
        if (consume_signed(data)) {
          loadEditorState(makeEditorState(data.body.questions, data.title));
        } else
          return '提供的问卷数据不合法。';
      } else if (res === 2)
        return '提供的问卷数据不合法。';
      else if (res === 1)
        return '对剪切板的访问被拒绝。';
    }

    const error = work();
    if (error)
      await showModal({
        title: '导入失败',
        description: error,
        noConfirm: true,
        cancelText: '关闭',
      });
  }

  // FIXME: the sticky seems not working when editing lots of questions.
  return (
    <AppLayout offset>
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <Sticky offset={70}>
              <Segment>
                <Header>添加题目</Header>
                {qTypes.map(l => (
                  <Label key={l[0]} as='a' onClick={() => addQuestion(l[0])} style={{'margin': 3}}>
                    <Icon name={l[2]} />
                    {l[1]}
                  </Label>
                ))}
              </Segment>
            </Sticky>
          </Grid.Column>
          <Grid.Column width={12}>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Input
                    style={{
                      width: 'calc(100% - 170px)'
                    }}
                    className='qeditor-title-input-box'
                    error={titleError}
                    placeholder='问卷标题'
                    value={title}
                    maxLength={FORM_TITLE_MAX_LENGTH}
                    onChange={e => {
                      const v = e.target.value;
                      window.titleNonEmpty = v.trim();
                      setTitleError(false);
                      setTitle(v);
                    }}
                  />
                  <Button
                    primary
                    floated='right'
                    onClick={onSubmit}
                    disabled={titleError || errorCtx.dirty()}
                  >
                    {saveText}
                  </Button>
                  <Button
                    floated='right'
                    content='导入'
                    style={{
                      marginRight: 5
                    }}
                    onClick={onImport}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Transition.Group duration={120}>
                    {qids.map(qid => {
                      const q = qMap[qid];
                      const {type, title} = q;
                      const E = editorMap[type];
                      return <Segment.Group key={qid}>
                        <Segment>
                          <Grid>
                            <Grid.Row>
                              <Grid.Column width={13} verticalAlign='middle'>
                                <Header as='h4'>
                                  {nameMap[type]}
                                </Header>
                              </Grid.Column>
                              <Grid.Column width={3} verticalAlign='middle'>
                                <Icon
                                  link name='delete' size='large' className='rfloated'
                                  onClick={() => onRemoved(qid)}
                                />
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Segment>
                        <Segment>
                          <Grid>
                            <Grid.Row className='qeditor-meta-row'>
                              <Grid.Column>
                                <Input
                                  className='qeditor-title-input-box'
                                  placeholder='问题'
                                  maxLength={QUESTION_TITLE_MAX_LENGTH}
                                  value={title}
                                  onChange={e => {
                                    q.title = e.target.value;
                                    setQids([...qids]);  // dirty way to make this part rerendered
                                  }}
                                />
                              </Grid.Column>
                            </Grid.Row>
                            <Grid.Row className='question-image-group-row'>
                              <Grid.Column>
                                <Image.Group size='tiny'>
                                  {q.images?.map(iid => (
                                    <Image
                                      key={iid}
                                      bordered rounded
                                      src={api.file.image_url(iid)}
                                      as='a' href='#'
                                      onClick={() => openImage(qid, iid)}
                                    />
                                  ))
                                  }
                                </Image.Group>
                                {(!q.images || q.images.length) < 5 &&
                                  <Button
                                    icon='add'
                                    onClick={() => addImage(qid)}
                                    content='添加图片'
                                    size='mini'
                                  />
                                }
                              </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                              <Grid.Column>
                                <E
                                  qid={qid}
                                  ctx={ctx}
                                  useErrorFlag={errorCtx.createFlagHook(qid)}
                                  useErrorState={errorCtx.createStateHook(qid)}
                                />
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Segment>
                      </Segment.Group>;
                    })}
                  </Transition.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </AppLayout>
  );
}

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

function FormCreate() {
  const res = useAsyncResult(async () => {
    const param = get_query_param('t');
    if (param === null)
      return [];
    const tid = Number(param);
    const res = await api_unwrap_fut(api.tmpl.get_detail(tid));
    return [tid, () => makeEditorState(res.body.questions, res.title)];
  }, []);

  if (res === null)
    return null;

  const [tid, fn] = res;

  async function onSaved(body, title) {
    const fid = int_or_null(get_query_param('f'));
    await api_unwrap_fut(api.form.create(title, body, fid, tid));
    window.location = '/form/all' + window.location.search;
  }

  return <FormEditor
    onSaved={onSaved}
    saveText='创建'
    initialStateFn={fn}
  />;
}

export default FormCreate;
export { FormEditor, makeEditorState };
