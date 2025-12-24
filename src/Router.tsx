import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import RecipeDetail from './components/RecipeDetail';
import HomePage from './HomePage';
import Intro from './components/Intro';
import DashboardWrapper from './layouts/DashboardWrapper';

const PrintLayoutWrapper = lazy(() => import('./layouts/PrintLayoutWrapper'));

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Intro />} />
          <Route path="dashboard" element={<DashboardWrapper />}>
            <Route index element={<HomePage />} />
            <Route path="categories" element={<HomePage />} />
            <Route path="list" element={<HomePage />} />
            <Route path="recipe/:recipeId" element={<RecipeDetail />} />
          </Route>
          <Route path="print" element={
            <Suspense fallback={<div className="p-10 text-center">Loading Print View...</div>}>
              <PrintLayoutWrapper />
            </Suspense>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;