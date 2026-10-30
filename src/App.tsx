import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
