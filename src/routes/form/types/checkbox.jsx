import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Radio, Table } from 'semantic-ui-react';

import { BaseQuestion, registerQuestionType, useQState } from './base';
import NumberInput from 'components/NumberInput';
import { makeRangeNumberInputProps } from './utils';

class CheckboxQuestion extends BaseQuestion {
  type = 'checkbox';
  min_choices = null;
  max_choices = null;

  constructor(id, ctx) {
    super(id);
    this.options = [ctx.newOption()];
  }

  onSave() {
    if (this.min_choices === null)
      this.min_choices = 0;
    if (this.max_choices === null)
      this.max_choices = this.options.length;
  }

  afterLoad() {
    if (this.max_choices === this.options.length)
      this.max_choices = null;
  }
}

function CheckboxOptionTable(props) {
  const {options, setOptions} = props;
  const [checkedOid, setCheckedOid] = useState(null);

  function addOption() {
    options.push(props.ctx.newOption());
    setOptions(options);
  }

  function removeOption(oid) {
    for (let i = 0; i < options.length; ++i)
      if (options[i].id === oid) {
        console.log('rm', i, oid, 'from', options);
        options.splice(i, 1);
        setOptions([...options]);
        break;
      }
  }

  return (
    <Table className='no-table-border' basic='very' compact='very' collapsing>
      <Table.Body>
        {
          options.map((o, ind) => (
            <Table.Row key={o.id}>
              <Table.Cell>
                {
                  props.radio ?
                    <Radio
                      checked={o.id === checkedOid}
                      onChange={() => {
                        setCheckedOid(o.id);
                      }}
                    /> : <Checkbox />
                }
              </Table.Cell>
              <Table.Cell>
                <Input
                  size='small' placeholder='选项'
                  value={o.text}
                  onChange={e => {
                    o.text = e.target.value;
                    setOptions([...options]);
                  }}
                />
              </Table.Cell>
              <Table.Cell>
                {
                  options.length > 1 &&
                  <Button
                    icon='delete' size='mini'
                    onClick={() => {
                      removeOption(o.id);
                    }}
                    style={{marginRight: 5}}
                  />
                }
                {
                  ind === options.length - 1 &&
                  <Button
                    primary icon='add' size='mini'
                    onClick={addOption}
                  />
                }
              </Table.Cell>
            </Table.Row>
          ))
        }
      </Table.Body>
    </Table>
  );
}

function CheckboxEditor(props) {
  const [options, setOptions] = useQState('options', props);
  const [minChoices, setMinChoices] = useQState('min_choices', props);
  const [maxChoices, setMaxChoices] = useQState('max_choices', props);
  const [error, setError] = props.useErrorState();
  const [minProps, maxProps] = makeRangeNumberInputProps(
    minChoices, setMinChoices, 0, maxChoices, setMaxChoices, options.length, setError
  );

  return <>
    <CheckboxOptionTable
      options={options}
      setOptions={setOptions}
      ctx={props.ctx}
    />
    <Form>
      <Form.Group widths='equal'>
        <NumberInput
          label='最小选择数量'
          error={error}
          {...minProps}
        />
        <NumberInput
          label='最大选择数量'
          error={error}
          {...maxProps}
          nullable
        />
      </Form.Group>
    </Form>
  </>;
}

registerQuestionType('checkbox', CheckboxQuestion, CheckboxEditor);

export {
  CheckboxQuestion, CheckboxEditor, CheckboxOptionTable
};
