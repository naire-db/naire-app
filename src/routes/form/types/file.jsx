import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, Form, Input, Ref } from 'semantic-ui-react';

import { BaseQuestion, registerQuestionType, useQState } from './base';
import ExtensionDropdown from './ExtensionDropdown';

const units = [
  {keys: 'kib', text: 'KiB', value: 'kib'},
  {keys: 'mib', text: 'MiB', value: 'mib'}
];

const MAX_SIZE_MB = 50;
const MAX_SIZE_KB = 1024;

class FileQuestion extends BaseQuestion {
  type = 'file';

  extensions = [];
  max_size = null;  // in MiB
  optional = true;

  is_mb = true;

  onSave() {
    if (this.is_mb) {
      if (this.max_size === null)
        this.max_size = MAX_SIZE_MB;
      this.max_size *= 1024;
    } else if (this.max_size === null)
      this.max_size = MAX_SIZE_KB;
    this.is_mb = undefined;
  }
}

function FileSizeInput(props) {
  const sizeLabel =
    <Dropdown
      className='size-dd'
      options={units}
      defaultValue='mib'
    />;

  function FileSizeInput(props) {
    return <Input
      label={
        sizeLabel
      }
      labelPosition='right'
      {...props}
    />;
  }

  return <Input
    label={
      sizeLabel
    }
    labelPosition='right'
    {...props}
  />;
}

function FileQuestionEditor(props) {
  const [extensions, setExtensions] = useQState('extensions', props);
  const [maxSize, setMaxSize] = useQState('max_size', props);
  const [optional, setOptional] = useQState('optional', props);

  const [, setIsMb] = useQState('is_mb', props);

  const [unit, setUnit] = useState('mib');
  const [optionalToggle, setOptionalToggle] = useState(false);

  //const [maxSize, setMaxSize] = useState('');

  function ExtensionControl(props) {
    return <ExtensionDropdown
      value={extensions}
      onChanged={setExtensions}
      {...props}
    />;
  }

  function setOptionalWrapper() {
    setOptionalToggle(!optionalToggle);
    setOptional(optionalToggle);
  }

  const formRef = useRef();
  useEffect(() => {
    if (formRef.current) {
      const dd = formRef.current.querySelector('.size-dd');
      if (dd) {
        const handler = e => {
          const nextUnit = e.target.innerText === 'MiB' ? 'mib' : 'kib';
          if (unit !== nextUnit) {
            setUnit(nextUnit);
            setIsMb(nextUnit === 'mib');
          }
        };
        dd.addEventListener('click', handler);
        return () => dd.removeEventListener('click', handler);
      }
    }
  });

  return <Ref innerRef={formRef}>
    <Form>
      <Form.Field
        width={5}
        label='文件大小限制'
        placeholder={unit === 'mib' ? String(MAX_SIZE_MB) : String(MAX_SIZE_KB)}
        control={FileSizeInput}
        value={maxSize === null ? '' : maxSize}
        type='number'
        onChange={e => {
          let value = parseInt(e.target.value, 10);
          if (isNaN(value))
            value = null;
          else if (unit === 'mib') {
            value = value > MAX_SIZE_MB ? MAX_SIZE_MB : value <= 0 ? 1 : value;
          } else {
            value = value > MAX_SIZE_KB ? MAX_SIZE_KB : value <= 0 ? 1 : value;
          }
          setMaxSize(value);
        }}
      />
      <Form.Field
        label='文件扩展名'
        control={ExtensionControl}
      />
      <Form.Checkbox
        toggle
        label='必须上传'
        onChange={setOptionalWrapper}
      />
    </Form>
  </Ref>;
}

registerQuestionType('file', FileQuestion, FileQuestionEditor);

export { FileQuestion, FileQuestionEditor };
