import React from 'react';
import clsx from 'clsx';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import {
  Grid,
  Card,
  CardHeader,
  Button,
  makeStyles,
  CardContent,
  withStyles
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FixedTextField from 'src/components/FixedTextField';
import 'src/components/global';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
/* connectIntl */
import { connectIntl } from 'src/contexts/Intl';

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

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiFormHelperText-root.Mui-required': {
      color: 'red'
    }
  },
  button: {
    marginBottom: '0.5rem',
    width: '90%'
  },
  boldletter: {
    fontWeight: 'bold',
    marginRight: 10
  },
  row_container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    // "@media (max-width: 959px)": { width: '100%' }
  },
  row_Div: {
    display: 'flex',
    marginBottom: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  recomment_combo: {
    width: 230, height: 50,
    // "@media (max-width: 1370px)": { width: 200 }
  },
  inputStyle: {
    height: 50, width: 200, marginRight: 10,
    "@media (max-width: 414px)": { width: '100%' }
  }
}));

const TeacherAddEditForm = ({ teacher, update, intl }) => {
  const classes = useStyles();
  const [teacheritems, setTeacheritems] = React.useState([]);

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

  const handleAddTeacherItem = () => {
    let data = [];
    let demo = '0';
    if (teacheritems.length === 0)
      data.push(demo)
    else {
      for (let i = 0; i < teacheritems.length; i++)
        data.push(i)
      data.push(teacheritems.length)
    }
    setTeacheritems(data);
  }

  const handleRemoveTeacherItem = (index) => {
    const newteacheritems = [...teacheritems];
    newteacheritems.splice(index, 1);
    setTeacheritems(newteacheritems);
  }

  return (
    <Formik
      initialValues={{
        name: teacher.name || '',
        hours: teacher.hours || '',
        isteacher: Boolean(teacher.isteacher) || false,
      }}
      onSubmit={
        async (values, { setErrors }) => {

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
                  <Grid item xs={12} sm={3}></Grid>
                  <Grid item xs={12}>
                    <div className={classes.row_Div}>
                      <div className={classes.boldletter}>Name:</div>
                      <CssTextField
                        required
                        name="name"
                        className={classes.inputStyle}
                        value={values.name}
                      />
                      <div className={classes.boldletter}>Hours per week:</div>
                      <CssTextField
                        required
                        name="hour"
                        className={classes.inputStyle}
                        value={values.hours}
                      />
                    </div>

                    <div className={classes.row_Div}>
                      <div className={classes.boldletter}>Re Password:</div>
                      <CssTextField
                        required
                        name="repassword"
                        className={classes.inputStyle}
                      />
                      <div className={classes.boldletter}>Password:</div>
                      <CssTextField
                        required
                        name="password"
                        className={classes.inputStyle}
                      />
                    </div>

                    <div className={classes.row_Div}>
                      <div className={classes.boldletter}>Search:</div>
                      <CssTextField
                        required
                        name="search"
                        className={classes.inputStyle}
                      />
                      <div className={classes.boldletter}></div>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="teacherisactive"
                            color="primary"
                            checked={Boolean(values.isteacher)}
                          />
                        }
                        label="Teacher is active"
                      />
                    </div>

                    <Grid container alignItems="center" className={classes.transfer_root}>
                      <Grid item md={5} xs={12}>
                        {customList('Choices', left)}
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <Grid container direction="column" alignItems="center">
                          <div className={classes.boldletter}>Books</div>
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
                  </Grid>
                  <Grid item xs={12} sm={3}></Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        )
      }}
    </Formik >
  );
};

TeacherAddEditForm.propTypes = {
  update: PropTypes.bool,
  teacher: PropTypes.object,
  className: PropTypes.string,
};

TeacherAddEditForm.defaultProps = {
  teacher: {},
}

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
  currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(TeacherAddEditForm);
