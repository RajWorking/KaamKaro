import { useState, useEffect } from 'react';
import useToken from '../useToken';
import Skills from '../components/Skills';
import Edu from '../components/Education';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const Profile = ({ error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [skills, setSkills] = useState([]);
  const [addi_skills, setAddi_skills] = useState('');
  const [edu, setEdu] = useState(false);
  const [education, setEducation] = useState([]);
  const [rating, setRating] = useState([]);

  const { token } = useToken();

  useEffect(() => {
    const getProfile = async () => {
      const res = await fetch('http://localhost:5000/api/applicants/profile', {
        headers: {
          'x-auth-token': token.key,
        },
      });
      const data = await res.json();

      if (res.status !== 400) {
        setEmail(data.email);
        setName(data.name);
        setEducation(data.education);
        setSkills(data.skills);
        setRating(data.avg_rating)
      } else error(data.msg);
    };
    getProfile();
  }, [error, token]);

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
    res = await fetch('http://localhost:5000/api/applicants/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token.key,
      },
      body: JSON.stringify({
        email: email,
        password: password,
        name: name,
        education: education,
        skills: addi_skills.length > 0 ? skills.concat(addi_skills.split(',')) : skills,
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
        label="Additional Skills"
        variant="outlined"
        value={addi_skills}
        onChange={(val) => setAddi_skills(val.target.value)}
      />
      <br />

      <TextField required label="Rating" variant="outlined" value={rating} disabled />
      <br />

      <Button type="submit" variant="contained" color="primary">
        Save
      </Button>
      <br />

      <br />
    </form>
  );
};

export default Profile;
