import React, { useEffect, useState } from 'react'
import db from '../Components/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { DataGrid } from '@mui/x-data-grid';
import BackroomsLevel from '../Components/BackroomsLevel';
import { Box, Chip, Container, Divider, Drawer, FormControl, InputLabel, List, ListItem, ListItemButton, ListItemText, ListSubheader, OutlinedInput, Toolbar, Typography } from '@mui/material';

export default function Levels() {
  const [levels, setLevels] = useState([]);
  const [items, setItems] = useState([]);
  const [entities, setEntities] = useState([]);

  const [currLevel, setCurrLevel] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filteredEntities, setFilteredEntities] = useState([]);
  const [filteredLevels, setFilteredLevels] = useState([]);
  const [mappedSearched, setMappedSearched] = useState([]);
  const [noMappedSearched, setNoMappedSearched] = useState([]);

  useEffect(() => {
    const levelsRef = collection(db, 'levels');
    const q = query(levelsRef, orderBy("levelNum", "asc"));
    const itemsRef = collection(db, 'items');
    const entitiesRef = collection(db, 'entities');
  
    const unsubLevels = onSnapshot(q, (querySnapshot) => {
      const objects = [];
      const noGens = [];
      querySnapshot.forEach((doc) => {
        if(doc.data().genType === 'None') {
          noGens.push(doc.data());
        }
        else {
          objects.push(doc.data());
        }
      })
      setLevels(objects);
      setFilteredLevels(noGens);
      setMappedSearched(objects);
      setNoMappedSearched(noGens);
    })

    const unsubItems = onSnapshot(itemsRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setItems(objects);
    })
  
    const unsubEntities = onSnapshot(entitiesRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setEntities(objects);
    })
  
    return () => {
      unsubLevels();
      unsubItems();
      unsubEntities();
    }
  }, []);

  useEffect(() => {
    if(currLevel === null) return;

    let level = {};
    
    for(let i = 0; i < levels.length; i++) {
      if(levels[i].name === currLevel) {
        level = levels[i];
      }
    }

    let filter = [];
    for(let i = 0; i < items.length; i++) {
      for(let j = 0; j < items[i].locations.length; j++) {
        if(items[i].locations[j] === level.name || items[i].locations[j] === level.levelNum || items[i].locations[j] === 'All') {
          filter.push(items[i]);
          break;
        }
      }
    }
    setFilteredItems(filter);
  
    filter = [];
    if(currLevel.noEntities === true) {
      setFilteredEntities(filter);
    }
    else {
      for(let i = 0; i < entities.length; i++) {
        for(let j = 0; j < entities[i].locations.length; j++) {
          if(entities[i].locations[j] === level.name || entities[i].locations[j] === level.levelNum || entities[i].locations[j] === 'All') {
            filter.push(entities[i]);
            break;
          }
        }
      }
      setFilteredEntities(filter);
    }
  }, [currLevel])

  const handleMappedSearch = (e) => {
    let searchedLevels = [];
    if(e.target.value === "") {
      setMappedSearched(levels);
      return;
    }

    for(let i = 0; i < levels.length; i++) {
      if(levels[i].name.toUpperCase().includes(e.target.value.toUpperCase()) || levels[i].levelNum.toUpperCase().includes(e.target.value.toUpperCase())) {
        searchedLevels.push(levels[i]);
      }
    }
    setMappedSearched(searchedLevels);
  }

  const handleNoMapSearch = (e) => {
    let searchedLevels = [];
    if(e.target.value === "") {
      setNoMappedSearched(filteredLevels);
      return;
    }

    for(let i = 0; i < filteredLevels.length; i++) {
      if(filteredLevels[i].name.toUpperCase().includes(e.target.value.toUpperCase()) || filteredLevels[i].levelNum.toUpperCase().includes(e.target.value.toUpperCase())) {
        searchedLevels.push(filteredLevels[i]);
      }
    }
    setNoMappedSearched(searchedLevels);
  }

  return (
    <>
      <Box paddingLeft={5} paddingRight={5} display='flex'>
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
              <ListSubheader>Mapped</ListSubheader>
              <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="search">Search level</InputLabel>
                <OutlinedInput
                  id="search"
                  type='text'
                  label="search"
                  onChange={(e) => handleMappedSearch(e)}
                />
              </FormControl>
              {mappedSearched.map((level, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton onClick={() => setCurrLevel(level)}>
                    <ListItemText><Chip label={level.levelNum} />{level.name}</ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              <ListSubheader>Not Mapped</ListSubheader>
              <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="search2">Search level</InputLabel>
                <OutlinedInput
                  id="search2"
                  type='text'
                  label="search2"
                  onChange={(e) => handleNoMapSearch(e)}
                />
              </FormControl>
              {noMappedSearched.map((level, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton onClick={() => setCurrLevel(level)}>
                    <ListItemText><Chip label={level.levelNum} />{level.name}</ListItemText>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {currLevel !== null ? <BackroomsLevel items={filteredItems} entities={filteredEntities} level={currLevel} /> : ""}
      </Box>
      </Box>
    </>
  )
}