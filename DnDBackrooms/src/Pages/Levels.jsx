import React, { useEffect, useState } from 'react'
import db from '../Components/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { DataGrid } from '@mui/x-data-grid';
import BackroomsLevel from '../Components/BackroomsLevel';
import { Box, Container } from '@mui/material';

export default function Levels() {
  const [levels, setLevels] = useState([]);
  const [items, setItems] = useState([]);
  const [entities, setEntities] = useState([]);

  const [currLevel, setCurrLevel] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filteredEntities, setFilteredEntities] = useState([]);
  const [filteredLevels, setFilteredLevels] = useState([]);

  useEffect(() => {
    const levelsRef = collection(db, 'levels');
    const q = query(levelsRef, orderBy("levelNum", "asc"));
    const itemsRef = collection(db, 'items');
    const entitiesRef = collection(db, 'entities');
  
    const unsubLevels = onSnapshot(q, (querySnapshot) => {
      const objects = [];
      const noGens = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
        if(doc.data().genType[0] === 'None') {
          noGens.push(doc.data().name);
        }
      })
      setLevels(objects);
      setFilteredLevels(noGens);
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

  const dataGridCols = [
    { field: 'id', headerName: 'ID', flex: 0},
    { 
      field: 'name', 
      headerName: 'Level Name', 
      flex: 1
    },
    {
      field: 'levelNum',
      headerName: 'Level number',
      flex: 1
    },
    {
      field: 'time',
      headerName: 'Time flow',
      flex: 1
    },
    {
      field: 'wifi',
      headerName: 'Wi-Fi strength',
      flex: 1
    },
    {
      field: 'sanityDrainClass',
      headerName: 'Sanity Drain Class',
      flex: 1
    },
    {
      field: 'sanityDrainType',
      headerName: 'Sanity Drain Type',
      flex: 1
    },
    {
      field: 'survivalDifficultyClass',
      headerName: 'Survival Difficulty Class',
      flex: 1
    },
  ];

  let count = 0;
  const dataGridRows = [];

  levels.map(level => {
    count++;
    const row = {
      id: count,
      name: level.name,
      levelNum: level.levelNum,
      time: level.time,
      wifi: level.wifi,
      sanityDrainClass: level.sanityDrainClass,
      sanityDrainType: level.sanityDrainType,
      survivalDifficultyClass: level.survivalDifficultyClass,
    }
    dataGridRows.push(row);
  })

  return (
    <>
      <Box paddingLeft={5} paddingRight={5}>
        <DataGrid
          onRowClick={(dataGridRows) => {setCurrLevel(dataGridRows.row.name)}}
          rows={dataGridRows}
          columns={dataGridCols}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              }
            },
            columns: {
              columnVisibilityModel: {
                id: false
              }
            }
          }}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
        />

        {levels.map((level, index) => {
          return (
            level.name === currLevel ? 
            <BackroomsLevel 
              key={index}
              items={filteredItems}
              entities={filteredEntities}
              level={level}
            />: ""
          )
        })}
      </Box>
    </>
  )
}