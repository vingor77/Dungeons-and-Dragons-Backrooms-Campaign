import React, { useEffect, useState } from 'react';
import db from '../Components/firebase';
import { Box, Button, Container, Divider, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { collection, onSnapshot } from 'firebase/firestore';
import BackroomsGroup from '../Components/BackroomsGroup';

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [currRelationGroup, setCurrRelationGroup] = useState(null);
  const [currNonRelationGroup, setCurrNonRelationGroup] = useState(null);
  const [relationGroups, setRelationGroups] = useState([]);
  const [noRelationGroups, setNoRelationGroups] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, 'groups');

    const groupUnsub = onSnapshot(collectionRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setGroups(objects);

      const relations = [];
      const noRelations = [];
  
      for(let i = 0; i < objects.length; i++) {
        if(objects[i].relations[0] === 'None') {
          noRelations.push(objects[i]);
        }
        else {
          relations.push(objects[i]);
        }
      }
  
      setRelationGroups(relations);
      setNoRelationGroups(noRelations);
    })

    return () => {
      groupUnsub();
    }
  }, [])

  return (
    <Box paddingLeft={5} paddingRight={5} paddingTop={2}>
      <Stack direction='row' spacing={2} divider={<Divider orientation="vertical" flexItem />}>
        <Box width='50%'>
          <FormControl fullWidth>
            <InputLabel id="relations">Relational Groups</InputLabel>
            <Select
              labelId="relations"
              id="relationsID"
              value={currRelationGroup}
              label="Relational"
              onChange={e => {setCurrRelationGroup(e.target.value)}}
            >
            {relationGroups.map((group, index) => {
              return (
                <MenuItem value={group}>{group.name}</MenuItem>
              )
            })}
            </Select>
          </FormControl>
          {currRelationGroup !== null ? <BackroomsGroup currGroup={currRelationGroup}/> : ""}
        </Box>
        
        <Box width='50%'>
          <FormControl fullWidth>
            <InputLabel id="noRelations">Non-Relational Groups</InputLabel>
            <Select
              labelId="noRelations"
              id="noRelationsID"
              value={currNonRelationGroup}
              label="Non-Relational"
              onChange={e => {setCurrNonRelationGroup(e.target.value)}}
            >
            {noRelationGroups.map((group, index) => {
              return (
                <MenuItem value={group}>{group.name}</MenuItem>
              )
            })}
            </Select>
          </FormControl>
          {currNonRelationGroup !== null ? <BackroomsGroup currGroup={currNonRelationGroup}/> : ""}
        </Box>
      </Stack>
    </Box>
  )
}
