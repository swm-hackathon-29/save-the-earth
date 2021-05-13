import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

export default function MyList(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <List subheader={<ListSubheader>{ props.title }</ListSubheader>}> 
        {
          (props.items || []).map((item) => (
            <ListItem key={item.title}>
              <ListItemText primary={item.title} />
            </ListItem>
          )) 
        }
      </List>
    </div>
  );
}
