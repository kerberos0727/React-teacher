import React, { useState, useEffect } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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
import EqualizerIcon from '@material-ui/icons/Equalizer';

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
  groups,
  className,
  deleteGroup,
  deleteGroups,
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const [filters] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [sort, setSort] = useState(sortOptionsDefault[2].value);

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    event.persist();
    setSort(event.target.value);
  };

  const handleSelectAllGroups = (event) => {
    setSelectedGroups(event.target.checked
      ? groups.map((n) => n.id)
      : []);
  };

  const handleSelectOneNew = (event, newId) => {
    if (!selectedGroups.includes(newId)) {
      setSelectedGroups((prevSelected) => [...prevSelected, newId]);
    } else {
      setSelectedGroups((prevSelected) => prevSelected.filter((id) => id !== newId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredGroups = applyFilters(groups, query, filters);
  const sortedGroups = applySort(filteredGroups, sort);
  const paginatedGroups = applyPagination(sortedGroups, page, limit);
  const enableBulkOperations = selectedGroups.length > 0;
  const selectedSomeGroups = selectedGroups.length > 0 && selectedGroups.length < groups.length;
  const selectedAllGroups = selectedGroups.length === groups.length;

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
        <div style={{ marginLeft: 10 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="show_groups"
                color="primary"
              />
            }
            label="Show Groups"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="show_primary"
                color="primary"
              />
            }
            label="Show Private"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="hour"
                color="primary"
              />
            }
            label="1 hour"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="days"
                color="primary"
              />
            }
            label="2 days"
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
      </Box>
      {enableBulkOperations && (
        <div className={classes.bulkOperations}>
          <div className={classes.bulkActions}>
            <Checkbox
              checked={selectedAllGroups}
              onChange={handleSelectAllGroups}
              indeterminate={selectedSomeGroups}
            />
            <Button
              variant="outlined"
              className={classes.bulkAction}
            // onClick={() => handleDeleteAllSelected(
            //   selectedGroups,
            //   deleteGroups,
            //   setSelectedGroups,
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
                    checked={selectedAllGroups}
                    onChange={handleSelectAllGroups}
                    indeterminate={selectedSomeGroups}
                  />
                </TableCell>

                <TableCell align="center">
                  Time
                </TableCell>

                <TableCell align="center">
                  Group
                </TableCell>

                <TableCell align="center">
                  Textbook
                </TableCell>

                <TableCell align="center">
                  Unit
								</TableCell>

                <TableCell align="center">
                  Teacher
								</TableCell>

                <TableCell align="center">
                  Room
								</TableCell>

                <TableCell align="center">
                  Status
								</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedGroups.map((n, index) => {
                const isGroupselected = selectedGroups.includes(n.id);

                return (
                  <TableRow
                    hover
                    key={index}
                    selected={isGroupselected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isGroupselected}
                        onChange={(event) => handleSelectOneNew(event, n.id)}
                        value={isGroupselected}
                      />
                    </TableCell>

                    <TableCell align="center">
                      {n.time}
                    </TableCell>

                    <TableCell align="center">
                      {n.group}
                    </TableCell>

                    <TableCell align="center">
                      {n.textbook}
                    </TableCell>

                    <TableCell align="center">
                      {n.unit}
                    </TableCell>

                    <TableCell align="center">
                      {n.teacher}
                    </TableCell>

                    <TableCell align="center">
                      {n.room}
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        component={RouterLink}
                        to={formatMessage(intl.urlGroupDetail, { groupId: n.id })}
                        title="Detail"
                      >
                        <SvgIcon fontSize="small">
                          <SearchIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton
                        component={RouterLink}
                        to={formatMessage(intl.urlGroupEdit, { groupId: n.id })}
                        title="Edit"
                      >
                        <SvgIcon fontSize="small">
                          <EditIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton
                        // onClick={() => handleDelete(
                        //   n.id,
                        //   deleteGroup,
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
        count={filteredGroups.length}
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
  groups: PropTypes.array.isRequired
};

Results.defaultProps = {
  groups: []
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
