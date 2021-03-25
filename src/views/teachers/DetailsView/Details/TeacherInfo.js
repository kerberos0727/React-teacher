import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Card,
  Divider,
  makeStyles,
  withStyles,
  CardHeader,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import 'src/components/global';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles((theme) => ({
  root: {},
  boldletter: {
    fontWeight: 'bold',
    marginRight: 10
  },
  row_container: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  row_Div: {
    display: 'flex',
    marginBottom: 10
  },
  combobox: {
    width: 200,
    marginRight: 10,
    "@media (max-width: 684px)": { marginBottom: 10 },
    "@media (max-width: 377px)": { width: '100%', marginBottom: 10 },
  },
  calendar: {
    "@media (max-width: 599px)": { width: '100% !important' },
  }
}));

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

function createData(hours, leave, total) {
  return { hours, leave, total };
}

const rows = [
  createData('0 (0 + 0 / 25 (-25)', '0', '0 / 25 (-25)'),
  createData('0 (0 + 0 / 25 (-25)', '0', '0 / 25 (-25)'),
  createData('0 (0 + 0 / 25 (-25)', '0', '0 / 25 (-25)'),
  createData('0 (0 + 0 / 25 (-25)', '0', '0 / 25 (-25)'),
  createData('0 (0 + 0 / 25 (-25)', '0', '0 / 25 (-25)'),
  createData('0 (0 + 0 / 25 (-25)', '0', '0 / 25 (-25)'),
];

const TeacherInfo = ({ teacher, intl }) => {
  const classes = useStyles();
  const [value, onChange] = React.useState(new Date());

  return (
    <Card className={clsx(classes.root)} >
      <CardHeader title={formatMessage(intl.teacherDetail)} />
      <Divider />
      <Grid container>
        <Grid item xs={12} sm={4} style={{ padding: 15 }}>
          <Calendar
            onChange={onChange}
            value={value}
            className={classes.calendar}
          />
        </Grid>
        <Grid item xs={12} sm={8} style={{ padding: 10 }}>
          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell style={{ backgroundColor: 'rgb(223, 226, 249)', color: '#000' }}>hurs (taught + sch)</StyledTableCell>
                  <StyledTableCell style={{ backgroundColor: 'rgb(223, 226, 249)', color: '#000' }}>leave</StyledTableCell>
                  <StyledTableCell style={{ backgroundColor: 'rgb(223, 226, 249)', color: '#000' }}>total</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{row.hours}</StyledTableCell>
                    <StyledTableCell>{row.leave}</StyledTableCell>
                    <StyledTableCell>{row.total}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={6} style={{ padding: 15 }}>
            <div className={classes.row_Div}>
              <div className={classes.boldletter}>Hours per week:</div>
              <div>25</div>
            </div>
            <div className={classes.row_Div}>
              <div className={classes.boldletter}>Weeks this month:</div>
              <div>5</div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} style={{ padding: 15 }}>
            <div className={classes.row_Div}>
              <div className={classes.boldletter}>Exam suppleme...:</div>
              <div>0 hours (0 classes)</div>
            </div>
            <div className={classes.row_Div}>
              <div className={classes.boldletter}>Satuday hours:</div>
              <div>0.00</div>
            </div>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12} sm={6} style={{ padding: 15 }}>
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell style={{ backgroundColor: 'rgb(223, 226, 249)', color: '#000' }}>Book</StyledTableCell>
                    <StyledTableCell style={{ backgroundColor: 'rgb(223, 226, 249)', color: '#000' }}>N</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* {rows.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{row.hours}</StyledTableCell>
                      <StyledTableCell>{row.leave}</StyledTableCell>
                      <StyledTableCell>{row.total}</StyledTableCell>
                    </StyledTableRow>
                  ))} */}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} sm={6} style={{ padding: 15 }}>
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell style={{ backgroundColor: 'rgb(223, 226, 249)', color: '#000' }}>Date</StyledTableCell>
                    <StyledTableCell style={{ backgroundColor: 'rgb(223, 226, 249)', color: '#000' }}>N</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* {rows.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{row.hours}</StyledTableCell>
                      <StyledTableCell>{row.leave}</StyledTableCell>
                      <StyledTableCell>{row.total}</StyledTableCell>
                    </StyledTableRow>
                  ))} */}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

TeacherInfo.propTypes = {
  className: PropTypes.string,
  teacher: PropTypes.object.isRequired
};

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
  currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(TeacherInfo);
