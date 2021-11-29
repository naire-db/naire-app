import React from 'react';
import { useParams } from 'react-router-dom';
import { Form } from 'semantic-ui-react';

import DetailLayout from './DetailLayout';

function FormSettings() {
  const fid = parseInt(useParams().fid, 10);

  // TODO
  return (
    <DetailLayout offset='settings' fid={fid}>
      <Form>
        <Form.Input label='问卷标题' />

        <Form.Checkbox label='接受新答卷' />
        <Form.Group>
          <Form.Input type='datetime-local' label='该时间后开始接受答卷' />
          <Form.Input type='datetime-local' label='该时间后停止接受答卷' />
        </Form.Group>

        <Form.Input label='访问密码' />
        <Form.Checkbox label='仅登录用户可见' /> {/* 同时不允许匿名提交 */}
        <Form.Checkbox label='仅组织内用户可见' /> { /* a lot to do */}

        {/* if 仅登录用户可见 */}
        <Form.Group inline>
          <label>每用户填写次数</label>
          <Form.Radio
            label='不限制'
          />
          <Form.Radio
            label='仅一次'
          />
          <Form.Radio
            label='每日仅一次'
          />

          {/* if 每日仅一次' */}
          <Form.Input type='time' label='复位时间' />
        </Form.Group>

        <Form.Group inline>
          <label>每 IP 填写次数</label>
          {/* ditto */}
        </Form.Group>
        {
          /* 只用 localStorage，约束力低，暂缓
          <Form.Group inline>
            <label>每会话填写次数</label>
          </Form.Group>
           */
        }
        {
          /*
          <Form.TextArea label='提交成功提示信息' />
           */
        }
        {
          /*
          <Form.Checkbox label='允许复制' />
           */
        }
      </Form>
    </DetailLayout>
  );
}

export default FormSettings;
