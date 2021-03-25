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
var total = 0;

const StudentsListView = ({ intl, currentLanguage }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [students, setStudents] = useState([]);
  const [totalcount, setTotalcount] = useState(0);

  const deleteStudents = (selectedStudents) => {
    let temp = [];
    const eliminatedList = [];
    students.forEach((n) => {
      if (!selectedStudents.includes(n.id)) {
        temp.push(n)
      } else {
        eliminatedList.push(deleteStudent(n.id));
      }
    })
    return eliminatedList;
  }

  const deleteStudent = (id) => {
    httpClient.delete(`api/student/${id}`);
    setStudents((prevState) => prevState.filter((el) => el.id != id))
    return id;
  }

  const getStudents = useCallback(async () => {
    httpClient.get(`api/student/all/${0}/${10}`)
      .then(json => {
        if (json.success && isMountedRef.current) {
          setStudents(json.students);
          setTotalcount(json.total)
          total = json.total;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isMountedRef]);

  const getAllStudents = useCallback(async () => {
    httpClient.get(`api/student/all/${0}/200`)
      .then(json => {
        if (json.success && isMountedRef.current) {
          global.Allstudents = json.students;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  })

  const getClassinfo = useCallback(async () => {
    httpClient.get(`api/classes/all`)
      .then(json => {
        if (json.success && isMountedRef.current) {
          let data = []
          json.classes.map((val) => {
            data.push(val.name);
          })
          global.classis = data;
          global.Allclassis = json.classes;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isMountedRef]);

  const getLanguageinfo = useCallback(async () => {
    httpClient.get(`api/languages/all`)
      .then(json => {
        if (json.success && isMountedRef.current) {
          let data = []
          json.languages.map((val, index) => {
            data.push(val.name);
          })
          global.languages = data;
          global.Alllanguages = json.languages;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isMountedRef]);

  const getHowdidyouhearinfo = useCallback(async () => {
    httpClient.get(`api/howdidyouhear/all`)
      .then(json => {
        if (json.success && isMountedRef.current) {
          let data = []
          json.howdidyouhears.map((val, index) => {
            data.push(val.name);
          })
          global.howdidyouhear = data;
          global.Allhowdidyouhear = json.howdidyouhears;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isMountedRef]);

  const getGroupsinfo = useCallback(async () => {
    httpClient.get(`api/group/all`)
      .then(json => {
        if (json.success && isMountedRef.current) {
          let data = []
          json.groups.map((val, index) => {
            data.push(val.name);
          })
          global.groups = data;
          global.Allgroups = json.groups;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isMountedRef]);

  const getTextbooksinfo = useCallback(async () => {
    httpClient.get(`api/textbooks/all`)
      .then(json => {
        if (json.success && isMountedRef.current) {
          let data = [];

          let data2 = [];
          json.textbooks.map((val, index) => {
            let data1 = {
              id: 0,
              lessonid: 0,
              textBookid: 0,
              unit: '',
              homework: '',
              exercise: '',
              textBookName: '',
              from: '',
              to: '',
              pages: '',
            };
            data.push(val.name);
            data1.textBookName = val.name;
            data1.id = val.id;
            data2.push(data1);
          })
          global.Alllessontextbooks = data2;
          global.textbooks = data;
          global.Alltextbooks = json.textbooks;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isMountedRef]);

  const handleGetData = (pagenum, limitnum) => {
    httpClient.get(`api/student/all/${pagenum}/${limitnum}`)
      .then(json => {
        if (json.success && isMountedRef.current) {
          setStudents(json.students);
          setTotalcount(json.total)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleSearchData = (data) => {
    const url = `api/student/search`
    const method = 'post';
    httpClient[method](url, data)
      .then(json => {
        if (json.success && isMountedRef.current) {
          setStudents(json.students);
          setTotalcount(json.total)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getStudents();
    getClassinfo();
    getLanguageinfo();
    getHowdidyouhearinfo();
    getGroupsinfo();
    getTextbooksinfo();
    getAllStudents();
  }, [getStudents, getClassinfo, getLanguageinfo, getHowdidyouhearinfo, getGroupsinfo, getTextbooksinfo]);

  return (
    <Page
      className={classes.root}
      title={formatMessage(intl.students)}
    >
      <Container maxWidth={false}>
        <Header
          actualPage={formatMessage(intl.students)}
          buttonRight={{ to: formatMessage(intl.urlStudentAdd), label: 'new student' }}
        />
        <Box mt={3}>
          <Results
            students={students}
            totalcount={totalcount}
            deleteStudent={deleteStudent}
            deleteStudents={deleteStudents}
            handleGetData={handleGetData}
            handleSearchData={handleSearchData}
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

export default connectIntl(mapStateToProps)(StudentsListView);
