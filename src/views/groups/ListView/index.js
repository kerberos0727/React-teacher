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

const GroupsListView = ({ intl, currentLanguage }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [groups, setGroups] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const deleteGroups = (selectedGroups) => {
    // let temp = [];
    // const eliminatedList = [];
    // groups.forEach((n) => {
    //   if (!selectedGroups.includes(n.id)) {
    //     temp.push(n)
    //   } else {
    //     eliminatedList.push(deleteGroup(n.id));
    //   }
    // })
    // return eliminatedList;
  }

  const deleteGroup = (id) => {
    // httpClient.delete(`api/groups/${id}`);
    // setGroups((prevState) => prevState.filter((el) => el.id != id))
    // return id;
  }

  const getGroups = useCallback(async () => {
    try {
      const response = await axios.get(`api/group/all`);
      if (isMountedRef.current) {
        setGroups(response.data.groups);
      }
    } catch (err) {
      console.log(err)
    }
  }, [isMountedRef]);

  useEffect(() => {
    getGroups();
  }, [getGroups]);


  return (
    <Page
      className={classes.root}
      title={formatMessage(intl.groups)}
    >
      <Container maxWidth={false}>
        <Header
          actualPage={formatMessage(intl.groups)}
          buttonRight={{ to: formatMessage(intl.urlGroupAdd), label: 'new Group' }}
        />
        <Box mt={3}>
          <Results
            groups={groups}
            deleteGroup={deleteGroup}
            deleteGroups={deleteGroups}
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

export default connectIntl(mapStateToProps)(GroupsListView);
