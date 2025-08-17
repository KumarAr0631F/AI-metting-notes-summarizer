import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router';
import Home from './pages/Home';
import Summary from './pages/Summary';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;