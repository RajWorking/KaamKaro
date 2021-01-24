import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Job from './Job'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const FullWidthGrid = ({jobs, onApply}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {jobs.map((job) => (
        <Job key={job._id} job={job} onApply={onApply}/>
      ))}
    </div>
  );
};

export default FullWidthGrid;
