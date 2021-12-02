import React from 'react';
import { Form, Grid, Input, Message, Transition } from 'semantic-ui-react';

import CopyButton from 'components/CopyButton';

function ShareRow(props) {
  const {fid} = props;

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
                    <CopyButton
                      content={window.sharingUrl}
                      btnProps={{
                        className: 'share-link-btn'
                      }}
                    />
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
