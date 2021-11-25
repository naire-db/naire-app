import React, { useState } from 'react';
import { Button, Checkbox, Input, Radio, Table } from 'semantic-ui-react';

import { BaseQuestion, registerQuestionType, useQState } from './base';

class CheckboxQuestion extends BaseQuestion {
  type = 'checkbox';

  constructor(id, ctx) {
    super(id);
    console.log('ctx', ctx);
    this.options = [ctx.newOption()];
  }
}

function CheckboxEditor(props) {
  const [options, setOptions] = useQState('options', props);
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

  return <>
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
                  onChange={e => {
                    o.text = e.target.value;
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
  </>;
}

registerQuestionType('checkbox', CheckboxQuestion, CheckboxEditor);

export { CheckboxQuestion, CheckboxEditor };
