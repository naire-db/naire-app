import { Button, Header, Modal } from 'semantic-ui-react';

import api from 'api';

function RemoveModal(props) {
  const {fid, form, onClosed} = props;

  async function onSubmit() {
    const res = await api.form.remove(fid);
    if (res.code !== 0)
      console.error(res);
    window.location.reload();
  }

  // TODO: 回收站
  return (
    <Modal
      open={fid !== null}
      size='mini'
      onClose={onClosed}
    >
      <Header>
        删除问卷
        <Header.Subheader>
          {form?.title}
        </Header.Subheader>
      </Header>
      <Modal.Content>
        <Modal.Description>
          所有答卷将被同时删除！
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content='取消'
          onClick={onClosed}
        />
        <Button
          negative
          content='删除'
          onClick={onSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default RemoveModal;
