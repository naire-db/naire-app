function unwrap_nullable(v, d) {
  return v === null ? d : v;
}

function makeRangeNumberInputProps(minValue, minSetter, minDefault, maxValue, maxSetter, maxDefault, setError) {
  function onMinChanged(v) {
    setError(unwrap_nullable(v, minDefault) > unwrap_nullable(maxValue, maxDefault));
    minSetter(v);
  }

  function onMaxChanged(v) {
    setError(unwrap_nullable(minValue, minDefault) > unwrap_nullable(v, maxDefault));
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

export { makeRangeNumberInputProps, unwrap_nullable };
