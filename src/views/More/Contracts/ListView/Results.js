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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

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
  contracts,
  className,
  deletecontract,
  deletecontracts,
}) => {
  const classes = useStyles();
  const [filters] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [sort, setSort] = useState(sortOptionsDefault[2].value);

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllContracts = (event) => {
    setSelectedContracts(event.target.checked
      ? contracts.map((n) => n.id)
      : []);
  };

  const handleSelectOneNew = (event, newId) => {
    if (!selectedContracts.includes(newId)) {
      setSelectedContracts((prevSelected) => [...prevSelected, newId]);
    } else {
      setSelectedContracts((prevSelected) => prevSelected.filter((id) => id !== newId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredContracts = applyFilters(contracts, query, filters);
  const sortedContracts = applySort(filteredContracts, sort);
  const paginatedContracts = applyPagination(sortedContracts, page, limit);
  const enableBulkOperations = selectedContracts.length > 0;
  const selectedSomeContracts = selectedContracts.length > 0 && selectedContracts.length < contracts.length;
  const selectedAllContracts = selectedContracts.length === contracts.length;

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
      </Box>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllContracts}
              onChange={handleSelectAllContracts}
              indeterminate={selectedSomeContracts}
            />
            <Button
              variant="outlined"
              className={classes.bulkAction}
            // onClick={() => handleDeleteAllSelected(
            //   selectedContracts,
            //   deleteContracts,
            //   setSelectedContracts,
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
                <TableCell padding="checkbox" style={{ padding: 10 }}>
                  <Checkbox
                    checked={selectedAllContracts}
                    onChange={handleSelectAllContracts}
                    indeterminate={selectedSomeContracts}
                  />
                </TableCell>

                <TableCell align="left">
                  Contract
                </TableCell>

                <TableCell align="left">
                  Payments
                </TableCell>

                <TableCell align="center">
                  Status
								</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedContracts.map((n, index) => {
                const isContractselected = selectedContracts.includes(n.id);

                return (
                  <TableRow
                    hover
                    key={index}
                    selected={isContractselected}
                  >
                    <TableCell padding="checkbox" style={{ padding: 10 }}>
                      <Checkbox
                        checked={isContractselected}
                        onChange={(event) => handleSelectOneNew(event, n.id)}
                        value={isContractselected}
                      />
                    </TableCell>

                    <TableCell align="left">
                      {n.contract}
                    </TableCell>

                    <TableCell align="left">
                      {n.payment}
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        title="Edit"
                        component={RouterLink}
                        to={formatMessage(intl.urlContractEdit, { contractId: n.id })}
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
        count={filteredContracts.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  contracts: PropTypes.array.isRequired
};

Results.defaultProps = {
  contracts: []
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
