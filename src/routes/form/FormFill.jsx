import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Grid, Header, Segment } from 'semantic-ui-react';

import AppLayout from 'layouts/AppLayout';
import api from 'api';
import { aMap, initialMap, viewMap } from './views';
import { useErrorContext } from './errorContext';

import './form.css';

function FormView(props) {
  const [tried, setTried] = useState(false);
  const errorCtx = useErrorContext();

  async function onSubmit() {
    if (errorCtx.dirty())
      return setTried(true);
    alert(JSON.stringify(aMap));

    /*
    if (!title.trim())
      return setTitleError(true);
    const body = {
      questions: qids.map(qid => qMap[qid])
    };
    const res = await api.form.create_resp(title.trim(), body);
    if (res.code === 0)
      window.location = '/form/all';
    else
      console.error(res);
     */
  }

  return <>
    <Header as='h2' textAlign='center'>
      <Header.Content>{props.title}</Header.Content>
    </Header>
    {
      props.body.questions.map(q => {
        const E = viewMap[q.type];
        return (
          <Segment key={q.id}>
            <Grid>
              <Grid.Row className='question-editor-meta-row'>
                <Grid.Column>
                  {q.title}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  {E && <E
                    question={q}
                    qid={q.id}
                    tried={tried}
                    useErrorFlag={errorCtx.createFlagHook(q.id)}
                    useErrorState={errorCtx.createStateHook(q.id)}
                  />  /* TODO: remove the check */}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        );
      })
    }
    <Container textAlign='center'>
      <Button
        primary
        onClick={onSubmit}
      >
        提交
      </Button>
    </Container>
    <Header>
      {JSON.stringify(props.body)}
    </Header>
  </>;
}

function FormFill() {
  const [detail, setDetail] = useState(null);
  const fid = parseInt(useParams().fid, 10);

  useEffect(() => {
    if (isNaN(fid))
      return window.location = '/';
    (async () => {
      const res = await api.form.get_detail(fid);
      if (res.code === 0) {
        for (const q of res.data.body.questions) {
          if (initialMap[q.type])  // TODO: drop checks
            aMap[q.id] = initialMap[q.type]();
        }
        setDetail(res.data);
      } else {
        // TODO: warn about unauthorized or nonexistent
        window.location = '/';
      }
    })();
  }, [fid]);  // TODO: fix the warning

  return (detail &&
    <AppLayout offset>
      <FormView fid={fid} {...detail} />
    </AppLayout>
  );
}

export default FormFill;
