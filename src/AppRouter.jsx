import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import api from 'api';
import appState from 'appState';
import { CommonModal } from './utils/modal';

function make_lazy(f) {
  const E = lazy(f);
  return (
    <Suspense fallback={<div />}>
      <E />
    </Suspense>
  );
}

function mount(path, f) {
  return <Route path={path} element={make_lazy(f)} />;
}

function AppRouter() {
  console.log('Rendering router');

  useEffect(() => {
    (async () => {
      console.log('old user info', appState.user_info);
      const res = await api.user_info();
      if (res.code === 0) {
        appState.user_info = res.data;
        localStorage.setItem('user_info', JSON.stringify(res.data));
      } else {
        appState.user_info = null;
        localStorage.removeItem('user_info');
      }
      console.log('new user info', appState.user_info);
    })();
  }, []);

  return <>
    <BrowserRouter>
      <Routes>
        {mount('/', () => import('routes/Home'))}
        {mount('/demo', () => import('routes/Demo'))}
        {mount('/login', () => import('routes/Login'))}
        {mount('/register', () => import('routes/Register'))}

        {mount('/user/profile', () => import('routes/user/Profile'))}
        {mount('/user/password', () => import('routes/user/ChangePassword'))}
        {mount('/user/orgs', () => import('routes/user/UserOrgs'))}
        {mount('/user/logs', () => import('routes/user/UserLogs'))}

        {mount('/org/:oid/members', () => import('routes/org/OrgMembers'))}
        {mount('/org/:oid/profile', () => import('routes/org/OrgProfile'))}
        {mount('/o/:token', () => import('routes/org/OrgInvitation'))}

        {mount('/form/all', () => import('routes/form/set/FormSet'))}
        {mount('/form/create', () => import('routes/form/FormCreate'))}
        {mount('/form/:fid/edit', () => import('routes/form/FormEdit'))}
        {mount('/form/:fid/resps', () => import('routes/form/detail/FormResps'))}
        {mount('/form/:fid/stats', () => import('routes/form/detail/FormStats'))}
        {mount('/form/:fid/settings', () => import('routes/form/detail/FormSettings'))}
        {mount('/f/:fid', () => import('routes/form/FormFill'))}
        {mount('*', () => import('routes/Home'))}
      </Routes>
    </BrowserRouter>
    <CommonModal />
  </>;
}

export default AppRouter;
