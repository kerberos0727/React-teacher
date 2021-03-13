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
import "src/components/global";

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

const LessonsListView = ({ intl, currentLanguage }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [lessons, setLessons] = useState([]);
  const [totalcount, setTotalcount] = useState(0);

  const deleteLessons = (selectedLessons) => {
    let temp = [];
    const eliminatedList = [];
    lessons.forEach((n) => {
      if (!selectedLessons.includes(n.id)) {
        temp.push(n)
      } else {
        eliminatedList.push(deleteLesson(n.id));
      }
    })
    return eliminatedList;
  }

  const deleteLesson = (id) => {
    httpClient.delete(`api/lessons/${id}`);
    setLessons((prevState) => prevState.filter((el) => el.id !== id))
    return id;
  }

  const handleGetData = (pagenum, limitnum) => {
    httpClient.get(`api/lessons/all/${pagenum}/${limitnum}`)
      .then(json => {
        if (json.success && isMountedRef.current) {
          setLessons(json.lessons);
          setTotalcount(json.total)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const getLessons = useCallback(async () => {
    httpClient.get(`api/lessons/all/${0}/${10}`)
      .then(json => {
        if (json.success && isMountedRef.current) {
          setLessons(json.lessons);
          setTotalcount(json.total)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isMountedRef]);

  const getAllTeachers = useCallback(() => {
    httpClient.get(`api/teacher/all`)
      .then(json => {
        if (json.success && isMountedRef.current) {
          let data = []
          json.teachers.map((val, index) => {
            data.push(val.name);
          })
          global.teachers = data;
          global.Allteachers = json.teachers;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isMountedRef]);

  const getAllLessoninfos = useCallback(async () => {
    httpClient.get(`api/lessoninfo/all`)
      .then(json => {
        if (json.success && isMountedRef.current) {
          let data = []
          json.lessoninfos.map((val, index) => {
            data.push(val.name);
          })
          global.lessoninfos = data;
          global.Alllessoninfos = json.lessoninfos;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isMountedRef]);

  const getAllTopics = useCallback(async () => {
    httpClient.get(`api/topics/all`)
      .then(json => {
        if (json.success && isMountedRef.current) {
          let data = []
          json.topics.map((val, index) => {
            data.push(val.name);
          })
          global.topics = data;
          global.Alltopics = json.topics;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isMountedRef]);

  useEffect(() => {
    getAllTeachers();
    getAllLessoninfos();
    getAllTopics();
    getLessons();
  }, [getLessons]);


  return (
    <Page
      className={classes.root}
      title={formatMessage(intl.lessons)}
    >
      <Container maxWidth={false}>
        <Header
          actualPage={formatMessage(intl.lessons)}
          buttonRight={{ to: formatMessage(intl.urlLessonAdd), label: 'new Lesson' }}
        // crumbs={[
        //   {
        //     label: formatMessage(intl.appContents),
        //   }
        // ]}
        />
        <Box mt={3}>
          <Results
            lessons={lessons}
            totalcount={totalcount}
            deleteLesson={deleteLesson}
            deleteLessons={deleteLessons}
            handleGetData={handleGetData}
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

export default connectIntl(mapStateToProps)(LessonsListView);
