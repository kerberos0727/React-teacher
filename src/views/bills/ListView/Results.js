import React, { useState, useEffect } from 'react';
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
} from '@material-ui/core';
import {
  Edit as EditIcon,
  Search as SearchIcon
} from 'react-feather';
import { useSnackbar } from 'notistack';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import {
  KeyboardDatePicker,
} from '@material-ui/pickers';
import FormControlLabel from '@material-ui/core/FormControlLabel';

/* utils */
import {
  applySort,
  handleDelete,
  applyFilters,
  getComparator,
  applyPagination,
  sortOptionsDefault,
  descendingComparator,
  handleDeleteAllSelected,
} from 'src/utils/defaultTableSettings';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

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
  boldletter: {
    fontWeight: 'bold',
  },
  row_container: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 25,
    "@media (max-width: 599px)": { justifyContent: 'space-between' },
  },
  totalcontainer: {
    display: 'flex',
    alignItems: 'center',
    "@media (max-width: 875px)": {
      width: '100%',
      justifyContent: 'space-around',
      marginTop: 20
    },
  }
}));

const Results = ({
  intl,
  bills,
  totalcount,
  className,
  deleteBill,
  deleteBills,
  handleGetData
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const [filters] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [selectedBills, setSelectedBills] = useState([]);
  const [sort, setSort] = useState(sortOptionsDefault[2].value);
  const [filteropen, setFilterOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllBills = (event) => {
    setSelectedBills(event.target.checked
      ? bills.map((n) => n.id)
      : []);
  };

  const handleSelectOneNew = (event, newId) => {
    if (!selectedBills.includes(newId)) {
      setSelectedBills((prevSelected) => [...prevSelected, newId]);
    } else {
      setSelectedBills((prevSelected) => prevSelected.filter((id) => id !== newId));
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

  const filteredBills = applyFilters(bills, query, filters);
  const sortedBills = applySort(filteredBills, sort);
  const paginatedBills = applyPagination(sortedBills, page, limit);
  const enableBulkOperations = selectedBills.length > 0;
  const selectedSomeBills = selectedBills.length > 0 && selectedBills.length < bills.length;
  const selectedAllBills = selectedBills.length === bills.length;

  return (
    <Card className={clsx(classes.root, className)} >
      <div>
        <Dialog
          open={filteropen}
          onClose={() => { setFilterOpen(false) }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <Grid container >
              <div className={classes.boldletter} style={{ fontSize: 20, width: '100%', marginBottom: 30, paddingBottom: 25, borderBottom: '2px solid rgb(214,227,224)' }}>Search Bills:</div>
              <Grid container style={{
                marginBottom: 30, paddingBottom: 25, borderBottom: '2px solid rgb(214,227,224)'
              }}>
                <Grid item xs={12} sm={6}>
                  <div className={classes.row_container}>
                    <div className={classes.boldletter}>Start Date:</div>
                    <KeyboardDatePicker
                      required
                      format="MM/DD/YYYY"
                      name="startDate"
                      value={selectedDate}
                      style={{ width: '65%' }}
                      onChange={handleDateChange}
                    />
                  </div>
                  <div className={classes.row_container}>
                    <div className={classes.boldletter}>End Date:</div>
                    <KeyboardDatePicker
                      required
                      format="MM/DD/YYYY"
                      name="startDate"
                      value={selectedDate}
                      style={{ width: '65%' }}
                      onChange={handleDateChange}
                    />
                  </div>
                  {/* <div style={{ textAlign: 'right' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="ignore_dates"
                          color="primary"
                        />
                      }
                      label="Ignore dates "
                    />
                  </div> */}
                </Grid>
                < Grid item xs={12} sm={6} style={{ paddingLeft: 10 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="cash"
                        color="primary"
                      />
                    }
                    label="Cash "
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="other"
                        color="primary"
                      />
                    }
                    label="Other "
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="card"
                        color="primary"
                      />
                    }
                    label="Card "
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="transfer"
                        color="primary"
                      />
                    }
                    label="Transfer "
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="company"
                        color="primary"
                      />
                    }
                    label="Company "
                  />
                  <div className={classes.totalcontainer}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="ignore_dates"
                          color="primary"
                        />
                      }
                      label="Ignore dates "
                    />
                    <div className={classes.boldletter}>Total:</div>
                    <div>7 867,40 €</div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
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
              checked={selectedAllBills}
              onChange={handleSelectAllBills}
              indeterminate={selectedSomeBills}
            />
            <Button
              variant="outlined"
              className={classes.bulkAction}
            // onClick={() => handleDeleteAllSelected(
            //   selectedBills,
            //   deleteBills,
            //   setSelectedBills,
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
                    checked={selectedAllBills}
                    onChange={handleSelectAllBills}
                    indeterminate={selectedSomeBills}
                  />
                </TableCell>

                <TableCell align="center">
                  Date
                </TableCell>

                <TableCell align="center">
                  Student
                </TableCell>

                <TableCell align="center">
                  User
                </TableCell>

                <TableCell align="center">
                  Bill number
								</TableCell>

                <TableCell align="center">
                  Price
								</TableCell>

                <TableCell align="center">
                  Status
								</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {bills.map((n) => {
                const isBillselected = selectedBills.includes(n.id);

                return (
                  <TableRow
                    hover
                    key={n.id}
                    selected={isBillselected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isBillselected}
                        onChange={(event) => handleSelectOneNew(event, n.id)}
                        value={isBillselected}
                      />
                    </TableCell>

                    <TableCell align="center">
                      {n.dTime}
                    </TableCell>

                    <TableCell align="center">
                      {n.student}
                    </TableCell>

                    <TableCell align="center">
                      {n.user}
                    </TableCell>

                    <TableCell align="center">
                      {n.billNumber}
                    </TableCell>

                    <TableCell align="center">
                      {(n.cents / 100).toFixed(2)}€
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        component={RouterLink}
                        to={formatMessage(intl.urlBillDetail, { billId: n.id })}
                        title="Detail"
                      >
                        <SvgIcon fontSize="small">
                          <SearchIcon />
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
  bills: PropTypes.array.isRequired,
  totalcount: PropTypes.number
};

Results.defaultProps = {
  bills: [],
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
