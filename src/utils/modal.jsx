import { useEffect, useRef } from 'react';
import { Button, Form, Header, Modal, Ref, TransitionablePortal } from 'semantic-ui-react';
import { action, makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';

import { resolvePossibleAction } from './index';
import NavButton from '../components/NavButton';

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
  confirmNav = false;
  cancelText = '取消';
  cancelProps = null;
  noConfirm = false;
  buttons = null;

  inputProps = null;
  closeOnDimmerClick = true;

  state = {};
  resolve = null;

  constructor() {
    makeAutoObservable(this);
  }

  start = action((props, initialState, resolve) => {
    Object.assign(this, props);
    if (initialState)
      this.state = resolvePossibleAction(initialState);
    this.resolve = resolve;
    this.open = true;
  });

  stop = action(v => {
    this.open = false;
    this.resolve?.(v);
  });
}

const CommonModal = observer(props => {
  // TODO: handle pressing Enter

  const {state: modalState} = props;
  const {closeOnDimmerClick, buttons} = modalState;

  // closeOnDimmerClick is somehow broken, so we do it on our own
  const ref = useRef();
  useEffect(() => {
    if (!closeOnDimmerClick)
      return;
    const {current: dim} = ref;
    if (dim) {
      const modal = dim.querySelector('.modal');
      if (modal) {
        const vis = new Map();

        function dimHandler(e) {
          // XXX: Closed directly without calling onCancelled, which can be unwanted.
          if (!vis.get(e))
            modalState.onCancelled();
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

  let actions;
  if (buttons && modalState.open) {
    const btns = resolvePossibleAction(buttons, modalState.state, modalState.stop);
    if (btns.length)
      actions = <Modal.Actions>
        {btns.map((props, i) => <Button key={i} {...props} />)}
      </Modal.Actions>;
    else
      actions = null;
  } else {
    let confirm;
    if (modalState.noConfirm)
      confirm = null;
    else {
      const E = modalState.confirmNav ? NavButton : Button;
      confirm = <E
        primary
        content={modalState.confirmText}
        onClick={modalState.onConfirmed}
        {...(
          modalState.open && modalState.confirmProps
            ? resolvePossibleAction(modalState.confirmProps, modalState.state)
            : {}
        )}
      />;
    }

    actions = <Modal.Actions>
      <Button
        content={modalState.cancelText}
        onClick={modalState.onCancelled}
        {...(
          modalState.open && modalState.cancelProps
            ? resolvePossibleAction(modalState.cancelProps, modalState.state)
            : {}
        )}
      />
      {confirm}
    </Modal.Actions>;
  }

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
            {modalState.open && modalState.content
              && resolvePossibleAction(modalState.content, modalState.state)}
            {modalState.inputProps && (
              <Form className='modal-input'>
                <Form.Input
                  {...modalState.inputProps}
                />
              </Form>
            )}
          </Modal.Content>
          {actions}
        </Modal>
      </TransitionablePortal>
    </Ref>
  );
});

function createModalHandle() {
  const modalState = new ModalState();

  function closeModal(v) {
    modalState.stop(v);
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
      confirmNav = false,
      cancelText = '取消',
      cancelProps = null,
      noConfirm = false,
      buttons = null,

      inputProps = null,
      closeOnDimmerClick = true,

      initialState = null,
    }) {
    return new Promise(resolve => {
      const n = {
        title, subtitle, description, content, size,
        confirmText, confirmProps, confirmNav,
        cancelText, cancelProps, noConfirm, buttons,
        inputProps, closeOnDimmerClick,
        onConfirmed: onConfirmed ? () => {
          onConfirmed(modalState.state, closeModal);
        } : () => {
          closeModal(true);
        },
        onCancelled: onCancelled ? () => {
          onCancelled(modalState.state, closeModal);
        } : () => {
          closeModal(false);
        }
      };
      modalState.start(n, initialState, resolve);
    });
  }

  return {
    modalState, closeModal, showModal
  };
}

const {modalState, closeModal, showModal} = createModalHandle();

export { CommonModal, modalState, showModal, closeModal, createModalHandle };
