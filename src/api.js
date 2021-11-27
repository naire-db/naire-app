const entry = 'http://localhost:8000';  // TODO: change in production environment

function api_unwrap(res) {
  console.log('unwrapping res', res);
  if (res.code !== 0) {
    console.error(res);
    return null;
  }
  return res.data;
}

class Api {
  ERR_FAILURE = 1;
  ERR_AUTH_REQUIRED = 2;
  ERR_DUPL_USERNAME = 3;
  ERR_DUPL_EMAIL = 4;

  async post(path, data) {
    console.log('POSTing', path, 'with', JSON.stringify(data));
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
    console.log('POST', path, 'with', JSON.stringify(data), 'resp', JSON.stringify(res));
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
      }),

    /*
     Following operations requires user's READ permission on the Form
     TODO: Before we work on Form visibility, this means no permission limitations
     */

    get_detail: fid =>
      this.post('/form/get_detail/', {
        fid
      }),

    save_resp: (fid, resp_body) =>
      this.post('/form/save_resp/', {
        fid, resp_body
      }),

    /*
     Following operations requires user's MODIFY permission on the Form
     TODO: Before we work on Orgs, this simply means current user is the owner of the Form
     */

    /*
     (We assume) requests from our frontend never violate the permission limits or access a
     nonexistent Form id, so the backend should simply return HTTP 403 / 404 to an API abuser
     rather than choose from our predefined code.
     (get_detail is an exception since the Form url can be shared randomly)
     */

    save_title: (fid, title) =>
      this.post('/form/save_title/', {
        fid, title
      }),

    // Following 2 operations will remove all the existing responses of the form at the same time

    change_body: (fid, body) =>
      this.post('/form/change_body/', {
        fid, body
      }),

    remove: fid =>
      this.post('/form/remove/', {
        fid
      }),

    // For owner showing details

    get_form_resps: fid =>
      this.post('/form/get_form_resps/', {
        fid
      }),

    get_form_stats: fid =>
      this.post('/form/get_form_stats/', {
        fid
      }),

    get_resp_detail: (fid, rid) =>
      this.post('/form/get_resp_detail/', {
        fid, rid
      }),

    remove_resp: (fid, rid) =>
      this.post('/form/remove_resp/', {
        fid, rid
      }),
  };

  user = {
    save_profile: (email, dname) =>
      this.post('/auth/save_profile/', {
        email, dname
      }),

    change_password: (password, new_password) =>
      this.post('/auth/change_password/', {
        password, new_password
      })
  };
}

const api = new Api();

export default api;
export { api_unwrap };
