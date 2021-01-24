import MyApplications from './MyApplications';
import Jobs from './Jobs';

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
    const fetchApplications = async () => {
      const res = await fetch('http://127.0.0.1:5000/api/applicants/myapplications', {
        headers: {
          'x-auth-token': token.key,
        },
      });
      const data = await res.json();
      return data;
    };
    const fetchJobs = async () => {
      const res = await fetch('http://localhost:5000/api/jobs/view', {
        headers: {
          'x-auth-token': token.key,
        },
      });
      const data = await res.json();
      return data;
    };

    const loadApplications = async () => {
      const rows_list = await fetchApplications();
      setApplications(rows_list);
    };
    const loadJobs = async () => {
      const jobs_list = await fetchJobs();
      setJobs(jobs_list);
    };
    loadJobs();
    loadApplications();
  }, [token]);


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
    console.log(res.status);
    const data = await res.json();

    if (res.status !== 400) {
      setApplications([...applications, data]);
      setJobs(jobs.map((job) => (job._id === id ? { ...job, status: 'Applied' } : job)));
    } else console.log(error(data.msg));
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="nav tabs example">
          <LinkTab label="View Jobs" href="/drafts" {...a11yProps(0)} />
          <LinkTab label="My Applications" href="/trash" {...a11yProps(1)} />
          <LinkTab label="Profile" href="/spam" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Jobs onApply={Submit} jobs={jobs} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MyApplications rows={applications} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        Page Three
      </TabPanel>
    </div>
  );
}
