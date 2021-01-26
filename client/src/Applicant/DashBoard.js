import MyApplications from './MyApplications';
import Jobs from './Jobs';
import Profile from './Profile';

import { useState, useEffect } from 'react';
import useToken from '../useToken';

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`nav-tabpanel-${index}`} aria-labelledby={`nav-tab-${index}`} {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function NavTabs({ error }) {
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [value, setValue] = React.useState(0);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const { token } = useToken();

  useEffect(() => {
    const loadApplications = async () => {
      const res = await fetch('http://127.0.0.1:5000/api/applicants/myapplications', {
        headers: {
          'x-auth-token': token.key,
        },
      });
      const rows_list = await res.json();
      setApplications(rows_list);
    };
    const loadJobs = async () => {
      const res = await fetch('http://localhost:5000/api/jobs/view', {
        headers: {
          'x-auth-token': token.key,
        },
      });
      const jobs_list = await res.json();
      setJobs(jobs_list);
    };
    loadJobs();
    loadApplications();
  }, [token]);

  const setRating = async (id, rate) => {
    console.log(id, rate)
    const res = await fetch(`http://localhost:5000/api/applicants/rate/${id}`, {
      method: 'PATCH',
      headers: {
        'x-auth-token': token.key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rating: rate }),
    });
    const data = await res.json();

    if (res.status !== 400) {
      setApplications(applications.map((appl) => (appl._id === id ? {...appl, rating_recruiter: data.rating} : appl)));
    } else error(data.msg);
  };

  const Submit = async (id, sopText) => {
    const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token.key,
      },
      body: JSON.stringify({
        sop: sopText,
      }),
    });
    const data = await res.json();

    if (res.status !== 400) {
      setApplications([...applications, data]);
      setJobs(jobs.map((job) => (job._id === id ? { ...job, status: 'Applied' } : job)));
    } else error(data.msg);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="nav tabs example">
          <LinkTab label="View Jobs" {...a11yProps(0)} />
          <LinkTab label="My Applications" {...a11yProps(1)} />
          <LinkTab label="Profile" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Jobs onApply={Submit} jobs={jobs} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MyApplications rows={applications} change={setRating} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Profile error={error} />
      </TabPanel>
    </div>
  );
}
