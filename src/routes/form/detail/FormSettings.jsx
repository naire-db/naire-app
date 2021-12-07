import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import * as dayjs from 'dayjs';

import api, { api_unwrap_fut } from 'api';
import NavButton from 'components/NavButton';
import { useAsyncResult } from 'utils';

import { PASSPHRASE_MAX_LENGTH } from '../config';
import DetailLayout from './DetailLayout';

function fromTimestamp(v) {
  return v === null ? '' : dayjs.unix(v).format().slice(0, 16);
}

function toTimestamp(v) {
  return v ? dayjs(v).unix() : null;
}

function LimitField(props) {
  const {label, value, setValue, setTime} = props;
  const [v, time] = value;

  return <>
    <Form.Field
      style={{
        marginBottom: -2
      }}
    >
      <label>{label}</label>
    </Form.Field>
    <Form.Group inline>
      <Form.Radio
        label='不限制'
        value={0}
        checked={v === 0}
        onChange={() => setValue(0)}
      />
      <Form.Radio
        label='仅一次'
        value={1}
        checked={v === 1}
        onChange={() => setValue(1)}
      />
      <Form.Radio
        label='每日仅一次'
        value={2}
        checked={v === 2}
        onChange={() => setValue(2)}
        style={{
          marginRight: 15
        }}
      />

      <div style={{
        opacity: v === 2 ? 100 : 0
      }}>
        <Form.Input
          type='time' label='复位时间'
          size='mini'
          style={{
            width: 150,
            marginLeft: 5
          }}
          value={time}
          onChange={(e, d) => {
            console.log('time changed', d, props.value);
            setTime(d.value);
          }}
        />
      </div>
    </Form.Group>
  </>;
}

let old = null;

function FormSettings() {
  const fid = parseInt(useParams().fid, 10);
  const [vs, setValues_] = useState(null);
  const res = useAsyncResult(async () => {
    const res = await api_unwrap_fut(api.form.get_form_settings(fid));
    const {form, settings: v} = res;
    old = v;
    v.title = form.title;
    if (v.passphrase === null)
      v.passphrase = '';
    v.publish_time = fromTimestamp(v.publish_time);
    v.unpublish_time = fromTimestamp(v.unpublish_time);
    console.log(v);
    setValues_(v);
    return res;
  });

  if (!res)
    return null;

  async function save() {
    const v = {...vs};
    if (!v.title.trim())
      v.title = old.title;
    v.passphrase = v.passphrase.trim() || null;
    v.publish_time = toTimestamp(v.publish_time);
    v.unpublish_time = toTimestamp(v.unpublish_time);
    await api_unwrap_fut(api.form.save_form_settings(fid, v));
    window.location.reload();
  }

  function set(key, val) {
    const nv = {
      ...vs,
      [key]: val
    };
    if (nv.member_required)
      nv.login_required = true;
    setValues_(nv);
  }

  const ltValid = !vs.published && vs.publish_time;
  const lts = ltValid ? dayjs(vs.publish_time).valueOf() : -Infinity;
  const rts = vs.unpublish_time ? dayjs(vs.unpublish_time).valueOf() : Infinity;
  const timeConflictError = lts > rts;
  const nts = new Date().getTime();
  const ltError = !!(ltValid && (timeConflictError || lts < nts));
  const rtError = !!(vs.unpublish_time && (timeConflictError || rts < nts));

  console.log(lts, rts, nts, ltError, rtError, vs);

  const {form, org_name} = res;

  return (
    <DetailLayout
      offset='settings' fid={fid} title={form.title}
      statsDisabled={!form.resp_count}
    >
      <Form>
        <Form.Input
          label='问卷标题'
          placeholder={old.title}
          value={vs.title}
          onChange={(e, d) => set('title', d.value)}
        />

        <Form.Checkbox
          label='接受新答卷'
          checked={vs.published}
          onChange={(e, d) => set('published', d.checked)}
        />
        <Form.Group>
          <Form.Input
            type='datetime-local'
            label='该时间后开始接受答卷'
            disabled={vs.published}
            error={ltError}
            value={vs.publish_time}
            onChange={(e, d) =>
              set('publish_time', d.value)
            }
          />
          <Form.Input
            type='datetime-local'
            label='该时间后停止接受答卷'
            error={rtError}
            value={vs.unpublish_time}
            onChange={(e, d) =>
              set('unpublish_time', d.value)
            }
          />
        </Form.Group>

        <Form.Input
          label='访问密码'
          maxLength={PASSPHRASE_MAX_LENGTH}
          placeholder='留空表示不设置'
          value={vs.passphrase}
          onChange={(e, d) => set('passphrase', d.value)}
        />
        <Form.Checkbox
          label='仅登录用户可见'
          checked={vs.login_required}
          disabled={vs.member_required}
          onChange={(e, d) => set('login_required', d.checked)}
        /> {/* 同时不允许匿名提交 */}
        {org_name !== null &&
          <Form.Checkbox
            label={`仅组织 ${org_name} 的成员可见`}
            checked={vs.member_required}
            onChange={(e, d) => set('member_required', d.checked)}
          />
          /* 仅当 folder 属于 org 时可用，隐含上一项 */
        }

        {/* if 仅登录用户可见 */}
        {vs.login_required &&
          <LimitField
            label='每用户作答次数'
            value={[vs.user_limit, vs.user_limit_reset_time]}
            setValue={v => set('user_limit', v)}
            setTime={v => set('user_limit_reset_time', v)}
          />
        }

        <LimitField
          label='每 IP 作答次数'
          value={[vs.ip_limit, vs.ip_limit_reset_time]}
          setValue={v => set('ip_limit', v)}
          setTime={v => set('ip_limit_reset_time', v)}
        />

        {/*
          <Form.TextArea label='提交成功提示信息' />
          <Form.Checkbox label='允许复制' />
          */
        }

        <NavButton
          primary
          content='保存'
          onClick={save}
        />
      </Form>
    </DetailLayout>
  );
}

export default FormSettings;
