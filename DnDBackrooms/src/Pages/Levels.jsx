import React, { useEffect, useState } from 'react'
import db from '../Components/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import BackroomsLevel from '../Components/BackroomsLevel';
import { Box, Chip, Container, Divider, Drawer, FormControl, InputLabel, List, ListItem, ListItemButton, ListItemText, ListSubheader, MenuItem, OutlinedInput, Select, Toolbar, Typography } from '@mui/material';

export default function Levels() {
  const [levels, setLevels] = useState([]);
  const [items, setItems] = useState([]);
  const [entities, setEntities] = useState([]);

  const [currLevel, setCurrLevel] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filteredEntities, setFilteredEntities] = useState([]);
  const [filteredLevels, setFilteredLevels] = useState([]);
  const [levelType, setLevelType] = useState(' ');

  useEffect(() => {
    const levelsRef = collection(db, 'levels');
    const q = query(levelsRef, orderBy("levelNum", "asc"));
    const itemsRef = collection(db, 'items');
    const entitiesRef = collection(db, 'entities');
  
    const unsubLevels = onSnapshot(q, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setLevels(objects);
      setFilteredLevels(objects);
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

  const handleSearch = (e) => {
    setCurrLevel(null); //Do this first to prevent re-rendering while typing

    let searchedLevels = [];
    if(e.target.value === "") {
      setFilteredLevels(levels);
      return;
    }

    for(let i = 0; i < levels.length; i++) {
      if(levels[i].name.toUpperCase().includes(e.target.value.toUpperCase()) || levels[i].levelNum.toUpperCase().includes(e.target.value.toUpperCase())) {
        searchedLevels.push(levels[i]);
      }
    }
    setFilteredLevels(searchedLevels);
  }

  const handleTypeSearch = (e) => {
    setCurrLevel(null); //Do this first to prevent re-rendering when the value is ""
    setLevelType(e.target.value);
  }

  return (
    <>
      <Box paddingLeft={5} paddingRight={5} display='flex'>
        <Box>
          <Toolbar />
          <List>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
              <InputLabel htmlFor="search">Search level</InputLabel>
              <OutlinedInput
                id="search"
                type='text'
                label="search"
                onChange={(e) => handleSearch(e)}
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
              <InputLabel htmlFor="levelType">Level type</InputLabel>
              <Select
                labelId="levelType"
                id="levelType"
                value={levelType}
                label="levelType"
                onChange={(e) => handleTypeSearch(e)}
              >
                <MenuItem value={' '}>All</MenuItem>
                <MenuItem value={'mapped'}>Mapped</MenuItem>
                <MenuItem value={'noMap'}>Not mapped</MenuItem>
              </Select>
            </FormControl>
            {filteredLevels.map((level, index) => {
              return (
                levelType === ' ' ? 
                  <ListItem key={index} disablePadding>
                    <ListItemButton onClick={() => setCurrLevel(level)}>
                      <ListItemText><Chip label={level.levelNum} />{level.name}</ListItemText>
                    </ListItemButton>
                  </ListItem>
                :
                  (level.genType[0] === "Room" || level.genType[0] === "Hall") && levelType === "mapped" ?
                    <ListItem key={index} disablePadding>
                      <ListItemButton onClick={() => setCurrLevel(level)}>
                        <ListItemText><Chip label={level.levelNum} />{level.name}</ListItemText>
                      </ListItemButton>
                    </ListItem>
                  :
                    level.genType === "None" && levelType === "noMap" ?
                      <ListItem key={index} disablePadding>
                        <ListItemButton onClick={() => setCurrLevel(level)}>
                          <ListItemText><Chip label={level.levelNum} />{level.name}</ListItemText>
                        </ListItemButton>
                      </ListItem>
                    :
                      ""
              )
            })}
          </List>
        </Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {currLevel !== null ? <BackroomsLevel items={filteredItems} entities={filteredEntities} level={currLevel} key={new Date().getTime()} /> : ""}
        </Box>
      </Box>
    </>
  )
}