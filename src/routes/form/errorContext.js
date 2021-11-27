import { useEffect, useState } from 'react';
import { Set } from 'immutable';

function is_fn(maybe_fn) {
  return typeof maybe_fn === 'function';
}

class SimpleErrorContext {
  constructor(tokens, setTokens) {
    this.tokens = tokens;
    this.setTokens = setTokens;
  }

  count() {
    return this.tokens.size;
  }

  clean() {
    return this.tokens.size === 0;
  }

  dirty() {
    return this.tokens.size !== 0;
  }

  createFlag(token) {
    const that = this;
    return {
      set: () => that.setTokens(tokens => tokens.add(token)),
      unset: () => that.setTokens(tokens => tokens.delete(token)),
      get: () => that.tokens.has(token),
      set_to: v => {
        console.log('set to', v);
        if (v)
          that.setTokens(tokens => tokens.add(token));
        else
          that.setTokens(tokens => tokens.delete(token));
      }
    };
  }

  createFlagHook(token) {
    return initial_or_fn => {
      const flag = this.createFlag(token);
      useEffect(() => {
        flag.set_to(is_fn(initial_or_fn) ? initial_or_fn() : initial_or_fn);
      }, []);
      return flag;
    };
  }

  _createStateHook(token) {
    return initial_or_fn => {
      const flag = this.createFlag(token);
      const [state, setState] = useState(() => {
        const v = is_fn(initial_or_fn) ? initial_or_fn() : initial_or_fn;
        flag.set_to(v);
        return v;
      });
      return [state, maybe_fn => {
        setState(v => {
          const nv = is_fn(maybe_fn) ? maybe_fn(v) : maybe_fn;
          flag.set_to(nv);
          return nv;
        });
      }];
    };
  }

  createStateHook(token) {
    return initial_or_fn => {
      const flag = this.createFlag(token);
      useEffect(() => {
        flag.set_to(is_fn(initial_or_fn) ? initial_or_fn() : initial_or_fn);
      }, []);
      const v = flag.get();
      return [v, maybe_fn => {
        const nv = is_fn(maybe_fn) ? maybe_fn(v) : maybe_fn;
        flag.set_to(nv);
      }];
    };
  }
}

function useErrorContext() {
  const [state, setState] = useState(() => ({
    d: Set()
  }));
  return new SimpleErrorContext(state.d, f => setState(s => ({
    d: f(s.d)
  })));
}

const pass = () => undefined;

function useDummyErrorContext() {
  return {
    createFlag() {
      return {
        set: pass,
        unset: pass,
        get: pass,
        set_to: pass
      };
    },

    createFlagHook() {
      return () => this.createFlag();
    },

    createStateHook() {
      return () => [false, pass];
    }
  };
}

export { useErrorContext, useDummyErrorContext };
