import React, { useEffect } from 'react';
import clsx from 'clsx';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import {
  Grid,
  Card,
  Button,
  makeStyles,
  CardContent,
  withStyles
} from '@material-ui/core';
import FixedTextField from 'src/components/FixedTextField';
import 'src/components/global';
import NumberFormat from 'react-number-format';
import { connectIntl } from 'src/contexts/Intl';

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

const CssTextField1 = withStyles({
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
        // borderRadius: '19px',
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

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="€"
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};


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
    width: 200, marginRight: 10,
    "@media (max-width: 611px)": { width: '100% !important' }
  }
}));

const ContractAddEditForm = ({ contract, update }) => {
  const classes = useStyles();
  const [paymentitems, setPaymentitems] = React.useState([]);

  useEffect(() => {
    let data = []
    if (paymentitems.length === 0)
      data.push(0)
    setPaymentitems(data)
  }, [])

  const handleAddPaymentItem = () => {
    let data = [];
    let demo = '0';
    if (paymentitems.length === 0)
      data.push(demo)
    else {
      for (let i = 0; i < paymentitems.length; i++)
        data.push(i)
      data.push(paymentitems.length)
    }
    setPaymentitems(data);
  }

  const handleRemovePaymentItem = (index) => {
    const newgroupitems = [...paymentitems];
    newgroupitems.splice(index, 1);
    setPaymentitems(newgroupitems);
  }

  return (
    <Formik
      initialValues={{
        contract: contract.contract || '',
        hours: contract.hours || ''
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
                    <Grid container>
                      <div className={classes.row_Div}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div className={classes.boldletter}>Contract:</div>
                          <CssTextField
                            required
                            name="contract"
                            className={classes.inputStyle}
                            style={{ width: 300 }}
                            value={values.contract}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div className={classes.boldletter}>Hours:</div>
                          <CssTextField
                            required
                            name="hours"
                            className={classes.inputStyle}
                            style={{ width: 70 }}
                            value={values.hours}
                            placeholder="HH:MM"
                          />
                        </div>
                      </div>
                    </Grid>
                    <Grid container style={{ marginTop: 20 }}>
                      <Grid item md={2} xs={12}>
                        <div className={classes.boldletter}>Payments:</div>
                      </Grid>
                      <Grid item md={10} xs={12}>
                        {
                          paymentitems.map((val, index) => {
                            return (
                              <div style={{ width: '100%', marginBottom: 20, display: 'flex' }} key={index}>
                                <CssTextField1
                                  key={index = 1}
                                  variant="outlined"
                                  name="price"
                                  InputProps={{
                                    inputComponent: NumberFormatCustom,
                                  }}
                                  placeholder="0,00 €"
                                />
                                <Button
                                  key={index + 2}
                                  color="secondary"
                                  variant="contained"
                                  style={{ marginRight: 10, marginLeft: 10 }}
                                  onClick={() => { handleRemovePaymentItem(index) }}
                                >
                                  -
                                </Button>
                                <Button
                                  key={index + 3}
                                  color="secondary"
                                  variant="contained"
                                  style={{ marginRight: 10 }}
                                  onClick={handleAddPaymentItem}
                                >
                                  +
                                </Button>
                              </div>
                            )
                          })
                        }
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

ContractAddEditForm.propTypes = {
  update: PropTypes.bool,
  contract: PropTypes.object,
  className: PropTypes.string,
};

ContractAddEditForm.defaultProps = {
  contract: {},
}

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
  currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(ContractAddEditForm);
