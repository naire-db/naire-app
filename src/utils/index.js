import { useEffect, useState } from 'react';

function useAsyncResult(callback, deps = [], initial = null) {
  const [res, setRes] = useState(initial);
  useEffect(() => {
    (async () => {
      setRes(await callback());
    })();
  }, deps);
  return res;
}

function useAsyncEffect(callback, deps = []) {
  useEffect(() => {
    callback();
  }, deps);
}

function resolvePossibleAction(value_or_fn, ...args) {
  return typeof value_or_fn === 'function' ? value_or_fn(...args) : value_or_fn;
}

export { useAsyncResult, useAsyncEffect, resolvePossibleAction };
