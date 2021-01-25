import { useState } from 'react';
import Calendar from '../components/Calendar';
import Skills from '../components/Skills';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const AddJob = ({ onSubmit }) => {
  const classes = useStyles();

  const [title, setTitle] = useState('');
  const [max_applications, setMax_applications] = useState('');
  const [max_positions, setMax_positions] = useState('');
  const [salary, setSalary] = useState('');
  const [job_type, setJob_type] = useState('');
  const [duration, setDuration] = useState('');
  const [deadline, setDeadline] = useState(new Date('2022-01-01T21:11:54'));
  const [req_skills, setReq_skills] = useState([]);
  const [addi_skills, setAddi_skills] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    onSubmit({
      title: title,
      max_applications: max_applications,
      max_positions: max_positions,
      salary: salary,
      job_type: job_type,
      duration: duration,
      deadline: deadline,
      req_skills: req_skills.concat(addi_skills.split(',')),
    });
    setTitle('');
    setMax_applications('');
    setMax_positions('');
    setSalary('');
    setJob_type('');
    setDuration('');
    setDeadline(new Date('2022-01-01T21:11:54'));
    setReq_skills([])
    setAddi_skills('')
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <br />
      <TextField
        required
        id="outlined-required"
        label="Title"
        variant="outlined"
        value={title}
        onChange={(val) => setTitle(val.target.value)}
      />
      <br />
      <TextField
        required
        id="outlined-required"
        label="Max Applications"
        variant="outlined"
        value={max_applications}
        onChange={(val) => setMax_applications(val.target.value)}
      />
      <br />
      <TextField
        required
        id="outlined-required"
        label="Max Positions"
        variant="outlined"
        value={max_positions}
        onChange={(val) => setMax_positions(val.target.value)}
      />
      <br />
      <TextField
        required
        id="outlined-required"
        label="Salary per month"
        variant="outlined"
        value={salary}
        onChange={(val) => setSalary(val.target.value)}
      />
      <br />

      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Job Type</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={job_type}
          onChange={(val) => setJob_type(val.target.value)}
          label="Job Type"
        >
          <MenuItem value={'Full-time'}>Full time</MenuItem>
          <MenuItem value={'Part-time'}>Part-time</MenuItem>
          <MenuItem value={'Work from Home'}>Work from Home</MenuItem>
        </Select>
      </FormControl>
      <br />

      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Duration</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={duration}
          onChange={(val) => setDuration(val.target.value)}
          label="Duration"
        >
          <MenuItem value={0}>0</MenuItem>
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={6}>6</MenuItem>
        </Select>
      </FormControl>
      <br />

      <Skills chip="Required Skills" Skill={req_skills} handleSkillChange={setReq_skills} />
      <br />

      <TextField
        id="outlined-required"
        label="Additional Skills"
        variant="outlined"
        value={addi_skills}
        onChange={(val) => setAddi_skills(val.target.value)}
      />
      <br />

      <Calendar label="Deadline" selectedDate={deadline} handleDateChange={setDeadline} />
      <br />

      <Button type="submit" variant="contained" color="primary">
        ADD
      </Button>
      <br />
    </form>
  );
};

export default AddJob;
