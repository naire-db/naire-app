import { useEffect, useState } from 'react';
import FlagStore from 'stores/flags';

function makeErrorContext() {
  const flags = new FlagStore();
  return {
    errorFlags: flags,

    useErrorFlag(props, initial) {
      const flag = flags.make(props.qid);
      useEffect(() => {
        flag.set_to(typeof initial === 'function' ? initial() : initial);
      }, []);
      return flag;
    },

    useErrorState(props, initial) {
      const flag = flags.make(props.qid);
      const [state, setState] = useState(() => {
        const v = typeof initial === 'function' ? initial() : initial;
        flag.set_to(v);
        return v;
      });
      return [state, nv => {
        flag.set_to(nv);
        setState(nv);
      }];
    }
  };
}

export default makeErrorContext;
