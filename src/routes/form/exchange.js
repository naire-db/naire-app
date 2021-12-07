import hash from 'object-hash';

function get_hash(form) {
  const d = JSON.parse(JSON.stringify(form));
  const h = hash(d, {
    respectType: false,
    respectFunctionNames: false,
    respectFunctionProperties: false,
  });
  return h;
}

function make_signed(form) {
  const h = get_hash(form);
  form.hash = h;
  return form;
}

function consume_signed(form) {
  const h = form.hash;
  delete form.hash;
  return get_hash(form) === h;
}

export { make_signed, consume_signed };
