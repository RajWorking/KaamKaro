import Jobs from './Jobs';
import Applications from './Applications'
import AddJob from './AddJob'
import Employees from './Employees' 
import Profile from './Profile'

import { useState, useEffect } from 'react';
import useToken from '../useToken';
import { BrowserRouter as Router, Route } from 'react-router-dom'; // Redirect

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
  const [jobs, setJobs] = useState([]);
  const { token } = useToken();
  
  useEffect(() => {
    const fetchJobs = async () => {
      await loadJobs()
    }
    fetchJobs()
  });

  const loadJobs = async () => {
    const res = await fetch('http://localhost:5000/api/recruiters/myjobs', {
      headers: {
        'x-auth-token': token.key,
      },
    });
    const jobs_list = await res.json();
    setJobs(jobs_list);
  };

  const addJob = async(job) => {
    const res = await fetch('http://localhost:5000/api/jobs/add', {
      method: 'POST',
      headers: {
        'x-auth-token': token.key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(job)
    });
    const data = await res.json();

    if (res.status !== 400) {
      setJobs([...jobs, data]);
    } else error(data.msg);
  }

  const editJob = async(job_id, details) => {
    console.log('here2')
    const res = await fetch(`http://localhost:5000/api/jobs/${job_id}`,{
      method: 'PATCH',
      headers: {
        'x-auth-token': token.key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(details)
    })
    const data = await res.json();

    if (res.status !== 400) {
      setJobs(jobs.map((job) => job._id===job_id?data:job));
    } else error(data.msg);
  }

  const deleteJob = async (id) => {
    const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
      method: 'DELETE',
      headers: {
        'x-auth-token': token.key,
      },
    });
    const data = await res.json();
    console.log(data);

    if (res.status === 400) {
      error(data.msg);
    } else {
      setJobs(jobs.filter((job) => job._id !== id));
    }
  };

  return (
    <Router className={classes.root}>
      <Route path="/" exact>
        <AppBar position="static">
          <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="nav tabs example">
            <LinkTab label="Jobs" {...a11yProps(0)} />
            <LinkTab label="Add Job" {...a11yProps(1)} />
            <LinkTab label="Employees" {...a11yProps(2)} />
            <LinkTab label="Profile" {...a11yProps(3)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Jobs jobs={jobs} erase={deleteJob} edit={editJob}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AddJob onSubmit={addJob} error={error}/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Employees />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Profile error= {error}/>
        </TabPanel>
      </Route>

      <Route path="/applications/:id">{token?.type === 'recruiters' && <Applications error={error}/>}</Route>
      <br />
    </Router>
  );
}
