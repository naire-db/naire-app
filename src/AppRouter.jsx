import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import api from 'api';
import appState from 'appState';

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

  return (
    <BrowserRouter>
      <Routes>
        {mount('/', () => import('routes/Home'))}
        {mount('/demo', () => import('routes/Demo'))}
        {mount('/login', () => import('routes/Login'))}
        {mount('/register', () => import('routes/Register'))}
        {mount('/profile', () => import('routes/Profile'))}
        {mount('/password', () => import('routes/Password'))}
        {mount('/form/all', () => import('routes/form/FormSet'))}
        {mount('*', () => import('routes/Home'))}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
