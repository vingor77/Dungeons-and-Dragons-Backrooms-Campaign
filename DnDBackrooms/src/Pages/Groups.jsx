import React, { useEffect, useState } from 'react';
import db from '../Components/firebase';
import { Box, Button, Container, Divider, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { collection, onSnapshot } from 'firebase/firestore';
import BackroomsGroup from '../Components/BackroomsGroup';

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [currGroup, setCurrGroup] = useState(null);

  useEffect(() => {
    const collectionRef = collection(db, 'groups');

    const groupUnsub = onSnapshot(collectionRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setGroups(objects);
    })

    return () => {
      groupUnsub();
    }
  }, [])

  return (
    <Box paddingLeft={5} paddingRight={5} paddingTop={2}>
      <Stack direction='row' spacing={2} divider={<Divider orientation="vertical" flexItem />}>
        <Box width='100%'>
          <FormControl fullWidth>
            <InputLabel id="groups">Groups</InputLabel>
            <Select
              labelId="groups"
              id="groupsID"
              value={currGroup}
              label="Groups"
              onChange={e => {setCurrGroup(e.target.value)}}
            >
            {groups.map((group, index) => {
              return (
                <MenuItem value={group} key={index}>{group.name}</MenuItem>
              )
            })}
            </Select>
          </FormControl>
          {currGroup !== null ? <BackroomsGroup currGroup={currGroup}/> : ""}
        </Box>
      </Stack>
    </Box>
  )
}
