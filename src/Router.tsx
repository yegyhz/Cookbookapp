import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import RecipeDetail from './components/RecipeDetail';
import HomePage from './HomePage';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="recipe/:recipeId" element={<RecipeDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;