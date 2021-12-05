import React from 'react';
import { Message } from 'semantic-ui-react';

import AppLayout from 'layouts/AppLayout';

function getContent(props) {
  const {resp, error} = props;
  if (resp) {
    switch (resp.status) {
      case 403:
        return '当前没有访问该页面的权限。';
      case 400:
      case 404:
        return '未找到该页面。';
      default:
        return resp.statusText;
    }
  }
  const s = String(error);
  if (s.includes('Failed to fetch'))
    return '无法连接到服务器。';
  return s;
}

function ErrorFallback(props) {
  return (
    <AppLayout offset>
      <Message
        error
        size='large'
        icon='warning circle'
        header='错误'
        content={getContent(props)}
      />
    </AppLayout>
  );
}

export default ErrorFallback;
