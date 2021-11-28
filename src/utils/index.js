import { useEffect, useState } from 'react';

function useAsyncResult(callback, deps) {
  const [res, setRes] = useState(null);
  useEffect(() => {
    (async () => {
      setRes(await callback());
    })();
  }, deps || []);
  return res;
}

export { useAsyncResult };
