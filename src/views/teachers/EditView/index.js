import React, {
  useState,
  useCallback,
  useEffect
} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { useParams } from 'react-router-dom';
import TeacherEditForm from '../Form/TeacherAddEditForm';
import Header from 'src/components/HeaderBreadcrumbs';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

/* utils */
import httpClient from 'src/utils/httpClient';
import axios from 'src/utils/axios';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    backgroundColor: theme.palette.background.dark,
  }
}));

const TeacherEditView = ({ match, intl }) => {
  const params = useParams();
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [teacher, setTeacher] = useState(null);

  const getTeacher = useCallback(async () => {
    try {
      const response = await axios.get(`api/teacher/1`);
      if (isMountedRef.current) {
        setTeacher(response.data.teacher);
      }
    } catch (err) {
      console.log(err)
    }
  }, [isMountedRef, params.teacherId]);

  useEffect(() => {
    getTeacher();
  }, [getTeacher]);

  if (!teacher) {
    return null;
  }

  return (
    <Page
      className={classes.root}
      title={formatMessage(intl.editTeacher)}
    >
      <Container maxWidth={false}>
        <Header goBack />
      </Container>
      <Box mt={3}>
        <Container maxWidth="md">
          <TeacherEditForm update teacher={teacher} />
        </Container>
      </Box>
    </Page>
  );
};

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(TeacherEditView);
