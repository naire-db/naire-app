import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import filesize from 'filesize';

import { registerQuestionView, useAState } from './base';
import { QLabel } from './utils';
import api, { api_unwrap_fut } from 'api';

function formatBytes(size) {
  return filesize(size, {base: 2});
}

function FileQuestionView(props) {
  const q = props.question;
  const [file, setFile] = useAState(q);
  const {optional, max_size} = q;

  const [, setError] = props.useErrorState(() => !optional);

  if (!file)
    return <Button
      disabled
      content='未上传文件'
    />;

  if (file.length > 1) {
    const [token, filename, size] = file;
    return (
      <Button
        icon='download'
        labelPosition='left'
        content={`${filename} (${formatBytes(size)})`}
        href={api.file.file_url(token)}
        target='_blank'
      />
    );
  }

  return (
    <Form>
      <Form.Input
        label='上传文件'
        type='file'
        onChange={e => {
          const file = e.target.files[0];
          if (file) {
            setFile([file]);
            setError(file.size > max_size * 1024);
          } else {
            setFile([null]);
            setError(!optional);
          }
        }}
      />
      {optional && <QLabel
        text='可选'
      />}
      <QLabel
        text={`最大 ${formatBytes(max_size * 1024)}`}
        error={file[0] && file[0].size > max_size * 1024}
      />
    </Form>
  );
}

async function FileQuestionSaveHook([file]) {
  if (file) {
    const data = new FormData();
    data.append('file', file);
    return [await api_unwrap_fut(api.file.upload_file(data)), file.name, file.size];
  }
  return null;
}

registerQuestionView('file', FileQuestionView, () => [null], FileQuestionSaveHook);
