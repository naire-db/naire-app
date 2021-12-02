function redirect_login() {
  window.location = '/login?r=' + decodeURIComponent(window.location.pathname);
}

function get_invite_url(token) {
  return '/o/' + token;
}

function with_origin(path) {
  return window.location.origin + path;
}

export { redirect_login, get_invite_url, with_origin };
