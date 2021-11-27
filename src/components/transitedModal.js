import { Transition } from 'semantic-ui-react';

function ModalTransition(props) {
  const {open, duration, animation} = props;

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
