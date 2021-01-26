import Applicant from './Applicant/DashBoard';
import Recruiter from './Recruiter/DashBoard';
import JobApplications from './Recruiter/Applications'
import ErrMsg from './components/ErrorAlert';
import Login from './Login';
import Register from './Register';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'; // Redirect
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
        {(token === null || token.type === '') && <Redirect to="/login" />}
        {token?.type === 'recruiters' && <Recruiter error={Error} />}
        {token?.type === 'applicants' && <Applicant error={Error} />}
      </Route>

      <Route path="/register">
        {token === null || token.type === '' ? <Register error={Error} login={setToken} /> : <Redirect to="/" />}
      </Route>

      <Route path="/login">
        {token === null || token.type === '' ? <Login error={Error} login={setToken} /> : <Redirect to="/" />}
      </Route>

      <Route path="/applications/:id">{token?.type === 'recruiters' && <JobApplications error={error} />}</Route>

      {logout}
    </Router>
  );
}

export default App;
