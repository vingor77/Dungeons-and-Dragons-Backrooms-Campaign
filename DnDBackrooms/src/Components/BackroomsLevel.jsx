import { Box, Button, Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useReducer, useState } from 'react'
import BackroomsItem from './BackroomsItem';
import BackroomsEntities from './BackroomsEntities';
import { collection, onSnapshot } from 'firebase/firestore';
import db from '../Components/firebase';

export default function BackroomsLevel(props) {
  const [spawn, setSpawn] = useState(-1);
  const [spawnType, setSpawnType] = useState("");
  const [map, setMap] = useState(null);
  const [currItem, setCurrItem] = useState("");
  const [currEntity, setCurrEntity] = useState("");
  const [regSpawns, setRegSpawns] = useState([]);
  const [possibleRegSpawns, setPossibleRegSpawns] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [initalize, setInitialize] = useState(true);

  useEffect(() => {
    const collectionRef = collection(db, 'regularSpawns');

    const unsub = onSnapshot(collectionRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setPossibleRegSpawns(objects);
    })

    return () => {
      unsub();
    }
  }, [])

  useEffect(() => {
    let currType = spawnType;
    let nextType;

    if(spawn <= props.spawns[0]) {
      setSpawnType("Nothing");
      nextType = "Nothing"
    }
    else if(spawn > props.spawns[0] && spawn <= props.spawns[1]) {
      setSpawnType("Item");
      nextType = "Item"
    }
    else if(spawn > props.spawns[1] && spawn <= props.spawns[2]) {
      setSpawnType("Entity");
      nextType = "Entity"
    }
    else {
      setSpawnType("Special");
      nextType = "Special"
    }

    //Change it to force the map to actually update in the useEffect underneath.
    if(currType === nextType) {
      setSpawnType(currType + "1");
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
    const center = Math.ceil(size / 2) - 1;
  
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
      if(i !== (center - 2) && i !== (center - 1) && i !== center && i !== (center + 1) && i !== (center + 2)) {
        grid[0][i] = 1;
        grid[i][0] = 1;
        grid[size - 1][i] = 1;
        grid[i][size - 1] = 1;
      }
    }

    //Wall spawning algorithm. Jank for now.
    let randNum = Math.floor(Math.random() * 100);
    if(randNum % 2 === 0) grid[1][1] = 1;

    for(let i = 1; i < grid.length; i++) {
      for(let j = 1; j < grid[i].length; j++) {
        if(i === 1 && j === 1) continue;
        if((i === (center - 2) || i === (center - 1) || i === center || i === (center + 1) || i === (center + 2) || i === (size - 1))
        && (j === (center - 2) || j === (center - 1) || j === center || j === (center + 1) || j === (center + 2) || j === (size - 1))) continue;

        randNum = Math.floor(Math.random() * 100);
        if(randNum % 4 === 0) {
          grid[i][j] = 1;
        }
      }
    }

    let regSpawnCount = Math.floor(Math.random() * (Number(props.regSpawnCount) + 1));

    if(possibleRegSpawns.length > 0) {
      let tempRegs = [];
      for(let i = 0; i < regSpawnCount; i++) {
        let noun = possibleRegSpawns[0].spawns[Math.floor(Math.random() * possibleRegSpawns[0].spawns.length)];
        for(let j = 0; j < tempRegs.length; j++) {
          while(noun === tempRegs[j]) {
            noun = possibleRegSpawns[0].spawns[Math.floor(Math.random() * possibleRegSpawns[0].spawns.length)];
          }
        }
        tempRegs.push(noun);
      }
      setRegSpawns(tempRegs);
    }

    //Spawn location on the map.
    if(spawn !== -1 && showMap) {
      const spawnLocation = () => {
        let xSpawn = Math.floor(Math.random() * size);
        let ySpawn = Math.floor(Math.random() * size);
  
        while(grid[xSpawn][ySpawn] === 1) {
          xSpawn = Math.floor(Math.random() * size);
          ySpawn = Math.floor(Math.random() * size);
        }
  
        switch(spawnType) {
          case "Item":
            grid[xSpawn][ySpawn] = 2;
            break;
          case "Item1":
            grid[xSpawn][ySpawn] = 2;
            break;
          case "Entity":
            grid[xSpawn][ySpawn] = 3;
            break;
          case "Entity1":
            grid[xSpawn][ySpawn] = 3;
            break;
          case "Special":
            grid[xSpawn][ySpawn] = 4;
            break;
          case "Special1":
            grid[xSpawn][ySpawn] = 4;
            break;
        }

        for(let i = 0; i < regSpawnCount; i++) {
          while(grid[xSpawn][ySpawn] !== 0) {
            xSpawn = Math.floor(Math.random() * size);
            ySpawn = Math.floor(Math.random() * size);
          }
          grid[xSpawn][ySpawn] = 5;
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
                    case 4:
                      return <TableCell sx={{color: 'orange', border: '1px solid black', bgcolor: 'orange'}} key={index}>{cell}</TableCell>
                    default:
                      return <TableCell sx={{color: 'blue', border: '1px solid black', bgcolor: 'blue'}} key={index}>{cell}</TableCell>
                  }
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }, [spawnType]);
  
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
            },
            columns: {
              columnVisibilityModel: {
                id: false
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
            },
            columns: {
              columnVisibilityModel: {
                id: false
              }
            }
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </>
    );
  }

  const handleShowMap = () => {
    if(initalize) {
      setSpawn(Math.round(Math.random() * 100) + 1);
      setInitialize(false);
    }
    setShowMap(true);
  }

  const handleHideMap = () => {
    setShowMap(false);
  }

  const SpawnTable = () => {
    return (
      <Box border='1px solid black'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Rarity</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Roll</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Rare</TableCell>
              <TableCell>1-13</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Legendary</TableCell>
              <TableCell>14-16</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Common</TableCell>
              <TableCell>17-66</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Artifact</TableCell>
              <TableCell>67-68</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Uncommon</TableCell>
              <TableCell>69-93</TableCell> 
            </TableRow>
            <TableRow>
              <TableCell>Very Rare</TableCell>
              <TableCell>94-100</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    )
  }

  return (
    <>
      <Typography variant='h2'>Level {props.levelNum}, {props.name}</Typography>
      <Typography variant='h5'>Description:</Typography>
      <Typography variant='body1' sx={{textIndent: 25}}>{props.description}</Typography>
      {!showMap ? 
        <Button variant='outlined' onClick={handleShowMap}>Show Map</Button>: 
        <>
          <Button variant='outlined' onClick={handleHideMap}>Hide Map</Button>
          <Button onClick={() => setSpawn(Math.round(Math.random() * 100) + 1)} variant='outlined'>Generate new map</Button>
          {map}
          {spawnType === "Item" || spawnType === 'Item1' ?
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
            <br />
            <Typography variant='h5'>Rarity chances:</Typography>
            <SpawnTable />
            {regSpawns.length !== 0 ?
            <>
              <br />
              <Typography variant='h5'>Regular spawns(blue):</Typography>
              <Box border='1px solid black'>
                <br />
                <ul>
                  {regSpawns.map((spawn, index) => {
                    return <li key={index}>{spawn} </li>
                  })}
                </ul>
              </Box>
            </>:
            ""}
          </>: 
          ""}
          {spawnType === "Entity" || spawnType === "Entity1" ?
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
            {regSpawns.length !== 0 ?
            <>
              <br />
              <Typography variant='h5'>Regular spawns(blue):</Typography>
              <Box border='1px solid black'>
                <br />
                <ul>
                  {regSpawns.map((spawn, index) => {
                    return <li key={index}>{spawn} </li>
                  })}
                </ul>
              </Box>
            </>:
            ""}
          </>: 
          ""}
          {spawnType === "Special" || spawnType === "Special1" ?
          <>
            <Typography variant='h5'>Possible specials:</Typography>
            <Box border='1px solid black'>
              <ul>
                {props.specials.map((special, index) => {
                  return <li key={index}>{special}</li>
                })}
              </ul>
            </Box>
            {regSpawns.length !== 0 ?
            <>
              <br />
              <Typography variant='h5'>Regular spawns(blue):</Typography>
              <Box border='1px solid black'>
                <br />
                <ul>
                  {regSpawns.map((spawn, index) => {
                    return <li key={index}>{spawn} </li>
                  })}
                </ul>
              </Box>
            </>:
            ""}
          </>:
          ""}
          {spawnType === 'Nothing' || spawnType === 'Nothing1' ?
            <>
              {regSpawns.length !== 0 ?
              <>
                <br />
                <Typography variant='h5'>Regular spawns(blue):</Typography>
                <Box border='1px solid black'>
                  <br />
                  <ul>
                    {regSpawns.map((spawn, index) => {
                      return <li key={index}>{spawn} </li>
                    })}
                  </ul>
                </Box>
              </>:
              ""}
            </>
            :""
          }
        </>
      }
    </>
  )
}