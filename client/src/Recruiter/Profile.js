import { useState, useEffect } from 'react';
import useToken from '../useToken';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const Profile = ({ error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [contact, setContact] = useState('');
  const { token } = useToken();

  useEffect(() => {
    const getProfile = async () => {
      const res = await fetch('http://localhost:5000/api/recruiters/profile', {
        headers: {
          'x-auth-token': token.key,
        },
      });
      const data = await res.json();

      if (res.status !== 400) {
        setEmail(data.email);
        setName(data.name);
        setBio(data.bio);
        setContact(data.contact);
      } else error(data.msg);
    };
    getProfile();
  }, [error, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    var res;
    res = await fetch('http://localhost:5000/api/recruiters/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token.key,
      },
      body: JSON.stringify({
        email: email,
        password: password,
        name: name,
        contact: contact,
        bio: bio,
      }),
    });

    const data = await res.json();
    if (res.status === 400) error(data.msg);
  };

  return (
    <form disabled className="form" onSubmit={handleSubmit} style={{ borderColor: 'green' }}>
      <br />
      <TextField
        required
        label="Email"
        type="email"
        variant="outlined"
        value={email}
        onChange={(val) => setEmail(val.target.value)}
      />
      <br />
      <TextField
        required
        label="Password"
        type="password"
        autoComplete="current-password"
        variant="outlined"
        value={password}
        onChange={(val) => setPassword(val.target.value)}
      />
      <br />
      <TextField required label="Name" variant="outlined" value={name} onChange={(val) => setName(val.target.value)} />
      <br />

      <TextField
        required
        id="outlined-required"
        label="Contact Number"
        variant="outlined"
        value={contact}
        onChange={(val) => setContact(val.target.value)}
      />
      <br />
      <TextField id="outlined-required" label="Bio" variant="outlined" value={bio} onChange={(val) => setBio(val.target.value)} />

      <br />
      <Button type="submit" variant="contained" color="primary">
        Save
      </Button>

      <br />
    </form>
  );
};

export default Profile;
