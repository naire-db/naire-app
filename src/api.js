const endpoint = 'http://localhost:8000';

class api {
  static async post(path, data) {
    const url = endpoint + path;
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: data === undefined ? undefined : JSON.stringify(data)
    };
    const resp = await fetch(url, options);
    const res = await resp.json();
    console.log('POST', path, 'with', data, 'resp', res);
    return res;
  }

  static async get(path) {
    const url = endpoint + path;
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    };
    const resp = await fetch(url, options);
    const res = await resp.json();
    console.log('GET', path, 'resp', res);
    return res;
  }

  static async login(username_or_email, password) {
    return await this.post('/auth/login/', {
      username_or_email, password
    });
  }
}

export default api;
