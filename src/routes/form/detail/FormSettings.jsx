import React from 'react';
import { useParams } from 'react-router-dom';

import DetailLayout from './DetailLayout';
import { Form } from 'semantic-ui-react';

function FormSettings() {
  const fid = parseInt(useParams().fid, 10);

  // TODO
  return (
    <DetailLayout offset='settings' fid={fid}>
      <Form>
        <Form.Checkbox label='接受新答卷' />
        <Form.Group>
          <Form.Input type='datetime-local' label='该时间后开始接受答卷' />
          <Form.Input type='datetime-local' label='该时间后停止接受答卷' />
        </Form.Group>

        <Form.Input label='访问密码' />
        <Form.Checkbox label='仅登录用户可见' />
        <Form.Checkbox label='仅组织内用户可见' />
      </Form>
    </DetailLayout>
  );
}

export default FormSettings;
