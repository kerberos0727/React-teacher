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
} from '@material-ui/core';
import {
  Edit as EditIcon,
  Search as SearchIcon
} from 'react-feather';
import { useSnackbar } from 'notistack';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

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
      <Box p={2} minHeight={56} display="flex" alignItems="center" >
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
        <Box flexGrow={1} />
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
