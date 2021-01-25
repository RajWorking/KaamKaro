import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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

export default function SimpleCard({ job, erase }) {
  const classes = useStyles();

  return (
    <>
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
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary">
            <Link to={'/applications/'+job._id}>View Applicants</Link>
          </Button>
          <Button size="small">Edit</Button>
          <Button size="small" color="secondary" onClick={() => erase(job._id)}>
            Delete
          </Button>
        </CardActions>
      </Card>
      <br />
    </>
  );
}
