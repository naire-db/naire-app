import { useEffect, useRef } from 'react';
import { Button, Form, Header, Modal, Ref, TransitionablePortal } from 'semantic-ui-react';
import { action, makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';

import { resolvePossibleAction } from './index';

class ModalState {
  title = 'Title';
  subtitle = 'Subtitle';
  description = 'Description';
  content = null;
  open = false;
  size = 'mini';
  onCancelled = null;
  onConfirmed = null;
  confirmText = '确认';
  confirmProps = null;
  cancelText = '取消';
  noConfirm = false;
  inputProps = null;
  state = {};

  constructor() {
    makeAutoObservable(this);
  }


  update = action(o => {
    console.log('modal updated', o);
    Object.assign(this, o);
  });

  setOpen = action(v => {
    this.open = v;
  });

  setState = action(s => {
    this.state = s;
  });
}

const CommonModal = observer(props => {
  // TODO: handle pressing Enter

  const {state: modalState} = props;

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
              content={modalState.cancelText}
              onClick={modalState.onCancelled}
            />
            {!modalState.noConfirm &&
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
            }
          </Modal.Actions>
        </Modal>
      </TransitionablePortal>
    </Ref>
  );
});

function createModalHandle() {
  const modalState = new ModalState();

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
      cancelText = '取消',
      noConfirm = false,
      inputProps = null,

      initialState = null,
    }) {
    return new Promise(resolve => {
      modalState.update({
        title, subtitle, description, content, size, confirmText, confirmProps,
        cancelText, noConfirm,
        inputProps,
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

  return {
    modalState, closeModal, showModal
  };
}

const {modalState, closeModal, showModal} = createModalHandle();

export { CommonModal, modalState, showModal, closeModal, createModalHandle };
