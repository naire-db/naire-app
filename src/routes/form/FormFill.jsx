import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Form, Grid, Header, Image, Message, Modal, Segment } from 'semantic-ui-react';

import api, { api_unwrap } from 'api';
import { resolvePossibleAction, useAsyncEffect } from 'utils';
import { redirect_login } from 'utils/url';
import { showModal } from 'utils/modal';
import { ModalTransition } from 'components/transitedModal';
import AppLayout from 'layouts/AppLayout';

import { aMap, beforeSaveHookMap, initialMap, viewMap } from './views';
import { useErrorContext } from './errorContext';
import { PASSPHRASE_MAX_LENGTH } from './config';

import './form.css';

function QuestionView(props) {
  const q = props.question;
  const {tried, errorCtx} = props;

  const E = viewMap[q.type];

  async function openImage(iid) {
    await showModal({
      title: '查看图片',
      size: 'small',
      cancelText: '关闭',
      noConfirm: true,
      content() {
        const src = api.file.image_url(iid);
        return <Image
          size='huge'
          src={src}
          href={src}
          target='_blank'
        />;
      },
    });
  }

  return (
    <Segment key={q.id}>
      <Grid>
        <Grid.Row className='question-editor-meta-row'>
          <Grid.Column>
            {q.title}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className='question-image-group-row' style={{
          marginTop: -16
        }}>
          <Grid.Column>
            <Image.Group size='small'>
              {q.images?.map(iid => (
                <Image
                  key={iid}
                  bordered rounded
                  src={api.file.image_url(iid)}
                  as='a' href='#'
                  onClick={() => openImage(iid)}
                />
              ))}
            </Image.Group>
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
    const answers = [];
    for (const q of questions) {
      let v = aMap[q.id];
      const fn = beforeSaveHookMap[q.type];
      if (fn)
        v = await fn(v);
      answers.push(v);
    }
    const body = {answers};
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
    {questions.length ?
      questions.map(q => (
        <QuestionView
          key={q.id}
          question={q}
          tried={tried}
          errorCtx={errorCtx}
        />
      )) :
      <Message
        content='该问卷暂时没有题目。'
        size='large'
      />
    }
    <Container textAlign='center' style={{
      marginTop: 25
    }}>
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
    case api.ERR_BAD_PASSPHRASE:
      return '访问该问卷需要提供密码';
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
    let res = await api.form.get_detail(fid);

    if (res.code === api.ERR_BAD_PASSPHRASE) {
      await showModal({
        title: '需要密码',
        content: s => (
          <Form error={s.fail}>
            <Form.Input
              type='password'
              value={s.value}
              onChange={(e, d) => (s.value = d.value)}
              maxLength={PASSPHRASE_MAX_LENGTH}
            />
            <Message
              error
              content='密码错误'
            />
          </Form>
        ),
        confirmProps: s => ({
          disabled: !s.value.trim()
        }),
        onConfirmed: async (s, close) => {
          res = await api.form.get_detail(fid, s.value.trim());
          if (res.code === api.ERR_BAD_PASSPHRASE)
            s.fail = true;
          else
            close();
        },
        initialState: {
          value: '',
          fail: false
        },
        closeOnDimmerClick: false
      });
    }

    const {code, data} = res;
    if (code === 0) {
      for (const q of data.body.questions)
        if (initialMap[q.type])  // TODO: drop checks
          aMap[q.id] = resolvePossibleAction(initialMap[q.type]);
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

  if (!detail)
    return <AppLayout />;

  return (detail &&
    <AppLayout offset>
      <FormView fid={fid} title={detail.title} body={detail.body} />
    </AppLayout>
  );
}

async function loadResp(fid, rid, {body: {questions}}) {
  const {answers} = api_unwrap(await api.form.get_resp_detail(fid, rid)).body;
  for (let i = 0; i < answers.length; ++i)
    aMap[questions[i].id] = answers[i];
}

function loadBareForm({body: {questions}}) {
  for (const q of questions)
    aMap[q.id] = resolvePossibleAction(initialMap[q.type]);
}

export default FormFill;
export { QuestionView, loadResp, loadBareForm };
