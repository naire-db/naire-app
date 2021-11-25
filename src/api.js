const entry = 'http://localhost:8000';  // TODO: change in production environment

class Api {
  ERR_FAILURE = 1;
  ERR_AUTH_REQUIRED = 2;
  ERR_DUPL_USERNAME = 3;
  ERR_DUPL_EMAIL = 4;

  ERR_PASSWORD_RESET_MISMATCH = 6;

  async post(path, data) {
    console.log('POSTing', path, 'with', data);
    const url = entry + path;
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: data === undefined ? undefined : JSON.stringify(data),
      credentials: 'include',
    };
    const resp = await fetch(url, options);
    const res = await resp.json();
    console.log('POST', path, 'with', data, 'resp', res);
    return res;
  }

  async get(path) {
    const url = entry + path;
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      credentials: 'include',
    };
    const resp = await fetch(url, options);
    const res = await resp.json();
    console.log('GET', path, 'resp', res);
    return res;
  }

  login = (username_or_email, password) =>
    this.post('/auth/login/', {
      username_or_email, password
    });

  logout = () => this.get('/auth/logout/');

  user_info = () => this.get('/auth/info/');

  register = (username, email, password, dname) =>
    this.post('/auth/register/', {
      username, email, password, dname
    });

  form = {
    get_all: () => this.get('/form/get_all/'),

    create: (title, body) =>
      this.post('/form/create/', {
        title, body
      })
  };

  user = {
    save_profile: (email, dname) =>
      this.post('/auth/save_profile/', {
        email, dname
      }),

    change_password: (password, new_password) =>
      this.post('/auth/change_password', {
        password, new_password
      })
  };
}

const api = new Api();

export default api;
