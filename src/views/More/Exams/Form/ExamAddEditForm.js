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
  withStyles,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FixedTextField from 'src/components/FixedTextField';
import 'src/components/global';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import { connectIntl } from 'src/contexts/Intl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  KeyboardDatePicker,
} from '@material-ui/pickers';

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 }
]

const schedules = [
  { name: '', grammar: 40, vocab: 40, pron: 20, reading: 15, listening: 10, speaking: 10, total: 135 },
  { name: 'Adilia mercedes Hemandez Argueta', grammar: '', vocab: '', pron: '', reading: '', listening: '', speaking: '', total: '' },
  { name: 'Adilia mercedes Hemandez Argueta', grammar: '', vocab: '', pron: '', reading: '', listening: '', speaking: '', total: '' },
  { name: 'Adilia mercedes Hemandez Argueta', grammar: '', vocab: '', pron: '', reading: '', listening: '', speaking: '', total: '' },
  { name: 'Adilia mercedes Hemandez Argueta', grammar: '', vocab: '', pron: '', reading: '', listening: '', speaking: '', total: '' },
  { name: 'Adilia mercedes Hemandez Argueta', grammar: '', vocab: '', pron: '', reading: '', listening: '', speaking: '', total: '' },
  { name: 'Adilia mercedes Hemandez Argueta', grammar: '', vocab: '', pron: '', reading: '', listening: '', speaking: '', total: '' },
  { name: 'Adilia mercedes Hemandez Argueta', grammar: '', vocab: '', pron: '', reading: '', listening: '', speaking: '', total: '' }
]
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
    width: 230,
    marginRight: 10
    // "@media (max-width: 1370px)": { width: 200 }
  },
  inputStyle: {
    height: 50, width: 200, marginRight: 10,
    "@media (max-width: 414px)": { width: '100%' }
  }
}));

const ExamAddEditForm = ({ result, update, itemType }) => {
  const classes = useStyles();

  const [sections, setSections] = React.useState([]);

  useEffect(() => {
    let data = []
    if (sections.length === 0)
      data.push(0)
    setSections(data)
  }, [])

  const handleAddSectionItem = () => {
    let data = [];
    let demo = '0';
    if (sections.length === 0)
      data.push(demo)
    else {
      for (let i = 0; i < sections.length; i++)
        data.push(i)
      data.push(sections.length)
    }
    setSections(data);
  }

  const handleRemoveSectionItem = (index) => {
    if (index !== 0) {
      const newsectionitems = [...sections];
      newsectionitems.splice(index, 1);
      setSections(newsectionitems);
    }
  }

  return (
    <Formik
      initialValues={{
        // start results tab variables
        textbook: result.textbook || '',
        textbook_name: result.textbook_name || '',
        end_of_course_exam: result.end_of_course_exam,
        exam_date: result.exam_date || '',
        teacher: result.teacher || '',
        test_name: result.test_name || '',
        marking_scheme: result.marking_scheme || '',
        scheduled_exam: result.scheduled_exam,
        // start marking tab variables
        name: result.name || '',
        weighted: result.weighted || '',
        sectionName: result.sectionName || '',
        outof: result.outof || ''
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
        setFieldValue
      }) => {

        return (
          <form onSubmit={handleSubmit} className={clsx(classes.root)} >
            <Card>
              <CardContent>
                {
                  itemType === 'result' ?
                    <Grid container >
                      <Grid item xs={12} sm={3}></Grid>
                      <Grid item xs={12}>
                        <Grid container>
                          <Grid item xs={12} sm={8}>
                            <FormControl component="fieldset">
                              <RadioGroup aria-label="gender" name="textbook" value={values.textbook} onChange={handleChange}>
                                <div
                                  style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}
                                >
                                  <FormControlLabel value="textbook" control={<Radio />} label="Textbook" />
                                  <div
                                    style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}
                                  >
                                    <Autocomplete
                                      options={top100Films}
                                      getOptionLabel={(option) => option.title}
                                      className={classes.recomment_combo}
                                      renderInput={(params) => <CssTextField {...params} />}
                                    />
                                    <FormControl component="fieldset">
                                      <RadioGroup aria-label="gender" name="textbook" value={values.end_of_course_exam} onChange={handleChange} style={{ flexDirection: 'row' }}>
                                        <FormControlLabel value="end_of_course_exam" control={<Radio />} label="End of course exam" />
                                        <FormControlLabel value="progress_test" control={<Radio />} label="Progress test" />
                                      </RadioGroup>
                                    </FormControl>
                                  </div>
                                </div>
                                <FormControlLabel value="upper_int" control={<Radio />} label="Upper Int A" />
                                <div
                                  style={{ display: 'flex', flexWrap: 'wrap' }}
                                >
                                  <FormControlLabel value="othere" control={<Radio />} label="Other" />
                                  <div
                                    style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
                                  >
                                    <div className={classes.boldletter}>Test name:</div>
                                    <CssTextField
                                      id="test"
                                      className={classes.recomment_combo}
                                      value={values.test_name}
                                    // onChange={handleChange}
                                    />
                                  </div>
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <div
                              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}
                            >
                              <div className={classes.boldletter}>Exam Date:</div>
                              <KeyboardDatePicker
                                className={classes.recomment_combo}
                                format="MM/DD/YYYY"
                                name="exam_date"
                                value={values.exam_date}
                                onChange={(date) => setFieldValue('exam_date', date)}
                              />
                            </div>
                            <div
                              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}
                            >
                              <div className={classes.boldletter}>Teacher:</div>
                              <Autocomplete
                                options={top100Films}
                                getOptionLabel={(option) => option.title}
                                className={classes.recomment_combo}
                                renderInput={(params) => <CssTextField {...params} />}
                              />
                            </div>
                            <div
                              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                              <div className={classes.boldletter}>Marking scheme:</div>
                              <Autocomplete
                                options={top100Films}
                                getOptionLabel={(option) => option.title}
                                className={classes.recomment_combo}
                                renderInput={(params) => <CssTextField {...params} />}
                              />
                            </div>
                          </Grid>
                          <div style={{ width: '100%' }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="scheduled_exam"
                                  color="primary"
                                  checked={values.scheduled_exam}
                                  onChange={handleChange}
                                />
                              }
                              label="Scheduled Exam (uncheck to add results)"
                            />
                          </div>
                          <Grid item xs={12} style={values.scheduled_exam ? { width: '100%', display: 'initial' } : { width: '100%', display: 'none' }}>
                            <Table>
                              <TableHead>
                                <TableRow>

                                  <TableCell align="center">

                                  </TableCell>

                                  <TableCell align="center">
                                    Grammer
                                  </TableCell>

                                  <TableCell align="center">
                                    Vocab
                                  </TableCell>

                                  <TableCell align="center">
                                    Pron
                                  </TableCell>

                                  <TableCell align="center">
                                    Reading
                                  </TableCell>

                                  <TableCell align="center">
                                    Listening
                                  </TableCell>

                                  <TableCell align="center">
                                    Speaking
                                  </TableCell>

                                  <TableCell align="center">
                                    Total
                                  </TableCell>

                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {schedules.map((n, index) => {

                                  return (
                                    <TableRow
                                      hover
                                      key={index}
                                    >

                                      <TableCell align="center">
                                        {n.name}
                                      </TableCell>

                                      <TableCell align="center">
                                        {n.grammar}
                                      </TableCell>

                                      <TableCell align="center">
                                        {n.vocab}
                                      </TableCell>

                                      <TableCell align="center">
                                        {n.pron}
                                      </TableCell>

                                      <TableCell align="center">
                                        {n.reading}
                                      </TableCell>

                                      <TableCell align="center">
                                        {n.listening}
                                      </TableCell>

                                      <TableCell align="center">
                                        {n.speaking}
                                      </TableCell>

                                      <TableCell align="center">
                                        {n.total}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </Grid>
                          <Grid item xs={12}
                            style={{ marginTop: 10, textAlign: 'right' }}
                          >
                            <Button
                              color="secondary"
                              variant="contained"
                              style={{ marginRight: 10 }}
                            >
                              Cancel
                            </Button>
                            <Button
                              color="secondary"
                              variant="contained"
                            >
                              Save
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} sm={3}></Grid>
                    </Grid>
                    :
                    <Grid container >
                      <Grid item xs={12} sm={3}></Grid>
                      <Grid item xs={12}>
                        <Grid container>
                          <div className={classes.row_Div}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <div className={classes.boldletter}>Name:</div>
                              <CssTextField
                                required
                                name="contract"
                                className={classes.inputStyle}
                                style={{ width: 300 }}
                                value={values.name}
                              />
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                              <div className={classes.boldletter} style={{ marginTop: 10 }}>Total Calculation:</div>
                              <FormControl component="fieldset">
                                <RadioGroup aria-label="gender" name="textbook" value={values.weighted} onChange={handleChange}>
                                  <FormControlLabel value="weighted" control={<Radio />} label="Weighted Average" />
                                  <FormControlLabel value="average" control={<Radio />} label="Average of Percentages" />
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </div>
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: 20 }}>
                          <div className={classes.boldletter}>Sections:</div>
                        </Grid>
                        <Grid container style={{ marginTop: 10 }}>
                          <Grid item xs={12}>
                            {
                              sections.map((val, index) => {
                                return (
                                  <div style={{ width: '100%', marginBottom: 20, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }} key={index}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                                      <div>Section Name:</div>
                                      <CssTextField
                                        id="sectionName"
                                        className={classes.recomment_combo}
                                        value={values.sectionName}
                                      // onChange={handleChange}
                                      />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                                      <div>Out of:</div>
                                      <CssTextField
                                        id="outof"
                                        className={classes.recomment_combo}
                                        value={values.outof}
                                      // onChange={handleChange}
                                      />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', marginTop: 10 }}>
                                      <Button
                                        key={index + 2}
                                        color="secondary"
                                        variant="contained"
                                        style={{ marginRight: 10, marginLeft: 10 }}
                                        onClick={() => { handleRemoveSectionItem(index) }}
                                      >
                                        -
                                      </Button>
                                      <Button
                                        key={index + 3}
                                        color="secondary"
                                        variant="contained"
                                        style={{ marginRight: 10 }}
                                        onClick={handleAddSectionItem}
                                      >
                                        +
                                      </Button>
                                    </div>
                                  </div>
                                )
                              })
                            }
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} sm={3}></Grid>
                    </Grid>
                }
              </CardContent>
            </Card>
          </form>
        )
      }}
    </Formik >
  );
};

ExamAddEditForm.propTypes = {
  update: PropTypes.bool,
  result: PropTypes.object,
  className: PropTypes.string,
  itemType: PropTypes.string
};

ExamAddEditForm.defaultProps = {
  result: {},
  itemType: PropTypes.string
}

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
  currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(ExamAddEditForm);
