import Applicant from './Applicant/DashBoard';
import Recruiter from './Recruiter/DashBoard';
import ErrMsg from './components/ErrorAlert';
import Login from './Login';
import { BrowserRouter as Router } from 'react-router-dom'; // Redirect
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

      {(token?.type === '' || token === null) && <Login error={Error} login={setToken} />}
      {token?.type === 'applicants' && <Applicant error={Error} />}
      {token?.type === 'recruiters' && <Recruiter error={Error} />}

      {logout}
    </Router>
  );
}

export default App;
