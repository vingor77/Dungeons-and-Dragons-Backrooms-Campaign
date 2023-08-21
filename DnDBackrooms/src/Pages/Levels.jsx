import { Container, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import db from '../Components/firebase';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { DataGrid } from '@mui/x-data-grid';

export default function Levels() {
  const [levels, setLevels] = useState([]);
  const [items, setItems] = useState([]);
  const [entities, setEntities] = useState([]);

  const [currLevel, setCurrLevel] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filteredEntities, setFilteredEntities] = useState([]);

  //Levels
  useEffect(() => {
    const levelsRef = collection(db, 'levels');
    const q = query(levelsRef, orderBy("levelNum", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setLevels(objects);
    })

    return () => {
      unsub();
    }
  }, []);

  //Items
  useEffect(() => {
    const itemsRef = collection(db, 'items');
  
    const unsub = onSnapshot(itemsRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setItems(objects);
    })
  
    return () => {
      unsub();
    }
  }, []);

  //Entities
  useEffect(() => {
    const entitiesRef = collection(db, 'entities');
  
    const unsub = onSnapshot(entitiesRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setEntities(objects);
    })
  
    return () => {
      unsub();
    }
  }, []);

  useEffect(() => {
    if(currLevel === null) return;

    let filter = [];
    for(let i = 0; i < items.length; i++) {
      for(let j = 0; j < items[i].locations.length; j++) {
        if(items[i].locations[j] === currLevel.name || items[i].locations[j] === currLevel.levelNum || items[i].locations[j] === 'All') {
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
          if(entities[i].locations[j] === currLevel.name || entities[i].locations[j] === currLevel.levelNum || entities[i].locations[j] === 'All') {
            filter.push(entities[i]);
            break;
          }
        }
      }
      setFilteredEntities(filter);
    }
  }, [currLevel])

  const CreateItemGrid = () => {
    if(currLevel === null) return;

    const dataGridCols = [
      { field: 'id', headerName: 'ID', width: 90},
      { 
        field: 'name', 
        headerName: 'Item Name', 
        width: 250 
      },
      {
        field: 'num',
        headerName: 'Item number',
        width: 250,
      },
      {
        field: 'rarity',
        headerName: 'Rarity',
        width: 250,
        editable: true,
      },
      {
        field: 'price',
        headerName: 'Artifact Price',
        width: 250,
        editable: true,
      },
    ];

    let count = 0;
    let arPrice = 0;
    const dataGridRows = [];

    filteredItems.map(item => {
      {item.artifactPrice === -1 ? arPrice = "N/A": arPrice = item.artifactPrice}
      count++;
      const row = {
        id: count,
        name: item.name,
        num: item.itemNum,
        rarity: item.rarity,
        price: arPrice,
      }
      dataGridRows.push(row);
    })

    return (
      <DataGrid
        rows={dataGridRows}
        columns={dataGridCols}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            }
          }
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    );
  }

  const CreateEntityGrid = () => {
    if(entities.length === 0 || currLevel === null) return;

    const dataGridCols = [
        { field: 'id', headerName: 'ID', width: 90},
        { 
          field: 'name', 
          headerName: 'Entity Name', 
          width: 250 
        },
        {
          field: 'num',
          headerName: 'Entity number',
          width: 250,
        },
        {
          field: 'cr',
          headerName: 'Challenge Rating',
          width: 250,
          editable: true,
        },
    ];
    
    let count = 0;
    let cr = "";
    const dataGridRows = [];
  
    filteredEntities.map(entity => {
      {entity.challengeRating === 0 ? cr = "N/A": cr = entity.challengeRating}
      count++;
      const row = {
        id: count,
        name: entity.name,
        num: entity.entityNum,
        cr: cr,
      }
      dataGridRows.push(row);
    })

    return (
        <DataGrid
          rows={dataGridRows}
          columns={dataGridCols}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              }
            }
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
    );
  }

  return (
    <Container>
      {levels.map((level, index) => {
        return <button onClick={() => setCurrLevel(level)} key={index}>Set to {level.name}</button>
      })}
      {currLevel !== null ?
        <>
          <Typography variant='h4'>Current map:</Typography>
          <CreateMap />
          <Typography variant='h4'>Possible spawned Items:</Typography>
          <CreateItemGrid />
          <Typography variant='h4'>Possible spawned Entities:</Typography>
          <CreateEntityGrid />
          <Typography variant='h4'>Possible spawned Specials</Typography>
          <ul>
            {currLevel.specials.map((special, index) => {
              return <li key={index}>{special}</li>
            })}
          </ul>
        </>:
        ""
      }
    </Container>
  )
}

function CreateMap() {
  //Get random number and make it odd then find the center piece
  let size = Math.round(Math.random() * 10) + 15;
  if(size % 2 == 0) {
    size++;
  }
  const center = Math.round(size / 2);

  //Create grid with 0's, meaning passable terrain
  let grid = [];
  for(let i = 0; i < size; i++) {
    let y = [];
    for(let j = 0; j < size; j++) {
      y.push(0);
    }
    grid.push(y);
  }

  //Make sure the rooms can connect.
  for(let i = 0; i < grid.length; i++) {
    if(i !== (center - 3) && i !== (center - 2) && i !== (center - 1) && i !== (center) && i !== (center + 1)) {
      grid[0][i] = 1;
      grid[i][0] = 1;
      grid[size - 1][i] = 1;
      grid[i][size - 1] = 1;
    }
  }

  //Algorithm to create the rooms. Needs to be done. TODO if you will

  return (
    <Table sx={{border: '1px solid black'}}>
      <TableBody color='inherit'>
        {grid.map((row, index) => {
          return (
            <TableRow sx={{border: '1px solid black'}} key={index}>
              {row.map((cell, index) => {
                return cell === 1 ? <TableCell sx={{color: 'black', border: '1px solid black', bgcolor: 'black', width: '(100/size)%'}} key={index}>{cell}</TableCell>: <TableCell sx={{color: 'white', border: '1px solid black', bgcolor: 'white'}} key={index}>{cell}</TableCell>
              })}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
    //Table of possible items
    //Table of possible entities
    //table of possible special events
  )
}