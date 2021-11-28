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

export { useAsyncResult };
