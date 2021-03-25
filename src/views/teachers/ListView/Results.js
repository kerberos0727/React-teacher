import React, { useState } from 'react';

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
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import FormControlLabel from '@material-ui/core/FormControlLabel';

/* utils */
import {
  applySort,
  applyFilters,
  applyPagination,
  sortOptionsDefault,
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
  teachers,
  className,
  deleteTeacher,
  deleteTeachers,
}) => {
  const classes = useStyles();
  const [filters] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [sort, setSort] = useState(sortOptionsDefault[2].value);

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllTeachers = (event) => {
    setSelectedTeachers(event.target.checked
      ? teachers.map((n) => n.id)
      : []);
  };

  const handleSelectOneNew = (event, newId) => {
    if (!selectedTeachers.includes(newId)) {
      setSelectedTeachers((prevSelected) => [...prevSelected, newId]);
    } else {
      setSelectedTeachers((prevSelected) => prevSelected.filter((id) => id !== newId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredTeachers = applyFilters(teachers, query, filters);
  const sortedTeachers = applySort(filteredTeachers, sort);
  const paginatedTeachers = applyPagination(sortedTeachers, page, limit);
  const enableBulkOperations = selectedTeachers.length > 0;
  const selectedSomeTeachers = selectedTeachers.length > 0 && selectedTeachers.length < teachers.length;
  const selectedAllTeachers = selectedTeachers.length === teachers.length;

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
        <FormControlLabel
          control={
            <Checkbox
              name="only_active"
              color="primary"
              style={{ marginLeft: 10 }}
            />
          }
          label="Only active"
        />
      </Box>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllTeachers}
              onChange={handleSelectAllTeachers}
              indeterminate={selectedSomeTeachers}
            />
            <Button
              variant="outlined"
              className={classes.bulkAction}
            // onClick={() => handleDeleteAllSelected(
            //   selectedTeachers,
            //   deleteTeachers,
            //   setSelectedTeachers,
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
                    checked={selectedAllTeachers}
                    onChange={handleSelectAllTeachers}
                    indeterminate={selectedSomeTeachers}
                  />
                </TableCell>

                <TableCell align="center">
                  Name
                </TableCell>

                <TableCell align="center">
                  Total (taught and leave + scheduled)
                </TableCell>

                <TableCell align="center">
                  Projection
                </TableCell>

                <TableCell align="center">
                  Active
								</TableCell>

                <TableCell align="center">
                  Status
								</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTeachers.map((n, index) => {
                const isTeacherselected = selectedTeachers.includes(n.id);

                return (
                  <TableRow
                    hover
                    key={index}
                    selected={isTeacherselected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isTeacherselected}
                        onChange={(event) => handleSelectOneNew(event, n.id)}
                        value={isTeacherselected}
                      />
                    </TableCell>

                    <TableCell align="center">
                      {n.name}
                    </TableCell>

                    <TableCell align="center">
                      {n.total}
                    </TableCell>

                    <TableCell align="center">
                      {n.projection}
                    </TableCell>

                    <TableCell align="center">
                      {n.active}
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        component={RouterLink}
                        to={formatMessage(intl.urlTeacherDetail, { teacherId: n.id })}
                        title="Detail"
                      >
                        <SvgIcon fontSize="small">
                          <SearchIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton
                        component={RouterLink}
                        to={formatMessage(intl.urlTeacherEdit, { teacherId: n.id })}
                        title="Edit"
                      >
                        <SvgIcon fontSize="small">
                          <EditIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton
                        // onClick={() => handleDelete(
                        //   n.id,
                        //   deleteTeacher,
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
        count={filteredTeachers.length}
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
  teachers: PropTypes.array.isRequired
};

Results.defaultProps = {
  teachers: []
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
