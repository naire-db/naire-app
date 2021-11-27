import { Button, Form, Header, Modal } from 'semantic-ui-react';
import { useState } from 'react';

import api from 'api';
import { FORM_TITLE_MAX_LENGTH } from '../config';

function RetitleModal(props) {
  const {fid, form, onClosed} = props;
  const oldTitle = form.title;
  const [value, setValue] = useState('');

  async function onSubmit() {
    const v = value.trim();
    if (!v)
      return onClosed();
    const res = await api.form.save_title(fid, v);
    if (res.code !== 0)
      console.error(res);
    window.location.reload();
  }

  return (
    <Modal
      open={fid !== null}
      size='mini'
    >
      <Header>
        重命名问卷
        <Header.Subheader>
          {oldTitle}
        </Header.Subheader>
      </Header>
      <Modal.Content>
        <Modal.Description>
          输入新的问卷标题：
        </Modal.Description>
        <Form className='modal-input'>
          <Form.Input
            value={value}
            onChange={e => setValue(e.target.value)}
            maxLength={FORM_TITLE_MAX_LENGTH}
            placeholder={oldTitle}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content='取消'
          onClick={onClosed}
        />
        <Button
          primary
          content='保存'
          onClick={onSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default RetitleModal;
