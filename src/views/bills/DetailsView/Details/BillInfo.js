import React from 'react';
import clsx from 'clsx';
import {
  Card,
  Divider,
  CardHeader,
} from '@material-ui/core';
import {
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
/* connectIntl */
import { connectIntl } from 'src/contexts/Intl';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
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
  avatarImg: {
    width: '100%',
    height: 145,
    "@media (max-width: 599px)": { height: 300 },
    "@media (max-width: 400px)": { height: 250 }
  },
  totalcontainer: {
    display: 'flex',
    "@media (max-width: 875px)": {
      width: '100%',
      justifyContent: 'space-around',
      marginTop: 20
    },
  }
}));

function createData(date, student, user, bill_number, price) {
  return { date, student, user, bill_number, price };
}

const rows = [
  createData('Thu Mar 1 2021', 'Rodrigo Lopez Garcia1', 'Marco1', 'T-21-153391', '120,00 €'),
  createData('Thu Mar 2 2021', 'Rodrigo Lopez Garcia2', 'Marco2', 'T-21-153392', '220,00 €'),
  createData('Thu Mar 3 2021', 'Rodrigo Lopez Garcia3', 'Marco3', 'T-21-153393', '320,00 €'),
  createData('Thu Mar 4 2021', 'Rodrigo Lopez Garcia4', 'Marco4', 'T-21-153394', '420,00 €'),
  createData('Thu Mar 5 2021', 'Rodrigo Lopez Garcia5', 'Marco5', 'T-21-153395', '520,00 €'),
  createData('Thu Mar 6 2021', 'Rodrigo Lopez Garcia6', 'Marco6', 'T-21-153396', '620,00 €'),
  createData('Thu Mar 7 2021', 'Rodrigo Lopez Garcia7', 'Marco7', 'T-21-153397', '720,00 €'),
  createData('Thu Mar 8 2021', 'Rodrigo Lopez Garcia8', 'Marco8', 'T-21-153398', '820,00 €'),
  createData('Thu Mar 9 2021', 'Rodrigo Lopez Garcia9', 'Marco9', 'T-21-153399', '820,00 €'),
  createData('Thu Mar 10 2021', 'Rodrigo Lopez Garcia10', 'Marco10', 'T-21-1533910', '1020,00 €'),
  createData('Thu Mar 11 2021', 'Rodrigo Lopez Garcia11', 'Marco11', 'T-21-1533911', '1120,00 €'),
  createData('Thu Mar 12 2021', 'Rodrigo Lopez Garcia12', 'Marco12', 'T-21-1533912', '1220,00 €')
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'date', numeric: false, disablePadding: true, label: 'Date' },
  { id: 'student', numeric: true, disablePadding: false, label: 'Student' },
  { id: 'user', numeric: true, disablePadding: false, label: 'user' },
  { id: 'bill_number', numeric: true, disablePadding: false, label: 'Bill number' },
  { id: 'price', numeric: true, disablePadding: false, label: 'Price (€)' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" align="center">
          <FormatListNumberedIcon />
        </TableCell>
        {headCells.map((headCell, index) => (
          <TableCell
            key={index}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              key={index + 1}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden} key={index = 2}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const BillInfo = ({ bill, intl }) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('student');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const { enqueueSnackbar } = useSnackbar();

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleZoom = () => {
    var fullscreenAvailable = false;
    var imgWrap = document.getElementById('img-bill');
    if (
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    ) {
      fullscreenAvailable = true;
    }

    if (fullscreenAvailable) {
      launchFullscreen(imgWrap);
    } else {
      enqueueSnackbar('Sorry, fullscreen not available...', {
        variant: 'error'
      });
    }
  }

  const launchFullscreen = (element) => {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }
  return (
    <Card className={clsx(classes.root)} >
      <CardHeader title={"Patricia's bill Details"} />
      <Divider />
      <Grid container>
        <Grid item xs={12}>
          <div className={classes.root}>
            <Paper className={classes.paper}>
              <TableContainer>
                <Table
                  className={classes.table}
                  aria-labelledby="tableTitle"
                  aria-label="enhanced table"
                >
                  <EnhancedTableHead
                    classes={classes}
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={rows.length}
                  />
                  <TableBody>
                    {stableSort(rows, getComparator(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        const isItemSelected = isSelected(row.name);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, row.name)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={index}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox" align="center" key={index + 1}>
                              {index + 1}
                            </TableCell>
                            <TableCell component="th" id={labelId} scope="row" padding="none" key={index + 2}>
                              {row.date}
                            </TableCell>
                            <TableCell align="right" key={index + 3}>{row.student}</TableCell>
                            <TableCell align="right" key={index + 4}>{row.user}</TableCell>
                            <TableCell align="right" key={index + 5}>{row.bill_number}</TableCell>
                            <TableCell align="right" key={index + 6}>{row.price}</TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Paper>
          </div>
        </Grid>
        <Grid item xs={12} sm={5} style={{ padding: 15 }}>
          <img src="/static/images/bill.png" alt="bill" style={{ width: '100%' }} id="img-bill" />
        </Grid>
        <Grid item xs={12} sm={7} style={{ padding: 15 }}>
          <div className={classes.boldletter} style={{ fontSize: 20, width: '100%', marginBottom: 30, paddingBottom: 25, borderBottom: '2px solid rgb(214,227,224)' }}>Search Bills:</div>
          <Grid container style={{
            marginBottom: 30, paddingBottom: 25, borderBottom: '2px solid rgb(214,227,224)'
          }}>
            < Grid item xs={12} sm={6} >
              <Grid container>
                < Grid item xs={12} sm={6} style={{ paddingRight: 15 }}>
                  <img src="/static/images/post_1.png" alt="bill" className={classes.avatarImg} />
                </Grid>
                < Grid item xs={12} sm={6}>
                  <div>
                    <div style={{ marginBottom: 17 }}>Patricia</div>
                    <div style={{ marginBottom: 17 }}>Cid</div>
                    <div style={{ width: '100%', display: 'flex' }}>
                      <div className={classes.boldletter} style={{ marginRight: 17 }}>ID:</div>
                      <div style={{ marginBottom: 17 }}>53732338-Z</div>
                    </div>
                    <div style={{ width: '100%', display: 'flex' }}>
                      <div className={classes.boldletter}>Postcode:</div>
                      <div>123456789</div>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
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
              <div style={{ textAlign: 'right' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="ignore_dates"
                      color="primary"
                    />
                  }
                  label="Ignore dates "
                />
              </div>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ marginBottom: 30, paddingBottom: 25, borderBottom: '2px solid rgb(214,227,224)' }} className={classes.row_container}>
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
          </Grid>
          <Grid item xs={12} style={{ marginBottom: 30, paddingBottom: 25, borderBottom: '2px solid rgb(214,227,224)' }} className={classes.row_container}>
            <Button
              color="secondary"
              variant="contained"
              style={{ width: 105 }}
              onClick={handleZoom}
            >
              Zoom
            </Button>
            <Button
              color="secondary"
              variant="contained"
              style={{ width: 105 }}
            >
              Print
            </Button>
            <Button
              color="secondary"
              variant="contained"
              style={{ width: 105 }}
            >
              Save XML
            </Button>
            <div className={classes.totalcontainer}>
              <div className={classes.boldletter}>Total:</div>
              <div>7 867,40 €</div>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Card >
  );
};

BillInfo.propTypes = {
  className: PropTypes.string,
  bill: PropTypes.object.isRequired
};

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
  currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(BillInfo);
