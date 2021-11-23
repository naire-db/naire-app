import { makeAutoObservable } from 'mobx'

function get_persist_store(key) {
  const v = localStorage.getItem(key);
  if (v === null)
    return null;
  return JSON.parse(v);
}

const appState = makeAutoObservable({
  user_info: get_persist_store('user_info')
});

export default appState;
