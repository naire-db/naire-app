import { useEffect, useState } from 'react';

function useAsyncResult(callback, deps = [], initial = null) {
  const [res, setRes] = useState(initial);
  useEffect(() => {
    callback()
      .then(setRes)
      .catch(e => {
        console.error('Caught in async hook: ', e);
        /* setRes(() => {
          throw e;
        }); */
      });
  }, deps);
  return res;
}

function useAsyncEffect(callback, deps = []) {
  useEffect(() => {
    callback()
      .catch(e => {
        console.error('Caught in async hook: ', e);
      });
  }, deps);
}

function resolvePossibleAction(value_or_fn, ...args) {
  return typeof value_or_fn === 'function' ? value_or_fn(...args) : value_or_fn;
}

function int_or_null(x) {
  const r = parseInt(x, 10);
  return isNaN(r) ? null : r;
}

export { useAsyncResult, useAsyncEffect, resolvePossibleAction, int_or_null };
