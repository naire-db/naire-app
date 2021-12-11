import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Container,
  Divider,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  Label,
  Message,
  Ref,
  Segment,
  Sticky,
  TextArea,
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
  ['file', '文件上传', 'file'],
  ['comment', '注释', 'content'],
];

// TODO: save state in localStorage / IndexedDB? to restore after leaving the page (not a priority)

function FormEditor(props) {
  const [nextQid, setNextQid] = useState(0);
  const [nextOid, setNextOid] = useState(0);
  const [qids, setQids] = useState([]);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const errorCtx = useErrorContext();

  const [loading, setLoading] = useState(false);

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
      return;

    setLoading(true);
    const body = {
      questions: qids.map(qid => {
        const q = qMap[qid];
        if (q.onSave)
          q.onSave();
        q.title = q.title.trim();
        return q;
      })
    };
    // TODO: Recover the flags?
    window.qidsNonEmpty = window.titleNonEmpty = false;
    await onSaved(body, titleValue);
    setLoading(false);
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
      confirmNav: true,
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

  function importData(data) {
    loadEditorState(makeEditorState(data.body.questions, data.title));
  }

  async function onImport() {
    let text;
    const res = await showModal({
      title: '导入 JSON',
      description: '正在编辑的内容将被覆盖。',
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
      buttons(s, close) {
        return [{
          content: '取消',
          size: 'small',
          onClick: close,
        }, {
          content: '从剪切板导入',
          size: 'small',
          loading: s.loading === 2,
          disabled: s.loading !== 0,
          async onClick() {
            s.loading = 2;
            try {
              text = await navigator.clipboard.readText();
            } catch (e) {  // denied
              return close(1);
            }
            return close(0);
          },
        }, {
          content: '上传文件',
          size: 'small',
          loading: s.loading === 1,
          disabled: s.loading !== 0,
          primary: true,
          onClick() {
            const input = document.getElementById('import-input');

            function handleFile(e) {
              text = e.target.result;
              close(0);
            }

            function handler(e) {
              const f = e.target.files[0];
              if (f) {
                s.loading = 1;
                const reader = new FileReader();
                reader.onload = handleFile;
                reader.readAsText(f);
              }
              input.removeEventListener('change', handler);
            }

            input.addEventListener('change', handler);
            input.click();
          },
        }];
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
        if (consume_signed(data))
          importData(data);
        else
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

  async function onCrawlImport() {
    const res = await showModal({
      title: '从问卷星导入',
      size: 'small',
      description: '正在编辑的内容将被覆盖。',
      content: s => <>
        <Form style={{marginTop: 20, marginBottom: 15}}>
          <Form.Input
            type='url'
            label='问卷或模板 URL'
            placeholder='https://www.wjx.cn/xz/30133265.aspx'
            value={s.value}
            onChange={(e, d) => s.value = d.value}
          />
        </Form>
        <p>
          当前支持以 https://www.wjx.cn/vj/ 和 https://www.wjx.cn/xz/ 开头的
          <a
            href='https://www.wjx.cn/newwjx/mysojump/selecttemplatelogin.aspx'
            target='_blank'
            rel='noreferrer'
          >
            问卷星模板
          </a>
          或问卷。
        </p>
      </>,
      confirmText: '导入',
      confirmNav: true,
      initialState: {
        value: ''
      },
      confirmProps: s => ({
        disabled: !s.value.trim()
      }),
      async onConfirmed(s, close) {
        const res = await api.crawl(s.value.trim());
        close(res);
      }
    });

    if (!res)
      return;

    if (res.code === 0)
      importData(res.data);
    else
      await showModal({
        title: '导入失败',
        description: '暂时无法解析此 URL。',
        noConfirm: true,
        cancelText: '关闭'
      });
  }

  const ref = useRef();

  return (
    <AppLayout offset>
      <Ref innerRef={ref}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={4}>
              <Container>
                <Sticky offset={70} context={qids.length ? ref : undefined}>
                  <Segment>
                    <Header>添加题目</Header>
                    {qTypes.map(l => (
                      <Label key={l[0]} size='tiny' as='a' onClick={() => addQuestion(l[0])} style={{'margin': 3}}>
                        <Icon name={l[2]} />
                        {l[1]}
                      </Label>
                    ))}
                    <Divider />
                    <div>
                      <Button
                        size='tiny'
                        content='从 JSON 导入'
                        onClick={onImport}
                      />
                      <Button
                        size='tiny'
                        content='从问卷星导入'
                        color='orange'
                        onClick={onCrawlImport}
                        floated='right'
                      />
                    </div>
                    <Divider />
                    <Button
                      loading={loading}
                      primary
                      onClick={onSubmit}
                      disabled={!title.trim() || errorCtx.dirty() || loading}
                    >
                      {saveText}
                    </Button>
                  </Segment>
                </Sticky>
              </Container>
            </Grid.Column>
            <Grid.Column width={12}>
              <Grid>
                <Grid.Row>
                  <Grid.Column>
                    <Input
                      className='qeditor-title-input-box'
                      error={titleError}
                      placeholder='问卷标题'
                      value={title}
                      maxLength={FORM_TITLE_MAX_LENGTH}
                      onChange={e => {
                        const v = e.target.value;
                        window.titleNonEmpty = v.trim();
                        setTitleError(!v.trim());
                        setTitle(v);
                      }}
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
                                  {q.type === 'comment' ?
                                    <Form>
                                      <TextArea
                                        placeholder={q.type === 'comment' ? '内容' : '问题'}
                                        maxLength={QUESTION_TITLE_MAX_LENGTH}
                                        value={title}
                                        onChange={e => {
                                          q.title = e.target.value;
                                          setQids([...qids]);
                                        }}
                                      />
                                    </Form> :
                                    <Input
                                      className='qeditor-title-input-box'
                                      placeholder={q.type === 'comment' ? '内容' : '问题'}
                                      maxLength={QUESTION_TITLE_MAX_LENGTH}
                                      value={title}
                                      onChange={e => {
                                        q.title = e.target.value;
                                        setQids([...qids]);  // dirty way to make this part rerendered
                                      }}
                                    />
                                  }
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
      </Ref>
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
