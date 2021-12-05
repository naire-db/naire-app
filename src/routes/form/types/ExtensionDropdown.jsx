import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const options = [
  {key: 'mp4', text: '.mp4', value: 'mp4'},
  {key: 'jpg', text: '.jpg', value: 'jpg'},
  {key: 'jpeg', text: '.jpeg', value: 'jpeg'},
  {key: 'png', text: '.png', value: 'png'},
  {key: 'txt', text: '.txt', value: 'txt'},
  {key: 'json', text: '.json', value: 'json'},
  {key: 'pdf', text: '.pdf', value: 'pdf'}
];

function ExtensionDropdown(props) {
  const {value, onChanged} = props;

  function handleChange(_, d) {
    onChanged(d.value);
  }

  function handleAddition(_, d) {
    const key = d.value;
    if (/^\.?[a-zA-Z0-9_]*$/.test(d.value)) {
      options.push({key, text: key, value: key});
      onChanged([key, ...value]);
    }
  }

  return (
    <Dropdown
      options={options}
      placeholder='留空表示接受任意扩展名'
      search
      selection
      fluid
      multiple
      allowAdditions
      value={value}
      onAddItem={handleAddition}
      onChange={handleChange}
      onSearchChange={e => {
        if (!(/^\.?[a-zA-Z0-9_]*$/.test(e.target.value))) {
          console.log('tried');
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    />
  );
}

export default ExtensionDropdown;
