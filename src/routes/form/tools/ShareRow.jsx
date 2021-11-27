import React, { useState } from 'react';
import { Button, Form, Grid, Icon, Input, Message, Transition } from 'semantic-ui-react';

function ShareRow(props) {
  const {fid} = props;
  const [sharingSuccessToken, setSharingSuccessToken] = useState(null);

  async function copy() {
    const tk = Math.random();
    setSharingSuccessToken(tk);
    setTimeout(() => {
      setSharingSuccessToken(tk_cur => (tk === tk_cur ? null : tk_cur));
    }, 1000);
    await navigator.clipboard.writeText(window.sharingUrl);
  }

  return (
    <Transition visible={fid !== null} animation='fade' duration={80}>
      <Grid.Row>
        <Grid.Column>
          {
            fid !== null ?
              <Message success>
                <Message.Header>{'分享问卷：' + window.sharingFormTitle}</Message.Header>
                <Form className='share-link-form'>
                  <Form.Field inline>
                    <label>问卷地址：</label>
                    <Input
                      className='share-link-input'
                      size='small'
                      value={window.sharingUrl}
                    />
                    <Button
                      className='share-link-btn'
                      positive={sharingSuccessToken !== null}
                      icon labelPosition='left' size='small'
                      onClick={copy}
                    >
                      <Icon name={sharingSuccessToken === null ? 'copy' : 'checkmark'} />
                      复制
                    </Button>
                  </Form.Field>
                </Form>
              </Message> : <></>
          }
        </Grid.Column>
      </Grid.Row>
    </Transition>
  );
}

export default ShareRow;
