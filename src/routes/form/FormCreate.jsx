import React, { useEffect, useState } from 'react';
import { Button, Grid, Header, Icon, Input, Label, Segment, Sticky, Transition } from 'semantic-ui-react';

import AppLayout from 'layouts/AppLayout';
import api, { api_unwrap } from 'api';

import { editorMap, nameMap, qMap, typeMap } from './types';
import { useErrorContext } from './errorContext';
import { FORM_TITLE_MAX_LENGTH, QUESTION_TITLE_MAX_LENGTH } from './config';

import './form.css';

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

function FormCreate() {
  const [nextQid, setNextQid] = useState(0);
  const [nextOid, setNextOid] = useState(0);
  const [qids, setQids] = useState([]);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const errorCtx = useErrorContext();

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
    if (!title.trim())
      return setTitleError(true);
    const body = {
      questions: qids.map(qid => {
        const q = qMap[qid];
        if (q.onSave)
          q.onSave();
        return q;
      })
    };
    api_unwrap(await api.form.create(title.trim(), body));
    window.qidsNonEmpty = window.titleNonEmpty = false;
    window.location = '/form/all';
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
                <Grid.Column width={13}>
                  <Input
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
                </Grid.Column>
                <Grid.Column width={3}>
                  <Button
                    primary floated='right'
                    onClick={onSubmit}
                    disabled={titleError || errorCtx.dirty()}
                  >
                    创建问卷
                  </Button>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Transition.Group duration={120}>
                    {qids.map(qid => {
                      const {type} = qMap[qid];
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
                                  onChange={e => {
                                    qMap[qid].title = e.target.value;
                                  }}
                                />
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

export default FormCreate;
