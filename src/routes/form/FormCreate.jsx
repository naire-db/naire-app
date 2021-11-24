import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Container,
  Grid,
  Header,
  Icon,
  Input,
  Label,
  Radio,
  Segment,
  Sticky,
  Table
} from 'semantic-ui-react';

import AppLayout from 'layouts/AppLayout';
import api from 'api';

const qMap = {};

class Option {
  text = '';

  constructor(id) {
    this.id = id;
  }
}

class BaseQuestion {
  title = '';

  constructor(id) {
    this.id = id;
  }
}

class RadioQuestion extends BaseQuestion {
  type = 'radio';

  constructor(id, ctx) {
    super(id);
    this.options = [ctx.newOption()];
  }
}

class CheckboxQuestion extends RadioQuestion {
  type = 'checkbox';
}

function useQState(key, props) {
  const [value, setValue] = useState(qMap[props.qid][key]);
  return [value, v => {
    qMap[props.qid][key] = v;
    setValue(v);
  }];
}

function CheckboxEditor(props) {
  const [options, setOptions] = useQState('options', props);
  const [checkedOid, setCheckedOid] = useState(null);

  function addOption() {
    options.push(props.ctx.newOption());
    setOptions(options);
  }

  function removeOption(oid) {
    for (let i = 0; i < options.length; ++i)
      if (options[i].id === oid) {
        console.log('rm', i, oid, 'from', options);
        options.splice(i, 1);
        setOptions([...options]);
        break;
      }
  }

  return <>
    <Table className='no-table-border' basic='very' compact='very' collapsing>
      <Table.Body>
        {
          options.map((o, ind) => (
            <Table.Row key={o.id}>
              <Table.Cell>
                {
                  props.radio ?
                    <Radio
                      checked={o.id === checkedOid}
                      onChange={() => {
                        setCheckedOid(o.id);
                      }}
                    /> : <Checkbox />
                }
              </Table.Cell>
              <Table.Cell>
                <Input
                  size='small' placeholder='选项'
                  onChange={e => {
                    o.text = e.target.value;
                  }}
                />
              </Table.Cell>
              <Table.Cell>
                {
                  options.length > 1 ?
                    <Button
                      icon='delete' size='mini'
                      onClick={() => {
                        removeOption(o.id);
                      }}
                      style={{marginRight: 5}}
                    /> : null
                }
                {
                  ind === options.length - 1 ?
                    <Button
                      primary icon='add' size='mini'
                      onClick={addOption}
                    /> : null
                }
              </Table.Cell>
            </Table.Row>
          ))
        }
      </Table.Body>
    </Table>
  </>;
}

function RadioEditor(props) {
  return <CheckboxEditor radio {...props} />;
}

// TODO: impl all types
const editorMap = {
  'radio': RadioEditor,
  'checkbox': CheckboxEditor
};

const typeMap = {
  'radio': RadioQuestion,
  'checkbox': CheckboxQuestion
};

const qTypes = [
  ['radio', '单选题', 'radio'],
  ['checkbox', '多选题', 'checkmark box'],
  ['input', '填空题', 'text cursor'],
  ['text', '简答题', 'file text'],
  ['dropdown', '下拉列表', 'dropdown'],
  ['file', '文件上传', 'file']
];

function FormCreate() {
  const [nextQid, setNextQid] = useState(0);
  const [nextOid, setNextOid] = useState(0);
  const [qids, setQids] = useState([]);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);

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
    const v = qMap[qid] = new typeMap[type](qid, ctx);
    v.id = qid;
  }

  async function onSubmit() {
    if (!title.trim())
      return setTitleError(true);
    const body = {
      questions: qids.map(qid => qMap[qid])
    };
    const res = await api.form.create(title.trim(), body);
    if (res.code === 0)
      window.location = '/form/all';
    else
      console.error(res);
  }

  return (
    <AppLayout>
      <Container style={{marginTop: '5.5em'}}>
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
              <Input
                error={titleError}
                placeholder='问卷标题'
                value={title}
                onChange={e => {
                  setTitleError(false);
                  const nv = e.target.value;
                  if (nv.length <= 200)
                    setTitle(nv);
                }}
              />
              <Button
                primary floated='right'
                onClick={onSubmit}
              >
                创建问卷
              </Button>
              {qids.map(qid => {
                const E = editorMap[qMap[qid].type];
                return <Segment key={qid}>
                  <Input placeholder='问题' onChange={e => {
                    qMap[qid].title = e.target.value;
                  }} />
                  <E qid={qid} ctx={ctx} />
                </Segment>;
              })}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </AppLayout>
  );
}

export default FormCreate;
