import React from 'react';
import clsx from 'clsx';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import {
  Grid,
  Card,
  CardHeader,
  Button,
  makeStyles,
  CardContent,
  withStyles
} from '@material-ui/core';
import { useHistory } from 'react-router';
import Checkbox from '@material-ui/core/Checkbox';
import FixedTextField from '../../../components/FixedTextField'
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import "react-perfect-scrollbar/dist/css/styles.css";
import {
  KeyboardDatePicker,
  KeyboardTimePicker
} from '@material-ui/pickers';
/* utils */
import {
  formatDate,
  printErrors,
} from 'src/utils';
import httpClient from 'src/utils/httpClient';
import 'src/components/global';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}


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
        borderRadius: '19px',
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

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiFormHelperText-root.Mui-required': {
      color: 'red'
    }
  },
  avatar: {
    width: '100%'
  },
  boldletter: {
    fontWeight: 'bold',
    textAlign: 'right'
  },
  input_container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    "@media (max-width: 959px)": { width: '100%' }
  },
  datePicker: {
    width: 230
  },
  left_container: {
    paddingRight: 20,
    "@media (max-width: 959px)": { padding: 0 }
  },
  recomment_combo: {
    width: 230, height: 50,
    "@media (max-width: 1370px)": { width: 200 }
  },
  payments_combo: {
    // width: '80%',
    height: 50,
    "@media (max-width: 1421px)": { width: '100%' }
  },
  transfer_root: {
    margin: 'auto',
    marginBottom: 15
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: 200,
    height: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
  },
  button: {
    marginBottom: '0.5rem',
    width: '90%'
  },
  ellipsis: {
    maxWidth: 100,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: 10,
    paddingLeft: 5,
    paddingRight: 5
  }
}));

const LessonAddEditForm = ({ lesson, update, intl }) => {
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [issubmitting, setIsSubmitting] = React.useState(false);

  // transfer list for start
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([0, 1, 2, 3]);
  const [right, setRight] = React.useState([4, 5, 6, 7]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;
          return (
            <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`List item ${value + 1}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  // transfer list for end

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const serealizeData = (data, update = false) => {
    let formData = new FormData();

    if (update) {
      // update...
      // Logic that applies only when editing
    } else {
      // create...
      // Logic that applies only when creating
    }
    // Logic that applies both when creating and editing
    for (const input in data) {
      switch (input) {
        // this is used for when you want
        // to treat a field differently from the rest
        case 'custom_field':
          break;
        case 'promoted_to_home':
        case 'expires':
        case 'published':
          formData.append(input, (data[input]) ? 1 : 0);
          break;
        default:
          try {
            data[input] && formData.append(input, data[input]);
          } catch (err) {
            console.error(err)
          }
      }
    }

    return formData;
  }

  return (
    <Formik
      initialValues={{
        title: lesson.title || '',
        description: lesson.description || '',
        promoted_to_home: Boolean(lesson.promoted_to_home) || false,
        expires: Boolean(lesson.expires) || false,
        published: Boolean(lesson.published) || false,
      }}
      onSubmit={
        async (values, { setErrors }) => {
          try {
            setIsSubmitting(true);
            let data = { ...values };

            let errors = {};

            if (data.expiration_date) {
              data.expiration_date = formatDate(data.expiration_date);
            } else {
              delete data.expiration_date;
            }

            if (Object.keys(errors).length) {
              setErrors(errors);
              setIsSubmitting(false);
              return;
            }

            let url = `api/lesson/${(update) ? lesson.id + '/edit' : 'create'}`;

            await httpClient.postFile(url, serealizeData(data))
              .then(({ data }) => {
                if (data.status === 1) {
                  enqueueSnackbar(
                    formatMessage(intl[(update) ? 'successUpdatedLesson' : 'successAddedLesson']),
                    { variant: 'success' }
                  )
                  history.push(formatMessage(intl.urlLesson));
                }
              })
              .catch((err) => {
                console.error(err);
                printErrors(err.response.data, enqueueSnackbar, { ...intl, formatMessage });
                setIsSubmitting(false);
              })
          } catch (err) {
            console.error(err);
            setIsSubmitting(false);
            enqueueSnackbar(
              formatMessage(intl.unexpectedError),
              { variant: 'error' }
            )
          }
        }
      }
    >
      {({
        errors,
        values,
        touched,
        handleBlur,
        handleSubmit,
        handleChange,
      }) => {

        return (
          <form onSubmit={handleSubmit} className={clsx(classes.root)} >
            <Card>
              <CardContent>
                <Grid container >
                  <Grid item xs={12}>
                    <Grid container >
                      <Grid item md={1} xs={12}></Grid>
                      <Grid item md={10} xs={12} className={classes.left_container}>
                        <Grid item xs={12} style={{ marginBottom: 15 }}>
                          <Grid container >
                            <Grid item md={4} xs={12}>
                              <div className={classes.input_container} style={{ paddingRight: 20 }}>
                                <div className={classes.boldletter}>Date:</div>
                                <KeyboardDatePicker
                                  format="MM/DD/YYYY"
                                  name="startdate"
                                  value={selectedDate}
                                  style={{ width: '65%' }}
                                  onChange={handleDateChange}
                                />
                              </div>
                            </Grid>
                            <Grid item md={4} xs={12}>
                              <div className={classes.input_container} style={{ paddingRight: 20 }}>
                                <div className={classes.boldletter}>Start:</div>
                                <KeyboardTimePicker
                                  margin="normal"
                                  id="start"
                                  value={selectedDate}
                                  onChange={handleDateChange}
                                  style={{ width: '65%', margin: 0 }}
                                  KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                  }}
                                />
                              </div>
                            </Grid>
                            <Grid item md={4} xs={12}>
                              <div className={classes.input_container}>
                                <div className={classes.boldletter}>End:</div>
                                <KeyboardTimePicker
                                  margin="normal"
                                  id="end"
                                  value={selectedDate}
                                  onChange={handleDateChange}
                                  style={{ width: '65%', margin: 0 }}
                                  KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                  }}
                                />
                              </div>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid container style={{ marginBottom: 15 }} >
                          <Grid item md={5} xs={12}>
                            <div className={classes.input_container}>
                              <div className={classes.boldletter}>Teacher:</div>
                              <Autocomplete
                                id="teacher"
                                options={global.teachers}
                                getOptionLabel={(option) => option}
                                style={{ width: '65%', height: 50 }}
                                renderInput={(params) => <CssTextField {...params} />}
                              />
                            </div>
                          </Grid>
                          <Grid item md={2} xs={12}></Grid>
                          <Grid item md={5} xs={12}>
                            <div className={classes.input_container}>
                              <div className={classes.boldletter}>Level:</div>
                              <Autocomplete
                                id="level"
                                options={global.classis}
                                getOptionLabel={(option) => option}
                                style={{ width: '65%', height: 50 }}
                                renderInput={(params) => <CssTextField {...params} />}
                              />
                            </div>
                          </Grid>
                        </Grid>
                        <Grid container style={{ marginBottom: 15 }} >
                          <Grid item md={5} xs={12}>
                            <div className={classes.input_container}>
                              <div className={classes.boldletter}>Language:</div>
                              <Autocomplete
                                id="language"
                                options={global.languages}
                                getOptionLabel={(option) => option}
                                style={{ width: '65%', height: 50 }}
                                renderInput={(params) => <CssTextField {...params} />}
                              />
                            </div>
                          </Grid>
                          <Grid item md={2} xs={12}></Grid>
                          <Grid item md={5} xs={12}>
                            <div className={classes.input_container}>
                              <div className={classes.boldletter}>Info:</div>
                              <Autocomplete
                                id="lessoninfo"
                                options={global.lessoninfos}
                                getOptionLabel={(option) => option}
                                style={{ width: '65%', height: 50 }}
                                renderInput={(params) => <CssTextField {...params} />}
                              />
                            </div>
                          </Grid>
                        </Grid>
                        <Grid container style={{ marginBottom: 15 }}>
                          <Grid item md={6} xs={12} className={classes.left_container}>
                            <div className={classes.input_container}>
                              <div className={classes.boldletter}>Group:</div>
                              <Autocomplete
                                id="group"
                                options={global.groups}
                                getOptionLabel={(option) => option}
                                style={{ width: '65%', height: 50 }}
                                renderInput={(params) => <CssTextField {...params} />}
                              />
                            </div>
                            <div className={classes.input_container}>
                              <div className={classes.boldletter}>Topics:</div>
                            </div>
                            <Grid container>
                              <Grid item md={5} xs={12}>
                                <CssTextField
                                  id="topics_input"
                                  style={{ width: '95%', height: 50 }}
                                />
                                <Autocomplete
                                  id="topic"
                                  options={global.topics}
                                  getOptionLabel={(option) => option}
                                  style={{ width: '95%', height: 50 }}
                                  renderInput={(params) => <CssTextField {...params} />}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        // checked={state.checkedB}
                                        // onChange={handleChange}
                                        name="homework"
                                        color="primary"
                                      />
                                    }
                                    label="Homework"
                                  />
                                </div>
                              </Grid>
                              <Grid item md={2} xs={12} style={{ textAlign: 'center' }}>
                                <Button
                                  color="secondary"
                                  variant="contained"
                                  className={classes.button}
                                >
                                  Add
                                </Button>
                                <Button
                                  color="secondary"
                                  variant="contained"
                                  className={classes.button}
                                >
                                  Edit
                                </Button>
                                <Button
                                  color="secondary"
                                  variant="contained"
                                  className={classes.button}
                                >
                                  Delete
                                </Button>
                              </Grid>
                              <Grid item md={5} xs={12} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <TableContainer component={Paper} style={{ height: 200, width: '95%' }}>
                                  <Table aria-label="customized table">
                                    <TableHead>
                                      <TableRow>
                                        <StyledTableCell style={{ backgroundColor: 'rgb(223, 226, 249)', color: '#000' }}>Topic</StyledTableCell>
                                        <StyledTableCell style={{ backgroundColor: 'rgb(223, 226, 249)', color: '#000' }}>HW</StyledTableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {/* {rows.map((row) => ( */}
                                      <StyledTableRow>
                                        <StyledTableCell className={classes.ellipsis}>speaking practice (describe a relationship)</StyledTableCell>
                                        <StyledTableCell></StyledTableCell>
                                      </StyledTableRow>
                                      {/* ))} */}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <div className={classes.input_container}>
                              <div className={classes.boldletter}>TextBooks:</div>
                            </div>
                            <Grid container>
                              <Grid item md={8} xs={12}>
                                <CssTextField
                                  id="textbooks_input"
                                  style={{ height: 50 }}
                                />
                                <Autocomplete
                                  id="textbooks"
                                  options={global.textbooks}
                                  getOptionLabel={(option) => option}
                                  style={{ width: '100%', height: 50 }}
                                  renderInput={(params) => <CssTextField {...params} />}
                                />
                                <div style={{ width: '100%', display: 'flex' }}>
                                  <div className={classes.input_container} style={{ marginRight: 15 }}>
                                    <div className={classes.boldletter} style={{ marginRight: 10 }}>unit:</div>
                                    <CssTextField
                                      id="unit"
                                      style={{ height: 50 }}
                                    // value={phone}
                                    />
                                  </div>
                                  <div className={classes.input_container}>
                                    <div className={classes.boldletter} style={{ marginRight: 10 }}>Pages:</div>
                                    <CssTextField
                                      id="pages"
                                      style={{ height: 50 }}
                                    // value={phone}
                                    />
                                  </div>
                                </div>
                                <div style={{ width: '100%', display: 'flex' }}>
                                  <div className={classes.input_container} style={{ marginRight: 15 }}>
                                    <div className={classes.boldletter} style={{ marginRight: 10 }}>Exercise:</div>
                                    <CssTextField
                                      id="exercise"
                                      style={{ height: 50 }}
                                    // value={phone}
                                    />
                                  </div>
                                  <div className={classes.input_container}>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          // checked={state.checkedB}
                                          // onChange={handleChange}
                                          name="homework"
                                          color="primary"
                                        />
                                      }
                                      label="Homework"
                                    />
                                  </div>
                                </div>
                              </Grid>
                              <Grid item md={4} xs={12} style={{ textAlign: 'center' }}>
                                <Button
                                  color="secondary"
                                  variant="contained"
                                  className={classes.button}
                                >
                                  Add
                                </Button>
                                <Button
                                  color="secondary"
                                  variant="contained"
                                  className={classes.button}
                                >
                                  Edit
                                </Button>
                                <Button
                                  color="secondary"
                                  variant="contained"
                                  className={classes.button}
                                >
                                  Delete
                                </Button>
                              </Grid>
                            </Grid>

                            <TableContainer component={Paper} style={{ height: 200 }}>
                              <Table aria-label="customized table">
                                <TableHead>
                                  <TableRow>
                                    <StyledTableCell style={{ backgroundColor: 'rgb(223, 226, 249)', color: '#000' }}>Textbook</StyledTableCell>
                                    <StyledTableCell style={{ backgroundColor: 'rgb(223, 226, 249)', color: '#000' }}>Unit</StyledTableCell>
                                    <StyledTableCell style={{ backgroundColor: 'rgb(223, 226, 249)', color: '#000' }}>Pages</StyledTableCell>
                                    <StyledTableCell style={{ backgroundColor: 'rgb(223, 226, 249)', color: '#000' }}>Ex</StyledTableCell>
                                    <StyledTableCell style={{ backgroundColor: 'rgb(223, 226, 249)', color: '#000' }}>HW</StyledTableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {/* {rows.map((row) => ( */}
                                  <StyledTableRow>
                                    <StyledTableCell className={classes.ellipsis}>EF4 Elem (digital)</StyledTableCell>
                                    <StyledTableCell>8B</StyledTableCell>
                                    <StyledTableCell>65</StyledTableCell>
                                    <StyledTableCell>6a-c</StyledTableCell>
                                    <StyledTableCell>x</StyledTableCell>
                                  </StyledTableRow>
                                  {/* ))} */}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item md={1} xs={12}></Grid>
                    </Grid>
                    <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
                      <div className={classes.input_container} style={{ width: 'initial' }}>
                        <div className={classes.boldletter} style={{ textAlign: 'initial', marginRight: 15 }}>Search:</div>
                        <CssTextField
                          id="search"
                          style={{ height: 50 }}
                        // value={phone}
                        />
                      </div>

                      <FormControlLabel
                        control={
                          <Checkbox
                            color="primary"
                            name="contact"
                            style={{ marginLeft: 15 }}
                          />
                        }
                        label="Only Active"
                      />
                    </div>
                    <Grid container alignItems="center" className={classes.transfer_root}>
                      <Grid item md={5} xs={12}>
                        {customList('Choices', left)}
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <Grid container direction="column" alignItems="center">
                          <div className={classes.boldletter}>Groups</div>
                          <Button
                            color="secondary"
                            variant="contained"
                            className={classes.button}
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected right"
                          >
                            Add &gt;&gt;
                          </Button>
                          <Button
                            color="secondary"
                            variant="contained"
                            className={classes.button}
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left"
                          >
                            Remove
                          </Button>
                        </Grid>
                      </Grid>
                      <Grid item md={5} xs={12}>
                        {customList('Chosen', right)}
                      </Grid>
                    </Grid>
                    <div style={{ textAlign: 'right' }}>
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => history.goBack()}
                        style={{ margin: 5 }}
                      >
                        Cancel
                          </Button>
                      <Button
                        color="secondary"
                        variant="contained"
                        style={{ margin: 5 }}
                      >
                        Save
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        )
      }}
    </Formik >
  );
};

LessonAddEditForm.propTypes = {
  update: PropTypes.bool,
  lesson: PropTypes.array,
  className: PropTypes.string,
};

LessonAddEditForm.defaultProps = {
  lesson: {},
}

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
  currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(LessonAddEditForm);
