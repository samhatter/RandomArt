import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Art from './pages/Art'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element = {<Art />} />
      </Routes>
    </Router>
  );
}

export default App