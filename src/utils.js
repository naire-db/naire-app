import { useState } from 'react';

function useField(checker, errorPosition = 'bottom') {
  const [value, setValue] = useState('');
  const [error, setError] = useState(undefined);
  return {
    value, error,
    handler(e) {
      const v = e.target.value;
      setValue(v);
      setError(checker(v));
    },
    validate() {
      if (error === undefined) {
        setError(checker(value));
        return false;
      }
      return error === null;
    },
    renderError() {
      if (error === null || error === undefined)
        return null;
      if (!error)
        return true;
      return {
        'content': error,
        'position': errorPosition
      };
    }
  };
}

export { useField };
