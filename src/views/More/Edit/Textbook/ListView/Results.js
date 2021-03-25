import React, { useState, useEffect } from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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
  textbooks,
  className,
  deletetextbook,
  deletetextbooks,
}) => {
  const classes = useStyles();
  const [filters] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [selectedTextbooks, setSelectedTextbooks] = useState([]);
  const [sort, setSort] = useState(sortOptionsDefault[2].value);
  const [opendialog, setOpenDialog] = React.useState(false);
  const [name, setName] = React.useState('');

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllTextbooks = (event) => {
    setSelectedTextbooks(event.target.checked
      ? textbooks.map((n) => n.id)
      : []);
  };

  const handleSelectOneNew = (event, newId) => {
    if (!selectedTextbooks.includes(newId)) {
      setSelectedTextbooks((prevSelected) => [...prevSelected, newId]);
    } else {
      setSelectedTextbooks((prevSelected) => prevSelected.filter((id) => id !== newId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredTextbooks = applyFilters(textbooks, query, filters);
  const sortedTextbooks = applySort(filteredTextbooks, sort);
  const paginatedTextbooks = applyPagination(sortedTextbooks, page, limit);
  const enableBulkOperations = selectedTextbooks.length > 0;
  const selectedSomeTextbooks = selectedTextbooks.length > 0 && selectedTextbooks.length < textbooks.length;
  const selectedAllTextbooks = selectedTextbooks.length === textbooks.length;

  const handleItemEdit = () => {
    setName('100 essential business nouns');
    handleClickOpenDialog();
  }

  return (
    <Card className={clsx(classes.root, className)} >
      <div>
        <Dialog
          open={opendialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <TextField
              id="outlined-basic"
              label="Input Name"
              variant="outlined"
              value={name}
              style={{ width: '100%' }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="track"
                  color="primary"
                />
              }
              label="track this book"
            />
            <div style={{ width: '100%' }}>(tracked books appear in the 'textbook' tab)</div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleCloseDialog} color="primary" autoFocus>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
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
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: 20 }}
          onClick={handleClickOpenDialog}
        >
          Add
        </Button>
      </Box>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllTextbooks}
              onChange={handleSelectAllTextbooks}
              indeterminate={selectedSomeTextbooks}
            />
            <Button
              variant="outlined"
              className={classes.bulkAction}
            // onClick={() => handleDeleteAllSelected(
            //   selectedTextbooks,
            //   deleteTextbooks,
            //   setSelectedTextbooks,
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
                    checked={selectedAllTextbooks}
                    onChange={handleSelectAllTextbooks}
                    indeterminate={selectedSomeTextbooks}
                  />
                </TableCell>

                <TableCell align="left">
                  Name
                </TableCell>

                <TableCell align="left">
                  Tracked
                </TableCell>

                <TableCell align="center">
                  Status
								</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTextbooks.map((n, index) => {
                const isTextbookselected = selectedTextbooks.includes(n.id);

                return (
                  <TableRow
                    hover
                    key={index}
                    selected={isTextbookselected}
                  >
                    <TableCell padding="checkbox" style={{ padding: 10 }}>
                      <Checkbox
                        checked={isTextbookselected}
                        onChange={(event) => handleSelectOneNew(event, n.id)}
                        value={isTextbookselected}
                      />
                    </TableCell>

                    <TableCell align="left">
                      {n.name}
                    </TableCell>

                    <TableCell>
                      {n.tracked}
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        onClick={handleItemEdit}
                        title="Edit"
                      >
                        <SvgIcon fontSize="small">
                          <EditIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton
                        // onClick={() => handleDelete(
                        //   n.id,
                        //   deleteTextbook,
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
        count={filteredTextbooks.length}
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
  textbooks: PropTypes.array.isRequired
};

Results.defaultProps = {
  textbooks: []
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
