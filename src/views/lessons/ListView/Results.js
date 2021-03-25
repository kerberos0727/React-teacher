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
import FilterListIcon from '@material-ui/icons/FilterList';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FixedTextField from 'src/components/FixedTextField'
import 'src/components/global';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  KeyboardDatePicker,
} from '@material-ui/pickers';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
    // justifyContent: 'space-between',
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
  totalcount,
  lessons,
  className,
  deleteLesson,
  deleteLessons,
  handleGetData,
  handleSearchData
}) => {
  const classes = useStyles();
  const [filters] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [sort, setSort] = useState(sortOptionsDefault[2].value);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [searchVals, setSearchvals] = React.useState({
    teacher: '',
    level: '',
    language: '',
    group: '',
    dateFrom: '',
    dateTo: '',
    hourFrom: '',
    hourTo: '',
    observation: false,
    conflicts: false,
  });
  const [teacher, setTeacher] = React.useState('')
  const [level, setLevel] = React.useState('')
  const [language, setLanguage] = React.useState('')
  const [group, setGroup] = React.useState('')

  useEffect(() => {
    let data = { searchVals: searchVals, pagenum: 0, limitnum: 10 }
    if (searchVals.teacher === '' && searchVals.level === '' && searchVals.language === '' && searchVals.group === '' && searchVals.dateFrom === '' && searchVals.dateTo === '' && searchVals.hourFrom === '' && searchVals.hourTo === '' && searchVals.observation === false && searchVals.conflicts === false) {
      handleGetData(0, 10)
    }
    handleSearchData(data);
  }, [searchVals])

  const handleChangeSearchvals = (name, value) => {
    let newdata = { ...searchVals }
    switch (name) {
      case 'teacher':
        let data = global.Allteachers;
        if (value !== null) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].name === value) {
              setTeacher(value);
              newdata.teacher = data[i].id
            }
          }
        } else
          newdata.teacher = ''
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
      case 'level':
        let leveldata = global.Allclassis;
        if (value !== null) {
          for (let i = 0; i < leveldata.length; i++) {
            if (leveldata[i].name === value) {
              setLevel(value);
              newdata.level = leveldata[i].id
            }
          }
        } else
          newdata.level = ''
        break;
      case 'language':
        let languagedata = global.Alllanguages;
        if (value !== null) {
          for (let i = 0; i < languagedata.length; i++) {
            if (languagedata[i].name === value) {
              setLanguage(value);
              newdata.language = languagedata[i].id
            }
          }
        } else
          newdata.language = ''
        break;
      case 'datefrom':
        newdata.dateFrom = value;
        break;
      case 'dateto':
        newdata.dateTo = value;
        break;
      case 'hourfrom':
        newdata.hourFrom = value.target.value;
        break;
      case 'hourto':
        newdata.hourTo = value.target.value;
        break;
      case 'observations':
        newdata.observation = value;
        break;
      case 'conflicts':
        newdata.conflicts = value;
        break;
    }
    setSearchvals(newdata)
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSelectAllLessons = (event) => {
    setSelectedLessons(event.target.checked
      ? lessons.map((n) => n.id)
      : []);
  };

  const handleSelectOneNew = (event, newId) => {
    if (!selectedLessons.includes(newId)) {
      setSelectedLessons((prevSelected) => [...prevSelected, newId]);
    } else {
      setSelectedLessons((prevSelected) => prevSelected.filter((id) => id !== newId));
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

  const filteredLessons = applyFilters(lessons, query, filters);
  const sortedLessons = applySort(filteredLessons, sort);
  const paginatedLessons = applyPagination(sortedLessons, page, limit);
  const enableBulkOperations = selectedLessons.length > 0;
  const selectedSomeLessons = selectedLessons.length > 0 && selectedLessons.length < lessons.length;
  const selectedAllLessons = selectedLessons.length === lessons.length;

  return (
    <Card className={clsx(classes.root, className)} >
      <Box p={2} minHeight={56} display="flex" alignItems="center" justifyContent='space-between' >
        <div id="alert-dialog-description">
          <div className={classes.row_container}>
            <div className={classes.rowDiv}>
              <div className={classes.boldletter}>Teacher:</div>
              <Autocomplete
                id="teacher"
                options={global.teachers}
                getOptionLabel={(option) => option}
                className={classes.width150}
                renderInput={(params) => <CssTextField {...params} variant="outlined" />}
                onChange={(event, value) => { handleChangeSearchvals('teacher', value) }}
                value={teacher}
              />
            </div>
            <div className={classes.rowDiv}>
              <div className={classes.boldletter}>Level:</div>
              <Autocomplete
                id="level"
                options={global.classis}
                getOptionLabel={(option) => option}
                className={classes.width150}
                renderInput={(params) => <CssTextField {...params} variant="outlined" />}
                onChange={(event, value) => { handleChangeSearchvals('level', value) }}
                value={level}
              />
            </div>

            <div className={classes.rowDiv}>
              <div className={classes.boldletter}>Language:</div>
              <Autocomplete
                id="language"
                options={global.languages}
                getOptionLabel={(option) => option}
                className={classes.width150}
                renderInput={(params) => <CssTextField {...params} variant="outlined" />}
                onChange={(event, value) => { handleChangeSearchvals('language', value) }}
                value={language}
              />
            </div>

            <div className={classes.rowDiv}>
              <div className={classes.boldletter}>Group:</div>
              <Autocomplete
                id="group"
                options={global.groups}
                getOptionLabel={(option) => option}
                className={classes.width150}
                renderInput={(params) => <CssTextField {...params} variant="outlined" />}
                onChange={(event, value) => { handleChangeSearchvals('group', value) }}
                value={group}
              />
            </div>

            <div className={classes.rowDiv}>
              <div className={classes.boldletter}>Date:</div>
              <KeyboardDatePicker
                format="MM/DD/YYYY"
                name="from_date"
                className={classes.width150}
                onChange={handleDateChange}
                value={searchVals.dateFrom}
                onChange={(date) => handleChangeSearchvals('datefrom', date)}
              />
            </div>
            <div className={classes.rowDiv}>
              <div className={classes.boldletter}>To:</div>
              <KeyboardDatePicker
                format="MM/DD/YYYY"
                name="to_date"
                className={classes.width150}
                value={searchVals.dateTo}
                onChange={(date) => handleChangeSearchvals('dateto', date)}
              />
            </div>

            <div className={classes.rowDiv}>
              <div className={classes.boldletter}>Time:</div>
              <CssTextField
                name="hourfrom"
                className={classes.width150}
                placeholder="HH:MM"
                value={searchVals.hourFrom}
                onChange={(e) => handleChangeSearchvals('hourfrom', e)}
              />
            </div>
            <div className={classes.rowDiv}>
              <div className={classes.boldletter}>To:</div>
              <CssTextField
                name="hourto"
                className={classes.width150}
                placeholder="HH:MM"
                value={searchVals.hourTo}
                onChange={(e) => handleChangeSearchvals('hourto', e)}
              />
            </div>
            <FormControlLabel
              control={
                <Checkbox
                  name="observations"
                  color="primary"
                  value={searchVals.observation}
                  onChange={(e) => handleChangeSearchvals('observations', !searchVals.observation)}
                />
              }
              label="with observations"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="conflicts"
                  color="primary"
                  value={searchVals.conflicts}
                  disabled={true}
                  onChange={(e) => handleChangeSearchvals('conflicts', !searchVals.conflicts)}
                />
              }
              label="0 conflicts"
            />
          </div>
        </div>
      </Box>
      {
        enableBulkOperations && (
          <div className={classes.bulkOperations}>
            <div className={classes.bulkActions}>
              <Checkbox
                checked={selectedAllLessons}
                onChange={handleSelectAllLessons}
                indeterminate={selectedSomeLessons}
              />
              <Button
                variant="outlined"
                className={classes.bulkAction}
                onClick={() => handleDeleteAllSelected(
                  selectedLessons,
                  deleteLessons,
                  setSelectedLessons,
                  enqueueSnackbar,
                  { ...intl, formatMessage }
                )}
              >
                {formatMessage(intl.deleteAll)}
              </Button>
            </div>
          </div>
        )
      }
      <PerfectScrollbar>
        <Box minWidth={700}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllLessons}
                    onChange={handleSelectAllLessons}
                    indeterminate={selectedSomeLessons}
                  />
                </TableCell>

                <TableCell align="center">
                  LessonDate
                </TableCell>

                <TableCell align="center">
                  Time
                </TableCell>

                <TableCell align="center">
                  Teacher
                </TableCell>

                <TableCell align="center">
                  Level
                </TableCell>

                <TableCell align="center">
                  Status
								</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {lessons.map((n, index) => {
                const isLessonselected = selectedLessons.includes(n.id);

                return (
                  <TableRow
                    hover
                    key={index}
                    selected={isLessonselected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isLessonselected}
                        onChange={(event) => handleSelectOneNew(event, n.id)}
                        value={isLessonselected}
                      />
                    </TableCell>

                    <TableCell align="center">
                      {n.lessonDate}
                    </TableCell>

                    <TableCell align="center">
                      {n.startTime} - {n.endTime}
                    </TableCell>

                    <TableCell align="center">
                      {n.teacher}
                    </TableCell>

                    <TableCell align="center">
                      {n.LEVEL}
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        component={RouterLink}
                        to={formatMessage(intl.urlLessonDetail, { lessonId: n.id, topicsName: n.topicName })}
                        title="Detail"
                      >
                        <SvgIcon fontSize="small">
                          <SearchIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton
                        component={RouterLink}
                        to={formatMessage(intl.urlLessonEdit, { lessonId: n.id, topicsName: n.topicName })}
                        title="Edit"
                      >
                        <SvgIcon fontSize="small">
                          <EditIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(
                          n.id,
                          deleteLesson,
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
    </Card >
  );
};

Results.propTypes = {
  className: PropTypes.string,
  lessons: PropTypes.array.isRequired,
  totalcount: PropTypes.number.isRequired
};

Results.defaultProps = {
  lessons: [],
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
