import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Results from './Results';
import Page from 'src/components/Page';
import Header from 'src/components/HeaderBreadcrumbs';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { useSnackbar } from 'notistack';
import axios from 'src/utils/axios';

/* utils */
import httpClient from 'src/utils/httpClient';

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

const TeachersListView = ({ intl, currentLanguage }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [teachers, setTeachers] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const deleteTeachers = (selectedTeachers) => {
    // let temp = [];
    // const eliminatedList = [];
    // teachers.forEach((n) => {
    //   if (!selectedTeachers.includes(n.id)) {
    //     temp.push(n)
    //   } else {
    //     eliminatedList.push(deleteTeacher(n.id));
    //   }
    // })
    // return eliminatedList;
  }

  const deleteTeacher = (id) => {
    // httpClient.delete(`api/teachers/${id}`);
    // setTeachers((prevState) => prevState.filter((el) => el.id != id))
    // return id;
  }

  const getTeachers = useCallback(async () => {
    try {
      const response = await axios.get(`api/teacher/all`);
      if (isMountedRef.current) {
        setTeachers(response.data.teachers);
      }
    } catch (err) {
      console.log(err)
    }
  }, [isMountedRef]);

  useEffect(() => {
    getTeachers();
  }, [getTeachers]);


  return (
    <Page
      className={classes.root}
      title={formatMessage(intl.teachers)}
    >
      <Container maxWidth={false}>
        <Header
          actualPage={formatMessage(intl.teachers)}
          buttonRight={{ to: formatMessage(intl.urlTeacherAdd), label: 'new Teacher' }}
        />
        <Box mt={3}>
          <Results
            teachers={teachers}
            deleteteacher={deleteTeacher}
            deleteteachers={deleteTeachers}
          />
        </Box>
      </Container>
    </Page>
  );
};

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
  currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(TeachersListView);
