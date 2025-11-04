import { BrowserRouter, Routes, Route } from 'react-router-dom';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>HOLA!</div>} />
      </Routes>
    </BrowserRouter>
  );
};
