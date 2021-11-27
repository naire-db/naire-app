import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Grid, Header, Modal, Segment } from 'semantic-ui-react';

import AppLayout from 'layouts/AppLayout';
import { ModalTransition } from 'components/transitedModal';
import api from 'api';

import { aMap, initialMap, viewMap } from './views';
import { useErrorContext } from './errorContext';

import './form.css';

function FormView(props) {
  const [tried, setTried] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const errorCtx = useErrorContext();
  const {title} = props;
  const {questions} = props.body;
  const onModalClosed = () => setModalOpen(false);

  async function onSubmit() {
    if (errorCtx.dirty())
      return setTried(true);
    const body = {
      answers: questions.map(q => aMap[q.id])
    };
    const res = await api.form.save_resp(props.fid, body);
    if (res.code !== 0)
      return console.error(res);
    // window.location = '/';
    setSubmitted(true);
    setModalOpen(true);
  }

  return <>
    <Header as='h2' textAlign='center'>
      <Header.Content>{title}</Header.Content>
    </Header>
    {
      questions.map(q => {
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
        disabled={submitted}
        onClick={onSubmit}
      >
        提交
      </Button>
    </Container>
    <ModalTransition open={modalOpen}>
      <Modal
        open={modalOpen}
        size='mini'
        header='提交成功'
        content='答卷已提交。'
        actions={[{key: 0, content: '完成', positive: true, onClick: onModalClosed}]}
        onClose={onModalClosed}
      />
    </ModalTransition>
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
        console.log('got details', JSON.stringify(res.data));
        setDetail(res.data);
      } else {
        // TODO: warn about unauthorized or nonexistent
        window.location = '/';
      }
    })();
  }, [fid]);  // TODO: fix the warning

  return (detail &&
    <AppLayout offset>
      <FormView fid={fid} title={detail.title} body={detail.body} />
    </AppLayout>
  );
}

export default FormFill;
