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
import GroupEditForm from '../Form/GroupAddEditForm';
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

const GroupEditView = ({ match, intl }) => {
  const params = useParams();
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [group, setGroup] = useState(null);

  const getGroup = useCallback(async () => {
    try {
      const response = await axios.get(`api/group/1`);
      if (isMountedRef.current) {
        setGroup(response.data.group);
        console.log(response.data.group)
      }
    } catch (err) {
      console.log(err)
    }
  }, [isMountedRef, params.groupId]);

  useEffect(() => {
    getGroup();
  }, [getGroup]);

  if (!group) {
    return null;
  }

  return (
    <Page
      className={classes.root}
      title={formatMessage(intl.editGroup)}
    >
      <Container maxWidth={false}>
        <Header goBack />
      </Container>
      <Box mt={3}>
        <Container maxWidth={false}>
          <GroupEditForm update group={group} />
        </Container>
      </Box>
    </Page>
  );
};

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(GroupEditView);
