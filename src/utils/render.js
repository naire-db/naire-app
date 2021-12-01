function formatTimestamp(ts) {
  const dt = new Date(ts * 1000);
  return dt.toLocaleString();
}

function formatUser(user) {
  if (user === null)
    return '未登录';
  const {username, dname} = user;
  if (username === dname)
    return username;
  return `${dname} (${username})`;
}

export { formatTimestamp, formatUser };
