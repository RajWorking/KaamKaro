import Job from './Job';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Jobs = ({ jobs, erase, edit }) => {
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [sort_by, setSort_by] = useState('None');
  const [order_by, setOrder_by] = useState(1);
  const [duration, setDuration] = useState(0);
  const [job_types, setJob_types] = useState({
    full_time: true,
    part_time: false,
    wfh: false,
  });
  const { full_time, part_time, wfh } = job_types;
  const [salary, setSalary] = useState([10, 80]); // 10k to 1lakh

  const handleSalary = (event, newValue) => {
    setSalary(newValue);
  };
  const handleJob_types = (event) => {
    setJob_types({ ...job_types, [event.target.name]: event.target.checked });
  };
  const handleSort = (event) => {
    setSort_by(event.target.value);
  };
  const handleOrder = (event) => {
    setOrder_by(event.target.value);
  };
  const handleDuration = (event) => {
    setDuration(event.target.value);
  };

  const custom = (job) => {
    if (!job.title.includes(title)) return false;
    if (job.job_type === 'Full-time' && !job_types.full_time) return false;
    if (job.job_type === 'Part-time' && !job_types.part_time) return false;
    if (job.job_type === 'Work from Home' && !job_types.wfh) return false;
    if (duration !== 0 && job.duration > duration) return false;
    if (job.salary > salary[1] * 1000 || job.salary < salary[0] * 1000) return false;

    return true;
  };

  return (
    <div>
      <div className="tool-box">
        <TextField id="standard-basic" label="Job Search" value={title} onChange={(val) => setTitle(val.target.value)} />
        <br />
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel shrink>Sort by</InputLabel>

            <Select value={sort_by} onChange={handleSort} displayEmpty className={classes.selectEmpty}>
              <MenuItem value={'None'}>
                <em>None</em>
              </MenuItem>
              <MenuItem value={'salary'}>Salary</MenuItem>
              <MenuItem value={'duration'}>Duration</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl} disabled={sort_by === 'None'}>
            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
              Order by
            </InputLabel>

            <Select value={order_by} onChange={handleOrder} displayEmpty className={classes.selectEmpty}>
              <MenuItem value={1}>Ascending</MenuItem>
              <MenuItem value={-1}>Descending</MenuItem>
            </Select>
          </FormControl>
        </div>
        <br />
        <FormControl className={classes.formControl}>
          <InputLabel shrink>Max Duration</InputLabel>

          <Select value={duration} onChange={handleDuration} displayEmpty className={classes.selectEmpty}>
            <MenuItem value={0}>
              <em>None</em>
            </MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={7}>7</MenuItem>
          </Select>
        </FormControl>
        <br />
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Filter Job-types</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={full_time} onChange={handleJob_types} name="full_time" />}
              label="Full-time"
            />
            <FormControlLabel
              control={<Checkbox checked={part_time} onChange={handleJob_types} name="part_time" />}
              label="Part-time"
            />
            <FormControlLabel control={<Checkbox checked={wfh} onChange={handleJob_types} name="wfh" />} label="Work from Home" />
          </FormGroup>
        </FormControl>
        <br />
        <div style={{ width: 300 }}>
          <Typography id="range-slider" gutterBottom>
            Salary range (in 1000's)
          </Typography>
          <Slider value={salary} onChange={handleSalary} valueLabelDisplay="auto" aria-labelledby="range-slider" />
        </div>
      </div>
      <br />
      {jobs
        .sort(function(a, b){
          if (sort_by === 'salary') return order_by * (a.salary - b.salary);
          else if (sort_by === 'duration') return order_by * (a.duration - b.duration);
          else return 0;
        })
        .map((job) => custom(job) && <Job job={job} erase={erase} edit={edit} />)}
    </div>
  );
};

export default Jobs;
