const endpoint = 'http://localhost:8000';

class Api {
  ERR_FAILURE = 1;
  ERR_AUTH_REQUIRED = 2;
  ERR_DUPL_USERNAME = 3;
  ERR_DUPL_EMAIL = 4;

  async post(path, data) {
    console.log('POSTing', path, 'with', data);
    const url = endpoint + path;
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
    const url = endpoint + path;
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
}

const api = new Api();

export default api;
