import React, { useEffect, useState } from 'react';
import db from '../Components/firebase';
import { AppBar, Box, Button, Container, Divider, Drawer, FormControl, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, MenuItem, Select, Stack, Toolbar, Typography } from '@mui/material';
import { collection, onSnapshot } from 'firebase/firestore';
import BackroomsGroup from '../Components/BackroomsGroup';

export default function Groups() {
  const [relGroups, setRelGroups] = useState([]);
  const [nonRelGroups, setNonRelGroups] = useState([]);
  const [currGroup, setCurrGroup] = useState(null);

  useEffect(() => {
    const collectionRef = collection(db, 'groups');

    const groupUnsub = onSnapshot(collectionRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })

      const rels = [];
      const nonRels = [];
      for(let i = 0; i < objects.length; i++) {
        if(objects[i].relations[0] === 'None') {
          nonRels.push(objects[i]);
        }
        else {
          rels.push(objects[i]);
        }
      }

      setRelGroups(rels);
      setNonRelGroups(nonRels);
    })

    return () => {
      groupUnsub();
    }
  }, [])

  return (
    <Box paddingLeft={5} paddingRight={5} paddingTop={2} display='flex'>
      <Drawer
        variant="permanent"
        sx={{
          width: {xs: '20%', md: '10%'},
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: {xs: '20%', md: '10%'}, boxSizing: 'border-box' }
        }}
      >
        <Toolbar />
        <Box>
          <List>
            <ListSubheader>Relational</ListSubheader>
            {relGroups.map((group, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => setCurrGroup(group)}>
                  <ListItemText primary={group.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListSubheader>No relations</ListSubheader>
            {nonRelGroups.map((group, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => setCurrGroup(group)}>
                  <ListItemText primary={group.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {currGroup !== null ? <BackroomsGroup currGroup={currGroup} /> : ""}
      </Box>
    </Box>
  )
}
