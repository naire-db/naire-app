import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form, Message } from 'semantic-ui-react';
import * as FileSaver from 'file-saver';

import api, { api_unwrap_fut } from 'api';
import CopyButton from 'components/CopyButton';
import { useAsyncResult } from 'utils';
import { formatTimestamp } from 'utils/render';

import { make_signed } from '../exchange';
import DetailLayout from './DetailLayout';


function FormTmplSettings() {
  const fid = parseInt(useParams().fid, 10);
  const form = useAsyncResult(async () => {
    const res = await api_unwrap_fut(api.tmpl.check_form(fid));
    return res;
  });

  const [exported, setExported] = useState(null);

  if (!form)
    return null;

  const {tmpl, updated} = form;

  async function create() {
    await api_unwrap_fut(api.tmpl.create(fid));
    window.location.reload();
  }

  async function update() {
    await api_unwrap_fut(api.tmpl.update(fid));
    window.location.reload();
  }

  async function remove() {
    await api_unwrap_fut(api.tmpl.remove(tmpl.id));
    window.location.reload();
  }

  function onExported() {
    const d = {title: form.title, body: form.body};
    make_signed(d);
    setExported(JSON.stringify(d));
  }

  function download() {
    const blob = new Blob([exported], {type: 'application/json'});
    FileSaver.saveAs(blob, form.title + '.json');
  }

  const msg = [];
  if (tmpl) {
    msg.push(`该问卷已被发布为模板，总计 ${tmpl.use_count} 次使用。`);
    if (updated !== undefined)
      msg.push('该问卷已于 ' + formatTimestamp(updated) + ' 被编辑。');
  } else
    msg.push('该问卷尚未被发布为模板。');

  return (
    <DetailLayout
      offset='tmpl' fid={fid} title={form.title}
      statsDisabled={!form.resp_count}
    >
      {msg.length === 1 ?
        <Message content={msg[0]} /> :
        <Message
          list={msg}
        />
      }
      <Form>
        <Form.Field
          label='模板选项'
          style={{
            marginBottom: 6
          }}
        />
        <Form.Group>
          {tmpl ?
            <>
              <Form.Button
                primary
                content='更新模板'
                disabled={updated === undefined}
                onClick={update}
              />
              <Form.Button
                negative
                content='撤下模板'
                onClick={remove}
              />
            </>
            :
            <Form.Button
              primary
              content='发布为模板'
              onClick={create}
            />
          }
        </Form.Group>
        {exported ? <>
          <Form.TextArea
            label='导出问卷'
            value={exported}
            style={{
              height: 200
            }}
          />
          <Form.Group>
            <CopyButton
              content={exported}
              btnProps={{
                style: {marginLeft: 8}
              }}
            />
            <Button
              icon='download'
              labelPosition='left'
              size='small'
              content='下载'
              style={{
                marginLeft: 10
              }}
              onClick={download}
            />
          </Form.Group>
        </> : <>
          <Form.Button
            label='导出问卷'
            content='导出问卷为 JSON'
            onClick={onExported}
          />
        </>
        }
      </Form>
    </DetailLayout>
  );

}

export default FormTmplSettings;
