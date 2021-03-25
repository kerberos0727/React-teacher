import React, { useState, useEffect } from 'react';
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
  TableBody,
  TableCell,
  TableHead,
  makeStyles,
  IconButton,
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
        borderRadius: '5px',
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
    width: 250,
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
  handleGetData,
  handleSearchData,
}) => {
  const classes = useStyles();
  const [filters] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [sort, setSort] = useState(sortOptionsDefault[2].value);
  const [switchstate, setSwitchState] = React.useState(true);
  const [searchVals, setSearchvals] = React.useState({
    name: '',
    postcode: '',
    level: '',
    enrolled: '',
    group: '',
    heard: '',
    active: false,
    inactive: false,
    finished: false,
    idle: false,
    pending: false
  });
  const [level, setLevel] = React.useState('')
  const [group, setGroup] = React.useState('')
  const [heard, setHeard] = React.useState('')

  const [weekVals, setWeekvals] = React.useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false
  });

  useEffect(() => {
    let data = { searchVals: searchVals, daysofweekNum: handlegetWeekdays(), pagenum: 0, limitnum: 10 }
    // if (searchVals.name !== '' || searchVals.postcode !== '' || searchVals.level !== '' || searchVals.enrolled !== '' || searchVals.group !== '' || searchVals.heard !== '' || searchVals.pending !== false || handlegetWeekdays() !== 0) {
    //   handleSearchData(data);
    //   console.log('handleSearchData(data)')
    // }
    if (searchVals.name === '' && searchVals.postcode === '' && searchVals.level === '' && searchVals.enrolled === '' && searchVals.group === '' && searchVals.heard === '' && searchVals.pending === false && handlegetWeekdays() === 0 && searchVals.active === false && searchVals.inactive === false && searchVals.finished === false && searchVals.idle === false && weekVals.monday === false && weekVals.tuesday === false && weekVals.wednesday === false && weekVals.thursday === false && weekVals.friday === false && weekVals.saturday === false) {
      handleGetData(0, 10)
    }
    handleSearchData(data);
  }, [searchVals, weekVals])

  const handleChangeWeekvals = (name, value) => {
    setWeekvals({ ...weekVals, [name]: value });
  };

  const handlegetWeekdays = () => {
    let daysofweekNum = 0;
    if (weekVals.monday) {
      daysofweekNum += 16;
    }
    if (weekVals.tuesday) {
      daysofweekNum += 8;
    }
    if (weekVals.wednesday) {
      daysofweekNum += 4;
    }
    if (weekVals.thursday) {
      daysofweekNum += 2;
    }
    if (weekVals.friday) {
      daysofweekNum += 1;
    }
    if (weekVals.saturday) {
      daysofweekNum = 32;
    }

    return daysofweekNum;
  }

  const handleChangeSearchvals = (name, value) => {
    let newdata = { ...searchVals }
    switch (name) {
      case 'name':
        newdata.name = value.target.value;
        break;
      case 'postcode':
        newdata.postcode = value.target.value;
        break;
      case 'enrolled':
        newdata.enrolled = value;
        break;
      case 'active':
        newdata.active = value;
        newdata.inactive = false;
        break;
      case 'inactive':
        newdata.active = false;
        newdata.finished = false;
        newdata.idle = false;
        newdata.inactive = value;
        break;
      case 'finished':
        newdata.active = true;
        newdata.inactive = false;
        newdata.finished = value;
        break;
      case 'idle':
        newdata.active = true;
        newdata.inactive = false;
        newdata.idle = value;
        break;
      case 'pending':
        newdata.pending = value;
        break;
      case 'level':
        let data = global.Allclassis;
        if (value !== null) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].name === value) {
              setLevel(value);
              newdata.level = data[i].id
            }
          }
        } else
          newdata.level = ''
        break;
      case 'group':
        let groupdata = global.Allgroups;
        if (value !== null) {
          for (let i = 0; i < groupdata.length; i++) {
            if (groupdata[i].name === value) {
              setGroup(value);
              newdata.group = groupdata[i].id;
            }
          }
        } else
          newdata.group = '';
        break;
      case 'heard':
        let hearddata = global.Allhowdidyouhear;
        if (value !== null) {
          for (let i = 0; i < hearddata.length; i++) {
            if (hearddata[i].name === value) {
              setHeard(value);
              newdata.heard = hearddata[i].id
            }
          }
        } else
          newdata.heard = ''
        break;
    }
    setSearchvals(newdata)
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
    let data = { searchVals: searchVals, daysofweekNum: handlegetWeekdays(), pagenum: parseInt(newPage + '0'), limitnum: limit }
    if (searchVals.name !== '' || searchVals.postcode !== '' || searchVals.level !== '' || searchVals.enrolled !== '' || searchVals.group !== '' || searchVals.heard !== '' || searchVals.pending !== false || handlegetWeekdays() !== 0)
      handleSearchData(data);
    else
      handleGetData(parseInt(newPage + '0'), limit);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
    let data = { searchVals: searchVals, daysofweekNum: handlegetWeekdays(), pagenum: page, imitnum: event.target.value }
    if (searchVals.name !== '' || searchVals.postcode !== '' || searchVals.level !== '' || searchVals.enrolled !== '' || searchVals.group !== '' || searchVals.heard !== '' || searchVals.pending !== false || handlegetWeekdays() !== 0)
      handleSearchData(data);
    else
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
    <Card className={clsx(classes.root, className)}>
      <Box p={2} minHeight={56} display="flex" alignItems="center" justifyContent='space-between' >
        <div id="alert-dialog-description">
          <div className={classes.row_container}>
            <div className={classes.rowDiv}>
              <div className={classes.boldletter}>Search students:</div>
              <CssTextField
                name="searchVal"
                className={classes.width150}
                variant="outlined"
                value={searchVals.name}
                onChange={(e) => handleChangeSearchvals('name', e)}
              />
            </div>
            <div className={classes.rowDiv}>
              <div className={classes.boldletter}>Postcode:</div>
              <CssTextField
                name="postcode"
                className={classes.width150}
                style={{ width: 100 }}
                variant="outlined"
                value={searchVals.postcode}
                onChange={(e) => handleChangeSearchvals('postcode', e)}
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
                renderInput={(params) => <CssTextField {...params} variant="outlined" />}
                value={level}
                onChange={(event, value) => { handleChangeSearchvals('level', value) }}
              />
            </div>
            <div className={classes.rowDiv}>
              <div className={classes.boldletter}>enrolled since:</div>
              <KeyboardDatePicker
                format="MM/DD/YYYY"
                name="startdate"
                className={classes.width150}
                value={searchVals.enrolled}
                onChange={(date) => handleChangeSearchvals('enrolled', date)}
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
                renderInput={(params) => <CssTextField {...params} variant="outlined" />}
                value={group}
                onChange={(event, value) => { handleChangeSearchvals('group', value) }}
              />
            </div>
            <div className={classes.rowDiv}>
              <div className={classes.boldletter}>Heard of us:</div>
              <Autocomplete
                id="heard"
                options={global.howdidyouhear}
                getOptionLabel={(option) => option}
                className={classes.width150}
                renderInput={(params) => <CssTextField {...params} variant="outlined" />}
                value={heard}
                onChange={(event, value) => { handleChangeSearchvals('heard', value) }}
              />
            </div>
          </div>
          <div className={classes.row_container}>
            <FormControlLabel
              control={
                <Checkbox
                  name="active"
                  color="primary"
                  onChange={() => { handleChangeSearchvals("active", !searchVals.active) }}
                  checked={searchVals.active}
                />
              }
              label="Active"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="inactive"
                  color="primary"
                  onChange={() => { handleChangeSearchvals("inactive", !searchVals.inactive) }}
                  checked={searchVals.inactive}
                />
              }
              label="Inactive"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="finished"
                  color="primary"
                  onChange={() => { handleChangeSearchvals("finished", !searchVals.finished) }}
                  checked={searchVals.finished}
                />
              }
              label="Finished"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="idle"
                  color="primary"
                  onChange={() => { handleChangeSearchvals("idle", !searchVals.idle) }}
                  checked={searchVals.idle}
                />
              }
              label="Idle"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="mon"
                  color="primary"
                  onChange={() => { handleChangeWeekvals("monday", !weekVals.monday) }}
                  checked={weekVals.monday}
                />
              }
              label="Mon"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="tue"
                  color="primary"
                  onChange={() => { handleChangeWeekvals("tuesday", !weekVals.tuesday) }}
                  checked={weekVals.tuesday}
                />
              }
              label="Tue"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="wed"
                  color="primary"
                  onChange={() => { handleChangeWeekvals("wednesday", !weekVals.wednesday) }}
                  checked={weekVals.wednesday}
                />
              }
              label="Wed"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="thu"
                  color="primary"
                  onChange={() => { handleChangeWeekvals("thursday", !weekVals.thursday) }}
                  checked={weekVals.thursday}
                />
              }
              label="Thur"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="fri"
                  color="primary"
                  onChange={() => { handleChangeWeekvals("friday", !weekVals.friday) }}
                  checked={weekVals.friday}
                />
              }
              label="Fri"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="sat"
                  color="primary"
                  onChange={() => { handleChangeWeekvals("saturday", !weekVals.saturday) }}
                  checked={weekVals.saturday}
                />
              }
              label="Sat"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="pending"
                  color="primary"
                  onChange={() => { handleChangeSearchvals("pending", !searchVals.pending) }}
                  checked={searchVals.pending}
                />
              }
              label="payment pending"
            />
          </div>
        </div>
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
                  {searchVals.active ? 'Hours left' : 'Level'}
                </TableCell>

                <TableCell align="center">
                  {searchVals.active ? 'Days left' : 'End Date'}
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
                      {searchVals.active ? n.hoursLeft : n.LEVEL}
                    </TableCell>

                    <TableCell align="center" style={n.endDate < 10 && n.endDate >= 0 ? { color: '#ef4f1f' } : n.endDate < 0 ? { color: '#ff0000' } : { color: '#0b9a09' }}>
                      {searchVals.active ? n.daysLeft : n.endDate}
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
