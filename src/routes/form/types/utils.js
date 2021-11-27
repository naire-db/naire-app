function makeRangeNumberInputProps(minValue, minSetter, minDefault, maxValue, maxSetter, maxDefault, setError) {
  function onMinChanged(v) {
    setError(v > maxValue);
    minSetter(v);
  }

  function onMaxChanged(v) {
    setError(minValue > v);
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
