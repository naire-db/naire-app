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

function int_or_null(x) {
  const r = parseInt(x, 10);
  return isNaN(r) ? null : r;
}

export { useAsyncResult, useAsyncEffect, resolvePossibleAction, int_or_null };
