import { useEffect, useRef } from 'react';
import { Button, Form, Header, Modal, Ref, TransitionablePortal } from 'semantic-ui-react';
import { action, makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';

import { resolvePossibleAction } from './index';

const modalState = makeAutoObservable({
  title: 'Title',
  subtitle: 'Subtitle',
  description: 'Description',
  content: null,
  open: false,
  size: 'mini',
  onCancelled: null,
  onConfirmed: null,
  confirmText: '确认',
  confirmProps: null,
  inputProps: null,
  state: {},

  update: action(function (o) {
    console.log('modal updated', o);
    Object.assign(this, o);
  }),
  setOpen: action(function (v) {
    this.open = v;
  }),
  setState: action(function (s) {
    this.state = s;
  })
});

const CommonModal = observer(() => {
  // closeOnDimmerClick is somehow broken, so we do it on our own
  const ref = useRef();
  useEffect(() => {
    const {current: dim} = ref;
    if (dim) {
      const modal = dim.querySelector('.modal');
      if (modal) {
        const vis = new Map();

        function dimHandler(e) {
          if (!vis.get(e)) {
            modalState.onCancelled();
          }
        }

        function modalHandler(e) {
          vis.set(e, true);
        }

        dim.addEventListener('click', dimHandler);
        modal.addEventListener('click', modalHandler);
        return () => {
          dim.removeEventListener('click', dimHandler);
          modal.removeEventListener('click', modalHandler);
        };
      }
    }
  });
  return (
    <Ref innerRef={ref}>
      <TransitionablePortal
        open={modalState.open}
        transition={{
          animation: 'scale',
          duration: 150
        }}
      >
        <Modal
          open={true}
          size={modalState.size}
          onClose={modalState.onClosed}
        >
          <Header>
            {modalState.title}
            {modalState.subtitle &&
              <Header.Subheader>
                {modalState.subtitle}
              </Header.Subheader>
            }
          </Header>
          <Modal.Content>
            {modalState.description &&
              <Modal.Description>
                {modalState.description}
              </Modal.Description>
            }
            {modalState.content && resolvePossibleAction(modalState.content, modalState.state)}
            {modalState.inputProps && (
              <Form className='modal-input'>
                <Form.Input
                  {...modalState.inputProps}
                />
              </Form>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button
              content='取消'
              onClick={modalState.onCancelled}
            />
            <Button
              primary
              content={modalState.confirmText}
              onClick={modalState.onConfirmed}
              {...(
                modalState.confirmProps
                  ? resolvePossibleAction(modalState.confirmProps, modalState.state)
                  : {}
              )}
            />
          </Modal.Actions>
        </Modal>
      </TransitionablePortal>
    </Ref>
  );
});

function closeModal() {
  modalState.setOpen(false);
}

function showModal(
  {
    title,
    subtitle = null,
    description = null,
    content = null,
    size = 'mini',
    onCancelled = null,
    onConfirmed = null,
    confirmText = '确认',
    confirmProps = null,
    inputProps = null,

    initialState = null,
  }) {
  return new Promise(resolve => {
    modalState.update({
      title, subtitle, description, content, size, confirmText, confirmProps, inputProps,
      onConfirmed: onConfirmed ? () => {
        resolve(onConfirmed(modalState.state));
      } : () => {
        resolve(true);
        closeModal();
      },
      onCancelled: onCancelled ? () => {
        resolve(onCancelled(modalState.state));
      } : () => {
        resolve(false);
        closeModal();
      }
    });
    if (initialState)
      modalState.setState(resolvePossibleAction(initialState));
    modalState.setOpen(true);
  });
}

export { CommonModal, showModal, closeModal };
