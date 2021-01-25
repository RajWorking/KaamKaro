import { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
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

  const [employees, setEmployees] = useState([]);
  const { token } = useToken();

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

  return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Applicant Name</StyledTableCell>
              <StyledTableCell align="right">Date of Joining</StyledTableCell>
              <StyledTableCell align="right">Job-type</StyledTableCell>
              <StyledTableCell align="right">Job-title</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell component="th" scope="row">
                  {row.applicant.name}
                </StyledTableCell>
                <StyledTableCell align="right">{row.joining_date.substring(0, 10)}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.job.job_type}
                </StyledTableCell>
                <StyledTableCell align="right">{row.job.title}</StyledTableCell>
                
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  );
}
