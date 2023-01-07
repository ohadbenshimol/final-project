import './App.less';
import NxWelcome from './nx-welcome';

import { Route, Routes, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function App() {
  const [tickets, setTickets] = useState();

  useEffect(() => {
    fetch('/api')
      .then((t) => t.json())
      // .then(console.log)
      .then((m: any) => setTickets(m.message));
  }, []);

  return (
    <>
      {tickets}
      <NxWelcome title="client" />
      <div />
    </>
  );
}

export default App;
