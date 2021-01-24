import Dashboard from './components/Applicant';
import ErrMsg from './components/ErrorAlert';
import Login from './Login';
import { BrowserRouter as Router, Route } from 'react-router-dom'; // Redirect
import { useState } from 'react';

import useToken from './useToken';

function App() {
  const [error, setError] = useState('');
  const { token, setToken } = useToken();

  const Error = (msg) => {
    setError(msg);
  };
  const unshow = () => {
    setError('');
  };

  let logout = <br />;
  if (token?.type) {
    logout = (
      <a href="/" className="raj-center" onClick={() => setToken({ type: '' })}>
        LOGOUT
      </a>
    );
  }

  return (
    <Router>
        <h1 className="raj-center">Job Application Portal</h1>
        <ErrMsg handleClose={unshow} msg={error} />
        <Route path="/" exact>
          {token?.type ? (
            <Dashboard error={Error} />
          ) : (
            <Login error={Error} login={setToken} />
          )}
        </Route>
        {logout}
    </Router>
  );
}

export default App;
