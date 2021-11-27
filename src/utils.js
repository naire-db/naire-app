import { useEffect, useState } from 'react';

function useField(checker, initialValue = '', errorPosition = 'bottom') {
  const [value, setValue] = useState(initialValue);
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
        const v = checker(value);
        setError(v);
        return v === null;
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
    },
    toProps() {
      return {
        value: value,
        onChange: this.handler,
        error: this.renderError()
      };
    },
    visuallyValid() {
      return error === undefined || error === null;
    }
  };
}

function checkUsername(v) {
  if (!v)
    return '用户名不能为空';
  if (!/^[0-9a-zA-Z_.\-@]*$/.test(v))
    return '用户名只能包含字母（a-z，A-Z）、数字（0-9）和下划线（_）';
  if (v.length > 140)
    return '用户名最多包含 140 个字符';
  return null;
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function checkEmail(v) {
  if (!v)
    return '';
  if (!validateEmail(v))
    return '邮箱地址格式错误';
  if (v.length > 250)
    return '邮箱地址最多包含 250 个字符';
  return null;
}

function checkDname(v) {
  if (!v)
    return '';
  if (v.length > 120)
    return '显示名称最多包含 120 个字符';
  return null;
}

function checkPassword(v) {
  return v ? null : '';
}

function validateFields(...fields) {
  return fields.map(f => f.validate()).every(t => t);
}

function useAsyncResult(callback, deps) {
  const [res, setRes] = useState(null);
  useEffect(() => {
    (async () => {
      setRes(await callback());
    })();
  }, deps || []);
  return res;
}

export { useField, checkUsername, checkPassword, checkEmail, checkDname, validateFields, useAsyncResult };
