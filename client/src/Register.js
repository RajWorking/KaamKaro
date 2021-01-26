import { useState } from 'react';
import Skills from './components/Skills';
import Edu from './components/Education';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const Register = ({ login, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [user_type, setUser_type] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState([]);
  const [addi_skills, setAddi_skills] = useState('');
  const [edu, setEdu] = useState(false);
  const [education, setEducation] = useState([]);

  const User_type_Change = (event) => {
    setUser_type(event.target.value);
  };

  const Add_Edu = (edu_instance) => {
    const { start_year, end_year, institute } = edu_instance;
    if (start_year === '' || institute === '') error('Where did you study? and when?');
    else if (end_year === '') setEducation(education.concat({ ...edu_instance, end_year: '----' }));
    else if (start_year < end_year) setEducation(education.concat(edu_instance));
    else error('Show me your time-machine.');
  };

  const Remove_Edu = (id) => {
    setEducation(
      Object.keys(education)
        .filter((key) => key !== id)
        .map((key) => education[key])
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    var res;
    if (user_type === 'recruiter') {
      res = await fetch('http://localhost:5000/api/recruiters/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          name: name,
          contact: contact,
          bio: bio,
        }),
      });
    } else if (user_type === 'applicant') {
      res = await fetch('http://localhost:5000/api/applicants/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          name: name,
          education: education,
          skills: addi_skills.length > 0 ? skills.concat(addi_skills.split(',')) : skills,
        }),
      });
    } else {
      error('What kind of user are you? Select a user type.');
      return;
    }

    const data = await res.json();
    if (res.status === 400) error(data.msg);
    else {
      setSkills([]);
      setAddi_skills('');
      setEducation([]);
      setBio('');
      setContact('');
      setEmail('');
      setPassword('');
      login({ key: data.token, type: data.type });
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} style={{ borderColor: 'green' }}>
      <h1 className="raj-center" style={{ color: 'grey' }}>
        Register Here!
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

      <RadioGroup aria-label="user_type" name="user_type1" value={user_type} onChange={User_type_Change}>
        <FormControlLabel value="applicant" control={<Radio />} label="Applicant" />
        <FormControlLabel value="recruiter" control={<Radio />} label="Recruiter" />
      </RadioGroup>
      <br />

      {user_type !== '' && (
        <TextField
          required
          id="outlined-required"
          label="Name"
          variant="outlined"
          value={name}
          onChange={(val) => setName(val.target.value)}
        />
      )}
      <br />

      {user_type === 'applicant' && (
        <>
          {Object.keys(education).map((obj, key) => (
            <i>
              ...at {education[key].institute} from {education[key].start_year} to {education[key].end_year}
              <IconButton aria-label="delete" onClick={() => Remove_Edu(obj)}>
                <DeleteIcon />
              </IconButton>
            </i>
          ))}

          <Edu open={edu} close={() => setEdu(false)} add={Add_Edu} />
          <Button variant="outlined" color="primary" onClick={() => setEdu(true)}>
            Add Education
          </Button>

          <Skills chip="Skills" Skill={skills} handleSkillChange={setSkills} />
          <br />

          <TextField
            id="outlined-required"
            label="Additional Skills"
            variant="outlined"
            value={addi_skills}
            onChange={(val) => setAddi_skills(val.target.value)}
          />
          <br />
        </>
      )}
      {user_type === 'recruiter' && (
        <>
          <TextField
            required
            id="outlined-required"
            label="Contact Number"
            variant="outlined"
            value={contact}
            onChange={(val) => setContact(val.target.value)}
          />
          <br />
          <TextField
            id="outlined-required"
            label="Bio"
            variant="outlined"
            value={bio}
            onChange={(val) => setBio(val.target.value)}
          />
        </>
      )}
      <br />

      <Button type="submit" variant="contained" color="primary">
        Register
      </Button>
      <a href="/" align="left">
        Back to Login
      </a>
      <br />

      <br />
    </form>
  );
};

export default Register;
