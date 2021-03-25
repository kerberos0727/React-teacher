import React, { useEffect, useState } from 'react';
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
  TablePagination,
  InputAdornment,
} from '@material-ui/core';
import {
  Edit as EditIcon,
  Search as SearchIcon
} from 'react-feather';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

/* utils */
import {
  applySort,
  applyFilters,
  applyPagination,
  sortOptionsDefault,
} from 'src/utils/defaultTableSettings';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';
import { result } from 'lodash';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
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
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

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
  datePicker: {
    width: 230
  },
  boldLetter: {
    fontWeight: 'bold',
    marginRight: 10
  },
  rowDiv: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  rowsubDiv: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 15,
  }
}));

const Results = ({
  intl,
  results,
  tabvalue,
  className,
  deleteItem,
  deleteItems,
  getResults,
  getSchemes
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const [filters] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [sort, setSort] = useState(sortOptionsDefault[2].value);
  const [value, setValue] = React.useState(0);
  useEffect(() => {
    setValue(tabvalue);
  }, [results, tabvalue])

  const handleChange = (event, newValue) => {
    if (newValue === 0)
      getResults();
    else
      getSchemes();
  };

  const handleChangeIndex = (index) => {
    if (index === 0)
      getResults();
    else
      getSchemes();
  };

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllItems = (event) => {
    setSelectedItems(event.target.checked
      ? results.map((n) => n.id)
      : []);
  };

  const handleSelectOneNew = (event, newId) => {
    if (!selectedItems.includes(newId)) {
      setSelectedItems((prevSelected) => [...prevSelected, newId]);
    } else {
      setSelectedItems((prevSelected) => prevSelected.filter((id) => id !== newId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredItems = applyFilters(results, query, filters);
  const sortedItems = applySort(filteredItems, sort);
  const paginatedItems = applyPagination(sortedItems, page, limit);
  const enableBulkOperations = selectedItems.length > 0;
  const selectedSomeItems = selectedItems.length > 0 && selectedItems.length < results.length;
  const selectedAllItems = selectedItems.length === results.length;

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Results" {...a11yProps(0)} style={{ fontWeight: 'bold' }} />
          <Tab label="Marking schemes" {...a11yProps(1)} style={{ fontWeight: 'bold' }} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Card className={clsx(classes.root, className)} >
            <Box p={2} alignItems="center" >
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
            </Box>
            {enableBulkOperations && (
              <div className={classes.bulkOperations}>
                <div className={classes.bulkActions}>
                  <Checkbox
                    checked={selectedAllItems}
                    onChange={handleSelectAllItems}
                    indeterminate={selectedSomeItems}
                  />
                  <Button
                    variant="outlined"
                    className={classes.bulkAction}
                  // onClick={() => handleDeleteAllSelected(
                  //   selectedItems,
                  //   deleteItems,
                  //   setSelectedItems,
                  //   enqueueSnackbar,
                  //   { ...intl, formatMessage }
                  // )}
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
                          checked={selectedAllItems}
                          onChange={handleSelectAllItems}
                          indeterminate={selectedSomeItems}
                        />
                      </TableCell>

                      <TableCell align="center">
                        Date
                      </TableCell>

                      <TableCell align="center">
                        Teacher
                      </TableCell>

                      <TableCell align="center">
                        Exam
                      </TableCell>

                      <TableCell align="center">
                        Group
                      </TableCell>

                      <TableCell align="center">
                        Status
                      </TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedItems.map((n, index) => {
                      const isItemselected = selectedItems.includes(n.id);

                      return (
                        <TableRow
                          hover
                          key={index}
                          selected={isItemselected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemselected}
                              onChange={(event) => handleSelectOneNew(event, n.id)}
                              value={isItemselected}
                            />
                          </TableCell>

                          <TableCell align="center">
                            {n.date}
                          </TableCell>

                          <TableCell align="center">
                            {n.teacher}
                          </TableCell>

                          <TableCell align="center">
                            {n.exam}
                          </TableCell>

                          <TableCell align="center">
                            {n.group}
                          </TableCell>

                          <TableCell align="center">
                            <IconButton
                              title="Edit"
                              component={RouterLink}
                              to={formatMessage(intl.urlMoreExamsEdit, { itemId: n.id, itemType: 'result' })}
                            >
                              <SvgIcon fontSize="small">
                                <EditIcon />
                              </SvgIcon>
                            </IconButton>
                            <IconButton
                              // onClick={() => handleDelete(
                              //   n.id,
                              //   deleteContract,
                              //   enqueueSnackbar,
                              //   { ...intl, formatMessage }
                              // )}
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
              count={filteredItems.length}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Card>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Card className={clsx(classes.root, className)} >
            <Box p={2} alignItems="center" display="flex" >
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
              <Button
                color="secondary"
                variant="contained"
                style={{ marginLeft: 10 }}
                component={RouterLink}
                to={formatMessage(intl.urlMoreExamsAdd, { itemType: 'schemes' })}
              >
                New
              </Button>
            </Box>
            {enableBulkOperations && (
              <div className={classes.bulkOperations}>
                <div className={classes.bulkActions}>
                  <Checkbox
                    checked={selectedAllItems}
                    onChange={handleSelectAllItems}
                    indeterminate={selectedSomeItems}
                  />
                  <Button
                    variant="outlined"
                    className={classes.bulkAction}
                  // onClick={() => handleDeleteAllSelected(
                  //   selectedItems,
                  //   deleteItems,
                  //   setSelectedItems,
                  //   enqueueSnackbar,
                  //   { ...intl, formatMessage }
                  // )}
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
                          checked={selectedAllItems}
                          onChange={handleSelectAllItems}
                          indeterminate={selectedSomeItems}
                        />
                      </TableCell>

                      <TableCell align="center">
                        Marking Scheme
                      </TableCell>

                      <TableCell align="center">
                        Sections
                      </TableCell>

                      <TableCell align="center">
                        Status
                      </TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedItems.map((n, index) => {
                      const isItemselected = selectedItems.includes(n.id);

                      return (
                        <TableRow
                          hover
                          key={index}
                          selected={isItemselected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemselected}
                              onChange={(event) => handleSelectOneNew(event, n.id)}
                              value={isItemselected}
                            />
                          </TableCell>

                          <TableCell align="center">
                            {n.scheme}
                          </TableCell>

                          <TableCell align="center">
                            {n.section}
                          </TableCell>

                          <TableCell align="center">
                            <IconButton
                              component={RouterLink}
                              // to={formatMessage(intl.urlItemDetail, { ItemId: n.id })}
                              title="Detail"
                            >
                              <SvgIcon fontSize="small">
                                <SearchIcon />
                              </SvgIcon>
                            </IconButton>
                            <IconButton
                              component={RouterLink}
                              to={formatMessage(intl.urlMoreExamsEdit, { itemId: n.id, itemType: 'schemes' })}
                              title="Edit"
                            >
                              <SvgIcon fontSize="small">
                                <EditIcon />
                              </SvgIcon>
                            </IconButton>
                            <IconButton
                              // onClick={() => handleDelete(
                              //   n.id,
                              //   deleteLesson,
                              //   enqueueSnackbar,
                              //   { ...intl, formatMessage }
                              // )}
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
              count={filteredItems.length}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Card>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  results: PropTypes.array.isRequired,
  tabvalue: PropTypes.number
};

Results.defaultProps = {
  results: [],
  tabvalue: 0
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
