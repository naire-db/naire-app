import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

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
  return (
    <BrowserRouter>
      <Routes>
        {mount('/', () => import('routes/Home'))}
        {mount('/demo', () => import('routes/Demo'))}
        {mount('/login', () => import('routes/Login'))}
        {mount('*', () => import('routes/Home'))}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
