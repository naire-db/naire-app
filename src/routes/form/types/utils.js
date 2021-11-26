function makeRangeNumberInputProps(minValue, minSetter, minDefault, maxValue, maxSetter, maxDefault, flag) {
  function onMinChanged(v) {
    flag.set_to(v > maxValue);
    minSetter(v);
  }

  function onMaxChanged(v) {
    flag.set_to(minValue > v);
    maxSetter(v);
  }

  return [
    {
      min: minDefault,
      max: maxDefault,
      defaultValue: minDefault,
      value: minValue,
      onChanged: onMinChanged
    }, {
      min: minDefault,
      max: maxDefault,
      defaultValue: maxDefault,
      value: maxValue,
      onChanged: onMaxChanged
    }
  ];
}

export { makeRangeNumberInputProps };
