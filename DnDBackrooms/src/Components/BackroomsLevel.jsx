import { Button, Divider, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import BackroomsItem from './BackroomsItem';
import BackroomsEntities from './BackroomsEntities';

export default function BackroomsLevel(props) {
  const [spawn, setSpawn] = useState(-1);
  const [spawnType, setSpawnType] = useState("");
  const [map, setMap] = useState({});
  const [currItem, setCurrItem] = useState("");
  const [currEntity, setCurrEntity] = useState("");

  useEffect(() => {
    if(spawn <= props.spawns[0]) {
      setSpawnType("Nothing");
    }
    else if(spawn > props.spawns[0] && spawn <= props.spawns[1]) {
      setSpawnType("Item");
    }
    else if(spawn > props.spawns[1] && spawn <= props.spawns[2]) {
      setSpawnType("Entity");
    }
    else {
      setSpawnType("Special");
    }

    setCurrEntity("");
    setCurrItem("");
  }, [spawn])

  useEffect(() => {
    //Get random number and make it odd then find the center piece
    let size = Math.floor(Math.random() * 10) + 15;
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
    if(spawn !== -1) {
      const spawnLocation = () => {
        let xSpawn = Math.floor(Math.random() * size);
        let ySpawn = Math.floor(Math.random() * size);
  
        while(grid[xSpawn][ySpawn] === 1) {
          xSpawn = Math.round(Math.random() * size);
          ySpawn = Math.round(Math.random() * size);
        }
  
        switch(spawnType) {
          case "Item":
            grid[xSpawn][ySpawn] = 2;
            break;
          case "Entity":
            grid[xSpawn][ySpawn] = 3;
            break;
          case "Special":
            grid[xSpawn][ySpawn] = 4;
            break;
        }
      }
  
      spawnLocation();
    }

    setMap(
      <Table sx={{border: '1px solid black'}}>
        <TableBody color='inherit'>
          {grid.map((row, index) => {
            return (
              <TableRow sx={{border: '1px solid black'}} key={index}>
                {row.map((cell, index) => {
                  switch(cell) {
                    case 0:
                      return <TableCell sx={{color: 'white', border: '1px solid black', bgcolor: 'white'}} key={index}>{cell}</TableCell>
                    case 1:
                      return <TableCell sx={{color: 'black', border: '1px solid black', bgcolor: 'black'}} key={index}>{cell}</TableCell>
                    case 2:
                      return <TableCell sx={{color: 'green', border: '1px solid black', bgcolor: 'green'}} key={index}>{cell}</TableCell>
                    case 3:
                      return <TableCell sx={{color: 'red', border: '1px solid black', bgcolor: 'red'}} key={index}>{cell}</TableCell>
                    default:
                      return <TableCell sx={{color: 'orange', border: '1px solid black', bgcolor: 'orange'}} key={index}>{cell}</TableCell>
                  }
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }, [spawn, spawnType]);

  const CreateItemGrid = () => {
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

    props.items.map(item => {
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
      <>
        <br />
        <Typography variant='h5'>Possible items:</Typography>
        <Divider />
        <br />
        <DataGrid
          onRowClick={(dataGridRows) => setCurrItem(dataGridRows.row.name)}
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
      </>
    );
  }

  const CreateEntityGrid = () => {
    if(props.entities.length === 0 || props.noEntities === true) return;

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
        },
    ];
    
    let count = 0;
    let cr = "";
    const dataGridRows = [];
  
    props.entities.map(entity => {
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
        <>
          <br />
          <Typography variant='h5'>Possible entities:</Typography>
          <Divider />
          <br />
          <DataGrid
            onRowClick={(dataGridRows) => setCurrEntity(dataGridRows.row.name)}
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
        </>
    );
  }

  return (
    <>
      <Typography variant='h2'>Level {props.levelNum}, {props.name}</Typography>
      <Typography variant='h5'>Description:</Typography>
      <Typography variant='body1' sx={{textIndent: 25}}>{props.description}</Typography>
      {spawn === -1 ? 
        <Button variant='outlined' onClick={() => setSpawn(Math.round(Math.random() * 100) + 1)}>Generate map</Button>: 
        <>
          <Button onClick={() => setSpawn(Math.round(Math.random() * 100) + 1)}>New map</Button>
          <Button onClick={() => setSpawn(-1)} variant='outlined'>Delete map</Button>
          {map}
          {spawnType === "Item" ?
          <>
            <CreateItemGrid />
            {props.items.map((item, index) => {
              return (
                item.name === currItem ? 
                <BackroomsItem 
                  key={index}
                  name={item.name}
                  itemNum={item.itemNum}
                  locations={item.locations}
                  description={item.description}
                  table={item.table}
                />: ""
              )
            })}
          </>: 
          ""}
          {spawnType === "Entity" ?
          <>
            <CreateEntityGrid />
            {props.entities.map((entity, index) => {
              return (
                entity.name === currEntity ? 
                <BackroomsEntities 
                  key={index}
                  name={entity.name}
                  locations={entity.locations}
                  description={entity.description}
                  statBlock={entity.statBlock}
                  challengeRating={entity.challengeRating}
                  entityNum={entity.entityNum}
                />: ""
              )
            })}
          </>: 
          ""}
          {spawnType === "Special" ?
          <>
            <Typography variant='h5'>Possible specials:</Typography>
            <ul>
              {props.specials.map((special, index) => {
                return <li key={index}>{special}</li>
              })}
            </ul>
          </>:
          ""}
        </>
      }
    </>
  )
}