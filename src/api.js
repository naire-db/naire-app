// TODO: change in production environment
// const entry = 'http://localhost:8000';
const entry = window.location.protocol + '//' + window.location.hostname + ':8000';

function api_unwrap(res) {
  if (res.code !== 0) {
    console.error('api unwrap failed', res);
    return null;
  }
  return res.data;
}

async function api_unwrap_fut(fut) {
  return api_unwrap(await fut);
}

async function api_fetch(path, options) {
  const {method, body} = options;
  if (body === undefined)
    console.log(`${method}ing ${path}`);
  else
    console.log(`${method}ing ${path} with ${body}`);
  const resp = await fetch(entry + path, options);
  if (!resp.ok) {
    console.error('bad api fetch', path, resp);
    throw new Error(`API ${path}: ${resp.status} ${resp.statusText}`);
  }
  const res = await resp.json();
  console.log(`${method} ${path} responded ${JSON.stringify(res)}`);
  return res;
}

class Api {
  ERR_FAILURE = 1;
  ERR_AUTH_REQUIRED = 2;
  ERR_DUPL_USERNAME = 3;
  ERR_DUPL_EMAIL = 4;

  async post(path, data) {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: data === undefined ? undefined : JSON.stringify(data),
      credentials: 'include',
    };
    return await api_fetch(path, options);
  }

  async get(path) {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      credentials: 'include',
    };
    return await api_fetch(path, options);
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

    // Folder stuff

    get_overview: () => this.get('/form/get_overview/'),

    get_folder_all: folder_id =>
      this.post('/form/get_folder_all/', {
        folder_id
      }),

    create_folder: name =>
      this.post('/form/create_folder/', {
        name
      }),

    rename_folder: (folder_id, name) =>
      this.post('/form/rename_folder/', {
        folder_id, name
      }),

    remove_folder: folder_id =>
      this.post('/form/remove_folder/', {
        folder_id
      }),

    move_to_folder: (fid, folder_id) =>
      this.post('/form/move_to_folder/', {
        fid, folder_id
      }),

    copy: (fid, folder_id, title) =>
      this.post('/form/copy/', {
        fid, folder_id, title
      })
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

  // draft
  org = {
    get_joined: () =>
      this.get('/org/get_joined/'),

    create: name =>
      this.post('/org/create/', {
        name
      }),

    // ERR_FAILURE: token expired
    check_invite_token: token =>
      this.post('/org/check_invite_token/', {
        token
      }),

    // ERR_FAILURE: token expired
    accept_invite: token =>
      this.post('/org/accept_invite/', {
        token
      }),

    // 400 when user is the only owner
    leave: oid =>
      this.post('/org/leave/', {
        oid
      }),

    // Following operations require that the user owns the Org

    get_members: oid =>
      this.post('/org/get_members/', {
        oid
      }),

    refresh_invite_token: oid =>
      this.post('/org/refresh_invite_token/', {
        oid
      }),

    dissolve: oid =>
      this.post('/org/dissolve/', {
        oid
      }),

    rename: (oid, name) =>
      this.post('/org/name/', {
        oid, name
      }),

    // 400 when uid is of the user
    remove_member: (uid, oid) =>
      this.post('/org/remove_member/', {
        uid, oid
      }),

    // 400 when uid is of the user
    change_role: (role, uid, oid) =>
      this.post('/org/change_role/', {
        role, uid, oid
      }),
  };
}

const api = new Api();

export default api;
export { api_unwrap, api_unwrap_fut };
