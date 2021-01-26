import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const Job = ({ job, onApply }) => {
  const classes = useStyles();
  const [apply, setApply] = useState(false);
  const [sop, setSOP] = useState('');

  return (
    <Grid container spacing={3} className="raj-center">
      <Grid item xs={10}>
        <Paper className={classes.paper}>
          <b>{job.recruiter.name}</b> wants to hire <b>{job.title}</b> ({job.avg_rating} stars) with salary <b>${job.salary}</b> for duration of{' '}
          <b>{job.duration}</b> months and requiring skills such as{' '}
          {job.req_skills.map((skill) => (
            <b>{skill}, </b>
          ))}
        </Paper>
      </Grid>
      <Grid item xs={2}>
        <Button variant="contained" color="secondary" onClick={() => setApply(!apply)} disabled={!(job.status === 'Apply')}>
          {job.status}
        </Button>
      </Grid>
      {apply && (
        <div>
          <TextField
            id="filled-multiline-static"
            label="Write your SOP: "
            multiline
            rows={4}
            defaultValue="I love to code!"
            variant="filled"
            value={sop}
            onChange={(val) => setSOP(val.target.value)}
          />
          <br></br>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              setApply(false);
              onApply(job._id, sop);
            }}
          >
            Submit
          </Button>
        </div>
      )}
    </Grid>
  );
};

export default Job;
