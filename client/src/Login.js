import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useState } from 'react';

const Login = ({ login, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const data = await res.json();
    if (res.status === 200) {
      login({key: data.token, type: data.type});
    } 
    else error(data.msg);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1 className="raj-center" style={{ color: 'grey' }}>
        Login Page
      </h1>
      <h2>Email</h2>
      <TextField
        required
        id="outlined-required"
        label="Email"
        variant="outlined"
        value={email}
        onChange={(val) => setEmail(val.target.value)}
      />
      <h2>Password</h2>
      <TextField
        id="outlined-password-input"
        required
        label="Password"
        type="password"
        autoComplete="current-password"
        variant="outlined"
        value={password}
        onChange={(val) => setPassword(val.target.value)}
      />
      <br />
      <Button type="submit" variant="contained" color="primary">
        SIGN IN
      </Button>
      <a href="/" align="left">First time here?</a>
      <br />

      <br />
    </form>
    //   <form>
    //     <h1>Hello</h1>
    //     <p>Enter your name:</p>
    //     <input type="text" />
    //   </form>
  );
};

export default Login;
