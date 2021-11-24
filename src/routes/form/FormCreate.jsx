import React, { useState } from 'react';
import { Button, Container, Grid, Header, Icon, Input, Label, Radio, Segment, Sticky, Table } from 'semantic-ui-react';

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

class CheckboxQuestion {
  type = 'checkbox';
  options = [];
}

function useQState(props) {
  const [value, setValue] = useState(qMap[props.qid]);
  return [value, v => {
    qMap[props.qid] = v;
    setValue(v);
  }];
}

function RadioEditor(props) {
  const [value, setValue] = useQState(props);

  function addOption() {
    value.options.push(props.ctx.newOption());
    setValue(value);
  }

  return <>
    <Table className="no-table-border" basic="very" compact="very" collapsing>
      <Table.Body>
        {
          value.options.map(o => (
            <Table.Row key={o.id}>
              <Table.Cell collapsing>
                <Radio />
              </Table.Cell>
              <Table.Cell>
                <Input
                  size="small" placeholder="选项"
                  onChange={e => {
                    o.text = e.target.value;
                  }}
                />
              </Table.Cell>
            </Table.Row>
          ))
        }
      </Table.Body>
    </Table>
    <Button onClick={addOption}>
      添加选项
    </Button>
  </>;
}

// TODO: impl all types
const editorMap = {
  'radio': RadioEditor
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
    const body = {
      questions: qids.map(qid => qMap[qid])
    };
    const res = await api.form.create(title, body);
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
                    <Label key={l[0]} as="a" onClick={() => addQuestion(l[0])} style={{'margin': 3}}>
                      <Icon name={l[2]} />
                      {l[1]}
                    </Label>
                  ))}
                </Segment>
              </Sticky>
            </Grid.Column>
            <Grid.Column width={12}>
              <Input
                placeholder="问卷标题"
                value={title}
                onChange={e => {
                  const nv = e.target.value;
                  if (nv.length <= 200)
                    setTitle(nv);
                }}
              />
              <Button
                primary floated="right"
                onClick={onSubmit}
              >
                创建问卷
              </Button>
              {qids.map(qid => {
                const v = qMap[qid];
                const E = editorMap[v.type];
                return <Segment key={qid}>
                  <Input placeholder="问题" onChange={e => {
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
