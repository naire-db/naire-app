function get_invite_url(token) {
  return '/o/' + token;
}

function with_origin(path) {
  return window.location.origin + path;
}

export { get_invite_url, with_origin };
