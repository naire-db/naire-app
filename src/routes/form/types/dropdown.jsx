import React from 'react';
import { Button, Dropdown, Form, TextArea } from 'semantic-ui-react';

import { showModal } from 'utils/modal';
import { BaseQuestion, registerQuestionType, useQState } from './base';

class DropdownQuestion extends BaseQuestion {
  type = 'dropdown';

  constructor(id, ctx) {
    super(id);
    const o = ctx.newOption();
    o.text = '选项 1';
    this.options = [o];
    this._selectedKey = o.id;
  }

  afterLoad() {
    this._selectedKey = this.options[0].id;
  }

  onSave() {
    this._selectedKey = undefined;
  }
}

function DropdownQuestionEditor(props) {
  const [options, setOptions] = useQState('options', props);
  const [selectedKey, setSelectedKey] = useQState('_selectedKey', props);

  async function onEdit() {
    const defaultValue = options.map(o => o.text).join('\n');
    await showModal({
      title: '编辑选项',
      closeOnDimmerClick: false,
      size: 'small',
      content: s => {
        return <>
          <Form>
            <TextArea
              rows={10}
              value={s.value}
              onChange={(e, {value}) => (s.value = value)}
            />
          </Form>
          <p style={{marginTop: 15}}>
            输入格式为一行一个选项。
          </p>
        </>;
      },
      confirmText: '保存',
      onConfirmed(s, close) {
        const lines = s.value
          .split('\n')
          .map(s => s.trim())
          .filter(s => s);
        console.log('lines', lines);
        // Calling newOption for multiple times before next render is not supported
        const opts = props.ctx.makeOptions(lines);
        setOptions(opts);
        setSelectedKey(opts[0].id);
        close();
      },
      confirmProps: s => ({
        disabled: !s.value.trim()
      }),
      initialState: {
        value: defaultValue,
      }
    });
  }

  return <>
    <Dropdown
      size='large'
      selection
      options={options.map(({id, text}) => ({
        key: id,
        value: id,
        text
      }))}
      value={selectedKey}
      onChange={(e, {value}) => setSelectedKey(value)}
      style={{
        width: '50%',
        marginRight: 20
      }}
    />
    <Button
      content='编辑选项'
      onClick={onEdit}
    />
  </>;
}

registerQuestionType('dropdown', DropdownQuestion, DropdownQuestionEditor);

export { DropdownQuestion, DropdownQuestionEditor };
