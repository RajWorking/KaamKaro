import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Calendar from '../components/Calendar';
import Typography from '@material-ui/core/Typography';
import { useState } from 'react';

const useStyles = makeStyles({
  root: {
    minWidth: 200,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 0,
  },
});

export default function SimpleCard({ job, erase, edit }) {
  const classes = useStyles();
  const [mode, setMode] = useState(false);
  const [max_applications, setMax_applications] = useState(job.max_applications);
  const [max_positions, setMax_positions] = useState(job.max_positions);
  const [deadline, setDeadline] = useState(job.deadline);

  const detailsEdit = () => {
    console.log('here')
    edit(job._id, { max_applications: max_applications, max_positions: max_positions, deadline: deadline });
    setMode(false);
  };

  return (
    <>
      {mode === false && (
        <Card className={classes.root}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              {job.date_posted}
            </Typography>
            <Typography variant="h5" component="h2">
              {job.title}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              number of applicants: {job.current_applications}
              <br />
              remaining positions: {job.max_positions}
              <br />
              deadline : {job.deadline.substring(0, 10)}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              <Link to={'/applications/' + job._id}>View Applicants</Link>
            </Button>
            <Button size="small" onClick={() => setMode(true)}>
              Edit
            </Button>
            <Button size="small" color="secondary" onClick={() => erase(job._id)}>
              Delete
            </Button>
          </CardActions>
        </Card>
      )}
      {mode === true && (
        <Card className={classes.root}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              {job.date_posted}
            </Typography>
            <Typography variant="h5" component="h2">
              {job.title}
            </Typography>
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
            <Calendar label="Deadline" selectedDate={deadline} handleDateChange={setDeadline} pos="flex-center" />
          </CardContent>
          <CardActions>
            <Button size="small" color="primary" onClick={() => detailsEdit()}>
              Done
            </Button>
            <Button size="small" color="secondary" onClick={() => erase(job._id)}>
              Delete
            </Button>
          </CardActions>
        </Card>
      )}
      <br />
    </>
  );
}
