import { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
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

export default function CustomizedTables({ error }) {
  const classes = useStyles();
  const { id } = useParams();

  const [applications, setApplications] = useState([]);
  const [sort_by, setSort_by] = useState('None');
  const [order_by, setOrder_by] = useState(1);
  const { token } = useToken();

  const handleSort = (event) => {
    setSort_by(event.target.value);
  };
  const handleOrder = (event) => {
    console.log(event.target.value);
    setOrder_by(event.target.value);
  };

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
    };
    fetchApplications();
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
    }
  };

  return (
    <>
      <h1 className="raj-center" style={{ color: 'grey' }}>
        Applications for this &nbsp; <a href="/">job</a>
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
            {[...applications]
              .sort((a, b) => {
                if (sort_by === 'name') return order_by * (a.applicant.name.toUpperCase() > b.applicant.name.toUpperCase() ? 1 : -1);
                else if (sort_by === 'doa') return order_by * (Date.parse(a.application_date) > Date.parse(b.application_date) ? 1: -1);
                else return 0;
              })
              .map((row) => (
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
      <br />
      <div className="tool-box">
        <br />
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel shrink>Sort by</InputLabel>
            <Select value={sort_by} onChange={handleSort} displayEmpty className={classes.selectEmpty}>
              <MenuItem value={'None'}>
                <em>None</em>
              </MenuItem>
              <MenuItem value={'name'}>Name</MenuItem>
              <MenuItem value={'doa'}>Date of Application</MenuItem>
            </Select>
          </FormControl>{' '}
          <FormControl className={classes.formControl} disabled={sort_by === 'None'}>
            <InputLabel shrink>Order by</InputLabel>

            <Select value={order_by} onChange={handleOrder} displayEmpty className={classes.selectEmpty}>
              <MenuItem value={1}>Ascending</MenuItem>
              <MenuItem value={-1}>Descending</MenuItem>
            </Select>
          </FormControl>
        </div>
        <br />
      </div>
    </>
  );
}
