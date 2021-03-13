import React, { useState } from 'react';
import FilterListIcon from '@material-ui/icons/FilterList';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Table,
  Button,
  SvgIcon,
  Checkbox,
  TableRow,
  useTheme,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  makeStyles,
  IconButton,
  InputAdornment,
  TablePagination,
  withStyles
} from '@material-ui/core';
import {
  Edit as EditIcon,
  Search as SearchIcon
} from 'react-feather';
import { useSnackbar } from 'notistack';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import CreateIcon from '@material-ui/icons/Create';
import Switch from '@material-ui/core/Switch';
/* utils */
import {
  applySort,
  handleDelete,
  applyFilters,
  applyPagination,
  sortOptionsDefault,
  handleDeleteAllSelected,
} from 'src/utils/defaultTableSettings';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';
import FixedTextField from 'src/components/FixedTextField'
import 'src/components/global';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  KeyboardDatePicker,
} from '@material-ui/pickers';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const CssTextField = withStyles({
  root: {
    '& label': {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '150%',
      alignItems: 'center',
      textAlign: 'center',

      color: '#333',
      transform: 'translate(22px, 16px) scale(1)'
    },

    '& label.Mui-focused': {
      color: '#333',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#fff',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: '1px solid#333',
        borderRadius: '19px',
        height: 50
      },
      '&:hover fieldset': {
        borderColor: '#333',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#333',
      },
    },
  },
})(FixedTextField);

const useStyles = makeStyles((theme) => ({
  root: {},
  queryField: {
    width: 500
  },
  bulkOperations: {
    position: 'relative'
  },
  bulkActions: {
    paddingLeft: 4,
    paddingRight: 4,
    marginTop: 6,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    backgroundColor: theme.palette.background.default
  },
  bulkAction: {
    marginLeft: theme.spacing(2)
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  },
  row_container: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  rowDiv: {
    display: 'flex',
    alignItems: 'center'
  },
  boldletter: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  width150: {
    height: 50,
    width: 150,
    marginRight: 20,
    "@media (max-width: 661px)": { width: '200px !important' }
  }
}));

const Results = ({
  intl,
  students,
  totalcount,
  className,
  deleteStudent,
  deleteStudents,
  handleGetData
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const [filters] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [sort, setSort] = useState(sortOptionsDefault[2].value);
  const [switchstate, setSwitchState] = React.useState(true);
  const [filteropen, setFilterOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleChangeSwitchState = (event) => {
    setSwitchState(event.target.checked);
  };
  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllStudents = (event) => {
    setSelectedStudents(event.target.checked
      ? students.map((n) => n.id)
      : []);
  };

  const handleSelectOneNew = (event, newId) => {
    if (!selectedStudents.includes(newId)) {
      setSelectedStudents((prevSelected) => [...prevSelected, newId]);
    } else {
      setSelectedStudents((prevSelected) => prevSelected.filter((id) => id !== newId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    handleGetData(parseInt(newPage + '0'), limit);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
    handleGetData(page, event.target.value);
  };

  const handleLefthours = (max, useal) => {
    var int_max = 0, int_useal = 0, maxMin = 0, usealMin = 0, leftHour = 0, leftMin = 0;
    if (max !== null) {
      int_max = max.split(":");
      maxMin = parseInt(int_max[0]) * 60 + parseInt(int_max[1]);
    }
    if (useal !== null) {
      int_useal = useal.split(":");
      usealMin = parseInt(int_useal[0]) * 60 + parseInt(int_useal[1]);
    }
    leftHour = Math.floor((maxMin - usealMin) / 60);
    leftMin = (maxMin - usealMin) % 60;
    if (leftHour < 10)
      leftHour = `0${leftHour}`
    if (leftMin < 10)
      leftMin = `0${leftMin}`
    return (`${leftHour}:${leftMin}`)
  }

  const handelLeftdays = (enddate) => {
    if (enddate !== null) {
      var daysofmon = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      var e_year = 0, e_month = 0, e_day = 0, c_year = 2021, c_month = 0, c_day = 0;
      var newDate = new Date();
      e_year = parseInt(enddate.split("-")[0]);
      e_month = parseInt(enddate.split("-")[1]);
      e_day = parseInt(enddate.split("-")[2]);
      // c_year = parseInt(`2${newDate.getYear()}`);
      c_month = parseInt(newDate.getMonth() + 1);
      c_day = parseInt(newDate.getDate());
      if (c_year === e_year) {
        if (c_month < e_month || c_month > e_month) {
          var e_days = 0, c_days = 0, i = 0;
          for (i = 1; i < e_month; i++)
            e_days += daysofmon[i]
          e_days += e_day
          for (i = 1; i < c_month; i++)
            c_days += daysofmon[i]
          c_days += c_day
          return (e_days - c_days)
        }
        if (c_month === e_month)
          return e_day - c_day
      }
    }
  }

  const filteredStudents = applyFilters(students, query, filters);
  const sortedStudents = applySort(filteredStudents, sort);
  const paginatedStudents = applyPagination(sortedStudents, page, limit);
  const enableBulkOperations = selectedStudents.length > 0;
  const selectedSomeStudents = selectedStudents.length > 0 && selectedStudents.length < students.length;
  const selectedAllStudents = selectedStudents.length === students.length;

  return (
    <Card className={clsx(classes.root, className)} >
      <div>
        <Dialog
          open={filteropen}
          onClose={() => { setFilterOpen(false) }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {/* <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle> */}
          <DialogContent>
            <div id="alert-dialog-description">
              <div className={classes.row_container}>
                <div className={classes.rowDiv}>
                  <div className={classes.boldletter}>Search students:</div>
                  <CssTextField
                    name="searchVal"
                    className={classes.width150}
                  />
                </div>
                <div className={classes.rowDiv}>
                  <div className={classes.boldletter}>Postcode:</div>
                  <CssTextField
                    name="postcode"
                    className={classes.width150}
                    style={{ width: 100 }}
                  />
                </div>
              </div>

              <div className={classes.row_container}>
                <div className={classes.rowDiv}>
                  <div className={classes.boldletter}>Level:</div>
                  <Autocomplete
                    id="level"
                    options={global.classis}
                    getOptionLabel={(option) => option}
                    className={classes.width150}
                    renderInput={(params) => <CssTextField {...params} />}
                  />
                </div>
                <div className={classes.rowDiv}>
                  <div className={classes.boldletter}>enrolled since:</div>
                  <KeyboardDatePicker
                    format="MM/DD/YYYY"
                    name="startdate"
                    value={selectedDate}
                    className={classes.width150}
                    onChange={handleDateChange}
                  />
                </div>
              </div>

              <div className={classes.row_container}>
                <div className={classes.rowDiv}>
                  <div className={classes.boldletter}>Group:</div>
                  <Autocomplete
                    id="group"
                    options={global.groups}
                    getOptionLabel={(option) => option}
                    className={classes.width150}
                    renderInput={(params) => <CssTextField {...params} />}
                  />
                </div>
                <div className={classes.rowDiv}>
                  <div className={classes.boldletter}>Heard of us:</div>
                  <Autocomplete
                    id="heard"
                    options={global.howdidyouhear}
                    getOptionLabel={(option) => option}
                    className={classes.width150}
                    renderInput={(params) => <CssTextField {...params} />}
                  />
                </div>
              </div>
              <div className={classes.row_container}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="active"
                      color="primary"
                    />
                  }
                  label="Active"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="inactive"
                      color="primary"
                    />
                  }
                  label="Inactive"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="finished"
                      color="primary"
                    />
                  }
                  label="Finished"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="idle"
                      color="primary"
                    />
                  }
                  label="Idle"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="mon"
                      color="primary"
                    />
                  }
                  label="Mon"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="tue"
                      color="primary"
                    />
                  }
                  label="Tue"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="wed"
                      color="primary"
                    />
                  }
                  label="Wed"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="thu"
                      color="primary"
                    />
                  }
                  label="Thur"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="fri"
                      color="primary"
                    />
                  }
                  label="Fri"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="sat"
                      color="primary"
                    />
                  }
                  label="Sat"
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setFilterOpen(false) }} color="primary">
              Disagree
            </Button>
            <Button onClick={() => { setFilterOpen(false) }} color="primary">
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Box p={2} minHeight={56} display="flex" alignItems="center" justifyContent='space-between' >
        <TextField
          className={classes.queryField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon
                  fontSize="small"
                  color="action"
                >
                  <SearchIcon />
                </SvgIcon>
              </InputAdornment>
            )
          }}
          value={query}
          variant="outlined"
          onChange={handleQueryChange}
          placeholder={formatMessage(intl.search)}
        />
        <FilterListIcon
          style={{ cursor: 'pointer' }}
          onClick={() => { setFilterOpen(true) }}
          title="Filter"
        />
      </Box>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllStudents}
              onChange={handleSelectAllStudents}
              indeterminate={selectedSomeStudents}
            />
            <Button
              variant="outlined"
              className={classes.bulkAction}
              onClick={() => handleDeleteAllSelected(
                selectedStudents,
                deleteStudents,
                setSelectedStudents,
                enqueueSnackbar,
                { ...intl, formatMessage }
              )}
            >
              {formatMessage(intl.deleteAll)}
            </Button>
          </div>
        </div>
      )}
      <PerfectScrollbar>
        <Box minWidth={700}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllStudents}
                    onChange={handleSelectAllStudents}
                    indeterminate={selectedSomeStudents}
                  />
                </TableCell>

                <TableCell align="center">
                  First Name
                </TableCell>

                <TableCell align="center">
                  Last Name
                </TableCell>

                <TableCell align="center">
                  Hours Left
                </TableCell>

                <TableCell align="center">
                  Days Left
                </TableCell>

                <TableCell align="center">
                  Status
								</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((n) => {
                const isStudentselected = selectedStudents.includes(n.id);

                return (
                  <TableRow
                    hover
                    key={n.id}
                    selected={isStudentselected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isStudentselected}
                        onChange={(event) => handleSelectOneNew(event, n.id)}
                        value={isStudentselected}
                      />
                    </TableCell>

                    <TableCell align="center">
                      {n.firstName}
                    </TableCell>

                    <TableCell align="center">
                      {n.lastName}
                    </TableCell>

                    <TableCell align="center">
                      {handleLefthours(n.maxHours, n.usualHour)}
                    </TableCell>

                    <TableCell align="center" style={handelLeftdays(n.endDate) < 10 && handelLeftdays(n.endDate) >= 0 ? { color: '#ef4f1f' } : handelLeftdays(n.endDate) < 0 ? { color: '#ff0000' } : { color: '#0b9a09' }}>
                      {handelLeftdays(n.endDate)}
                    </TableCell>

                    <TableCell align="center">
                      <Switch
                        checked={switchstate}
                        onChange={handleChangeSwitchState}
                        color="primary"
                        title="Change status"
                      />
                      <IconButton
                        component={RouterLink}
                        to={formatMessage(intl.urlStudentDetail, { studentId: n.id })}
                        title="Detail"
                      >
                        <SvgIcon fontSize="small" title="detail">
                          <SearchIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton
                        title="Create certificate"
                      >
                        <SvgIcon fontSize="small">
                          <CreateIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton
                        title="Create bill"
                      >
                        <SvgIcon fontSize="small">
                          <NoteAddIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton
                        component={RouterLink}
                        to={formatMessage(intl.urlStudentEdit, { studentId: n.id })}
                        title="Edit"
                      >
                        <SvgIcon fontSize="small">
                          <EditIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(
                          n.id,
                          deleteStudent,
                          enqueueSnackbar,
                          { ...intl, formatMessage }
                        )}
                        title="Delete"
                      >
                        <SvgIcon fontSize="small">
                          <HighlightOffIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={totalcount}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 20, 50, 100]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  students: PropTypes.array.isRequired,
  totalcount: PropTypes.number
};

Results.defaultProps = {
  students: [],
  totalcount: 0
};

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
})

const mapDispatchToProps = (dispatch) => ({
  // 
})

export default connectIntl(
  mapStateToProps,
  mapDispatchToProps
)(Results);
