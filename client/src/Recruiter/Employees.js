import { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import useToken from '../useToken';
import Rating from '@material-ui/lab/Rating';

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

  const [employees, setEmployees] = useState([]);
  const [sort_by, setSort_by] = useState('None');
  const [order_by, setOrder_by] = useState(1);
  const { token } = useToken();

  const handleSort = (event) => {
    setSort_by(event.target.value);
  };
  const handleOrder = (event) => {
    setOrder_by(event.target.value);
  };

  const loadEmployees = async () => {
    const res = await fetch(`http://localhost:5000/api/recruiters/employees`, {
      headers: {
        'x-auth-token': token.key,
      },
    });
    const data = await res.json();

    if (res.status === 400) error(data.msg);
    else setEmployees(data);
  };
  useEffect(() => {
    const fetchEmployees = async () => {
      await loadEmployees();
    };
    fetchEmployees();
  });

  const setRating = async (id, rate) => {
    console.log(id, rate);
    const res = await fetch(`http://localhost:5000/api/recruiters/rate/${id}`, {
      method: 'PATCH',
      headers: {
        'x-auth-token': token.key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating: rate }),
    });
    const data = await res.json();

    if (res.status !== 400) {
      setEmployees(employees.map((appl) => (appl._id === id ? { ...appl, rating_applicant: data.rating } : appl)));
    } else error(data.msg);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Applicant Name</StyledTableCell>
              <StyledTableCell align="right">Date of Joining</StyledTableCell>
              <StyledTableCell align="right">Job-type</StyledTableCell>
              <StyledTableCell align="right">Job-title</StyledTableCell>
              <StyledTableCell align="right">Rating</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...employees]
              .sort(function (a, b) {
                if (sort_by === 'name')
                  return order_by * (a.applicant.name.toUpperCase() > b.applicant.name.toUpperCase() ? 1 : -1);
                else if (sort_by === 'title') return order_by * (a.job.title.toUpperCase() > b.job.title.toUpperCase() ? 1 : -1);
                else if (sort_by === 'doj') return order_by * (Date.parse(a.joining_date) > Date.parse(b.joining_date) ? 1 : -1);
                else return 0;
              })
              .map((row) => (
                <StyledTableRow key={row._id}>
                  <StyledTableCell component="th" scope="row">
                    {row.applicant && row.applicant.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.joining_date.substring(0, 10)}</StyledTableCell>
                  <StyledTableCell align="right">{row.job.job_type}</StyledTableCell>
                  <StyledTableCell align="right">{row.job.title}</StyledTableCell>
                  <StyledTableCell align="right">
                    <Rating
                      value={row.rating_applicant}
                      disabled={!(row.status === 'Accepted')}
                      onChange={(event, newValue) => {
                        setRating(row._id, newValue);
                      }}
                    />
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
              <MenuItem value={'title'}>Job Title</MenuItem>
              <MenuItem value={'doj'}>Date of joining</MenuItem>
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
