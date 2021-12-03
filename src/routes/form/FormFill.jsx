import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Grid, Header, Message, Modal, Segment } from 'semantic-ui-react';

import api from 'api';
import { useAsyncEffect } from 'utils';
import { redirect_login } from 'utils/url';
import { ModalTransition } from 'components/transitedModal';
import AppLayout from 'layouts/AppLayout';

import { aMap, initialMap, viewMap } from './views';
import { useErrorContext } from './errorContext';

import './form.css';

function QuestionView(props) {
  const q = props.question;
  const {tried, errorCtx} = props;

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
}

let failedPrompt = null;

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
    const {code} = await api.form.save_resp(props.fid, body);
    if (code === 0)
      setSubmitted(true);
    else
      failedPrompt = getErrorPrompt(code, true) + '。';
    setModalOpen(true);
  }

  return <>
    <Header as='h2' textAlign='center'>
      <Header.Content>{title}</Header.Content>
    </Header>
    {
      questions.map(q => (
        <QuestionView
          key={q.id}
          question={q}
          tried={tried}
          errorCtx={errorCtx}
        />
      ))
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
        header={failedPrompt ? '提交失败' : '提交成功'}
        content={failedPrompt || '答卷已提交。'}
        actions={[{key: 0, content: '完成', positive: !failedPrompt, onClick: onModalClosed}]}
        onClose={onModalClosed}
      />
    </ModalTransition>
  </>;
}

function getErrorPrompt(code, step) {
  switch (code) {
    case api.ERR_AUTH_REQUIRED:
      return '需要登录后访问';
    case api.ERR_EXPIRED:
      return '该问卷已停止接受答卷';
    case api.ERR_DENIED:
      return '当前没有访问该问卷的权限';
    case api.ERR_LIMITED:
      return '该问卷的填写次数已达上限';
    default:
      if (code !== api.ERR_FAILURE)
        console.error('code unexpected', code);
      return step ? '该问卷已过期' : '该问卷不存在或已过期';
  }
}

function FormFill() {
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);
  const fid = parseInt(useParams().fid, 10);

  useAsyncEffect(async () => {
    const res = await api.form.get_detail(fid);
    const {code, data} = res;
    if (code === 0) {
      for (const q of data.body.questions) {
        if (initialMap[q.type])  // TODO: drop checks
          aMap[q.id] = initialMap[q.type]();
      }
      console.log('got details', JSON.stringify(res.data));
      setDetail(data);
    } else if (code === api.ERR_AUTH_REQUIRED)
      redirect_login();
    else
      setError(getErrorPrompt(code));
  });

  if (error)
    return (
      <AppLayout offset>
        <Message
          error
          icon='warning circle'
          header={error + '。'}
        />
      </AppLayout>
    );

  return (detail &&
    <AppLayout offset>
      <FormView fid={fid} title={detail.title} body={detail.body} />
    </AppLayout>
  );
}

export default FormFill;
export { QuestionView, aMap };
