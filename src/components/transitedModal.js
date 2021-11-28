import { Transition } from 'semantic-ui-react';

function ModalTransition(props) {
  const {open, duration, animation} = props;

  // TODO: use transited portal?
  return (
    <Transition
      unmountOnHide
      visible={open}
      duration={duration || 100}
      animation={animation || 'fade'}
    >
      {props.children}
    </Transition>
  );
}

export { ModalTransition };
