import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useParams } from 'react-router-dom';
import useToken from '../useToken';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function CustomizedTables({ error, reload }) {
  const classes = useStyles();
  const { id } = useParams();

  const [applications, setApplications] = useState([]);
  const { token } = useToken();

  const loadApplications = async () => {
    const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
      headers: {
        'x-auth-token': token.key,
      },
    });
    const data = await res.json();

    if (res.status === 400) error(data.msg);
    else setApplications(data);
  };
  useEffect(() => {
    const fetchApplications = async () => { 
    await loadApplications();
    }
    fetchApplications()
  });

  const choose = async (action, application) => {
    const res = await fetch(`http://localhost:5000/api/recruiters/decide/${application}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token.key,
      },
      body: JSON.stringify({
        status: action,
      }),
    });
    const data = await res.json();

    if (res.status === 400) error(data.msg);
    else {
      await loadApplications();
      await reload();
    }
  };

  return (
    <>
      <h1 className="raj-center" style={{ color: 'grey' }}>
        Applications for this &nbsp; <Link to="/">job</Link>
      </h1>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Applicant Name</StyledTableCell>
              <StyledTableCell align="right">Skills</StyledTableCell>
              <StyledTableCell align="right">Date of Application</StyledTableCell>
              <StyledTableCell align="right">Education</StyledTableCell>
              <StyledTableCell align="right">SOP</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
              <StyledTableCell align="center">Choose</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell component="th" scope="row">
                  {row.applicant.name}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.applicant.skills.map((skill) => (
                    <b>{skill}, </b>
                  ))}
                </StyledTableCell>
                <StyledTableCell align="right">{row.application_date.substring(0, 10)}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.applicant.education.map((education) => (
                    <>
                      <b>{education.institute}:</b> from {education.start_year} to {education.end_year} <br />
                    </>
                  ))}
                </StyledTableCell>
                <StyledTableCell align="right">{row.sop}</StyledTableCell>
                <StyledTableCell align="right">{row.status}</StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => choose(row.status === 'Applied' ? 'Shortlisted' : 'Accepted', row._id)}
                    disabled={row.status === 'Accepted'}
                  >
                    {row.status === 'Applied' ? 'Shortlist' : 'Accept'}
                  </Button>{' '}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => choose('Rejected', row._id)}
                    disabled={row.status === 'Accepted'}
                  >
                    Reject
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
