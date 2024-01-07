import { Box, Button, Container, Divider, FormControl, Grid, Input, InputLabel, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import BackroomsItem from './BackroomsItem';
import BackroomsEntities from './BackroomsEntities';
import { collection, onSnapshot } from 'firebase/firestore';
import db from '../Components/firebase';
import CasinoShop from '../Images/CasinoRoomShop.png';

export default function BackroomsLevel(props) {
  const [possibleRegSpawns, setPossibleRegSpawns] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [initalize, setInitialize] = useState(true);
  const [currMap, setCurrMap] = useState([]);
  const [mapRendered, setMapRendered] = useState(null);
  const [spawnList, setSpawnList] = useState([]);
  const [regSpawnList, setRegSpawnList] = useState([]);
  const [roomDisplay, setRoomDisplay] = useState(-1);
  const [mapGrids, setmapGrids] = useState([]);
  const [menuData, setMenuData] = useState({
    toggled: false,
    location: {
      x: 0,
      y: 0
    },
    target: {
      grid: 0,
      row: 0,
      cell: 0
    }
  });

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

  const createRoomPaths = (grid, size, center, gridNum) => {
    const paths = [];
    
    const startPoints = [];
    for(let i = 0; i < 4; i++) {
      startPoints.push(Math.floor(Math.random() * 5));
    }
    paths[0] = [{i: (center - 2 + startPoints[0]), j: 0}]; //Left
    paths[1] = [{i: (center - 2 + startPoints[1]), j: (size - 1)}]; //Right
    paths[2] = [{i: 0, j: (center - 2 + startPoints[2])}]; //Top
    paths[3] = [{i: (size - 1), j: (center - 2 + startPoints[3])}]; //Bottom

    for(let i = 0; i < 4; i++) {
      let end = false;
      while(!end) {
        const direction = Math.floor(Math.random() * 4);
        switch(direction) {
          case 0:
            if(paths[i][paths[i].length - 1].j - 1 < 0) {
              break;
            }

            paths[i].push({i: paths[i][paths[i].length - 1].i, j: paths[i][paths[i].length - 1].j - 1});
            break;
          case 1:
            if(paths[i][paths[i].length - 1].j + 1 > (size - 1)) {
              break;
            }

            paths[i].push({i: paths[i][paths[i].length - 1].i, j: paths[i][paths[i].length - 1].j + 1});
            break;
          case 2:
            if(paths[i][paths[i].length - 1].i - 1 < 0) {
              break;
            }

            paths[i].push({i: paths[i][paths[i].length - 1].i - 1, j: paths[i][paths[i].length - 1].j});
            break;
          default:
            if(paths[i][paths[i].length - 1].i + 1 > (size - 1)) {
              break;
            }

            paths[i].push({i: paths[i][paths[i].length - 1].i + 1, j: paths[i][paths[i].length - 1].j})
            break;
        }

        if(i === 0) {
          if(grid[paths[i][paths[i].length - 1].i][paths[i][paths[i].length - 1].j] === -1 && paths[i][paths[i].length - 1].j !== 0) {
            end = true;
          }
        }
        else if(i === 1) {
          if(grid[paths[i][paths[i].length - 1].i][paths[i][paths[i].length - 1].j] === -1 && paths[i][paths[i].length - 1].j !== (size - 1)) {
            end = true;
          }
        }
        else if(i === 2) {
          if(grid[paths[i][paths[i].length - 1].i][paths[i][paths[i].length - 1].j] === -1 && paths[i][paths[i].length - 1].i !== 0) {
            end = true;
          }
        }
        else {
          if(grid[paths[i][paths[i].length - 1].i][paths[i][paths[i].length - 1].j] === -1 && paths[i][paths[i].length - 1].i !== (size - 1)) {
            end = true;
          }
        }
      }
    }

    for(let i = 0; i < paths.length; i++) {
      for(let j = 0; j < paths[i].length; j++) {
        if(grid[paths[i][j].i][paths[i][j].j] !== -1) {
          grid[paths[i][j].i][paths[i][j].j] = 0;
        }
      }
    }

    return finishMap(grid, size, center, gridNum);
  }

  const createHallPaths = (grid, size, center, gridNum) => {
    const quadrants = [];
    for(let i = 0; i < 4; i++) {
      quadrants[i] = Math.floor(Math.random() * 2); //0 for fail, 1 for success
    }

    let fails = 0;
    for(let i = 0; i < quadrants.length; i++) {
      if(quadrants[0] === 0) {
        fails++;
      }
    }

    if(fails === 4) {
      switch(Math.floor(Math.random() * 4)) {
        case 0:
          quadrants[0] = 1;
          break;
        case 1:
          quadrants[1] = 1;
          break;
        case 2:
          quadrants[2] = 1;
          break;
        default:
          quadrants[3] = 1;
          break;
      }
    }

    //Left
    if(quadrants[0] === 1) {
      for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[i].length; j++) {
          if(j !== 0 && i <= center + 2 && i >= center - 2 && j <= center + 2) {
            grid[i][j] = 0;
          } 
        }
      }
    }

    //Right
    if(quadrants[1] === 1) {
      for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[i].length; j++) {
          if(j !== size - 1 && i <= center + 2 && i >= center - 2 && j >= center - 2) {
            grid[i][j] = 0;
          } 
        }
      }
    }

    //Bottom
    if(quadrants[2] === 1) {
      for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[i].length; j++) {
          if(i !== size - 1 && j <= center + 2 && j >= center - 2 && i >= center - 2) {
            grid[i][j] = 0;
          } 
        }
      }
    }

    //Top
    if(quadrants[3] === 1) {
      for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[i].length; j++) {
          if(i !== 0 && j <= center + 2 && j >= center - 2 && i <= center + 2) {
            grid[i][j] = 0;
          } 
        }
      }
    }

    return finishMap(grid, size, center, gridNum);
  }

  const finishMap = (grid, size, center, gridNum) => {
    //Create map side walls 
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        if(gridNum !== 4) {
          if((i < (center - 2) || i > (center + 2)) && (j === 0 || j === (size - 1))) {
            grid[i][j] = 1;
          }
          if((j < (center - 2) || j > (center + 2)) && (i === 0 || i === (size - 1))) {
            grid[i][j] = 1;
          }
        }

        if(grid[i][j] === -1) {
          grid[i][j] = 0;
        }
      }
    }

    return grid;
  }

  const getEntities = (maxCR) => {
    const chosenEntities = [];
    let cutOff = 1000;
    let currCR = maxCR;
    const maxPlayers = 5;

    if(maxCR > 0) {
      while(chosenEntities.length < maxPlayers && cutOff > 0) {
        const entity = props.entities[Math.floor(Math.random() * props.entities.length)];
  
        if(entity.challengeRating <= currCR && entity.challengeRating > 0

          && entity.entityNum > 0 && entity.entityNum < 62 && entity.entityNum !== 1 && entity.entityNum !== 18 && entity.entityNum !== 26 //entity num checks are in place since not all stat blocks are finished. Remove this line later.

        ) {
          currCR -= entity.challengeRating;
          chosenEntities.push(entity);
        }
  
        if(currCR <= 0 && chosenEntities.length > 0) {
          break;
        }
        cutOff--;
      }
    }
    else {
      let entity = props.entities[Math.floor(Math.random() * props.entities.length)];

      while(entity.challengeRating !== 0) {
        entity = props.entities[Math.floor(Math.random() * props.entities.length)];
      }

      chosenEntities.push(entity);
    }

    return chosenEntities;
  }

  const getSpecials = () => {
    const special = Math.floor(Math.random() * props.level.specials.length);
    return [props.level.specials[special]];
  }

  const createSpawn = (grid, size) => {
    const whatSpawns = Math.floor(Math.random() * 101) + 1;
    let spawn = "";
    if(whatSpawns <= props.level.spawns[0]) {
      spawn = 'nothing';
    }
    else if(whatSpawns > props.level.spawns[0] && whatSpawns <= props.level.spawns[1]) {
      spawn = "item"
    }
    else if(whatSpawns > props.level.spawns[1] && whatSpawns <= props.level.spawns[2]) {
      spawn = "entity"
    }
    else {
      spawn = "special"
    }

    //Find location of the spawn, rerolling walls
    let x = Math.floor(Math.random() * size);
    let y = Math.floor(Math.random() * size);

    while(grid[x][y] === 1) {
      x = Math.floor(Math.random() * size);
      y = Math.floor(Math.random() * size);
    }

    switch(spawn) {
      case "item":
        grid[x][y] = 2;
        let selectedItem = getItemRarity();
        return (
          [grid, selectedItem]
        )
      case "entity":
        let maxCR = getMaxCR([10, 60, 70, 80, 90]); //Tier 2 chars = [10, 20, 70, 80, 90]. Tier 3 = [10, 20, 30, 80, 90]. Tier 4 = [10, 20, 30, 80, 90]. Tier 5 = [10, 20, 30, 40, 90]. Tier 6 = [10, 20, 30, 40, 50].
        let entityList = getEntities(maxCR);
        for(let i = 0; i < entityList.length; i++) {
          while(grid[x][y] === 1 || grid[x][y] === 3) {
            x = Math.floor(Math.random() * size);
            y = Math.floor(Math.random() * size);
          }
          grid[x][y] = 3;
        }
        grid[x][y] = 3;
        return (
          [grid, entityList]
        );
      case "special":
        grid[x][y] = 4;
        let specials = getSpecials();
        return [grid, specials];
      default:
        return [grid, null];
    }
  }

  const createRegSpawns = (grid, size) => {
    let regSpawnCount = Math.floor(Math.random() * (Number(props.level.regSpawns) + 1));
    let tempRegs = [];

    if(possibleRegSpawns.length > 0) {
      for(let i = 0; i < regSpawnCount; i++) {
        let noun = possibleRegSpawns[0].spawns[Math.floor(Math.random() * possibleRegSpawns[0].spawns.length)];
        for(let j = 0; j < tempRegs.length; j++) {
          while(noun === tempRegs[j]) {
            noun = possibleRegSpawns[0].spawns[Math.floor(Math.random() * possibleRegSpawns[0].spawns.length)];
          }
        }
        tempRegs.push(noun);
      }
    }

    for(let i = 0; i < regSpawnCount; i++) {
      let x = Math.floor(Math.random() * size);
      let y = Math.floor(Math.random() * size);
  
      while(grid[x][y] === 1 || grid[x][y] === 2 || grid[x][y] === 3 || grid[x][y] === 4 || grid[x][y] === 5) {
        x = Math.floor(Math.random() * size);
        y = Math.floor(Math.random() * size);
      }

      grid[x][y] = 5 + i;
    }

    return [grid, tempRegs];
  }

  const createMap = () => {
    if(props.level.genType[0] === 'None') return;

    const size = 17; //Arbitrary number I like.
    const center = 8;
    const mapPieces = [];
    const spawnedThings = [];
    const regSpawnedThings = [];
    for(let i = 0; i < 9; i++) {
      //Make the grid with the openings being set to -1.
      let grid = [];
      for(let i = 0; i < size; i++) {
        let tempArr = [];
        for(let j = 0; j < size; j++) {
          if(i >= (center - 2) && i <= (center + 2) && (j === 0 || j === (size - 1))) {
            tempArr[j] = -1;
          }
          else if((i === 0 || i === (size - 1)) && j >= (center - 2) && j <= (center + 2)) {
            tempArr[j] = -1;
          }
          else {
            tempArr[j] = 1;
          }
        }
        grid.push(tempArr);
      }

      //Set up the map, then find what spawns, then add regular spawns. Also, check spawn type.
      const type = props.level.genType[Math.floor(Math.random() * props.level.genType.length)];
      setMapRendered(true);
  
      switch(type) {
        case 'Room':
          grid = createRoomPaths(grid, size, center, i);
          break;
        case 'Hall':
          grid = createHallPaths(grid, size, center, i);
          break;
      }

      const spawnedItems = createSpawn(grid, size);
      const regSpawns = createRegSpawns(spawnedItems[0], size);
      grid = regSpawns[0];

      mapPieces.push(grid);
      if(spawnedItems[1] !== null) {
        spawnedThings.push(spawnedItems[1]);
      }
      else {
        spawnedThings.push(null);
      }

      if(regSpawns[1].length !== 0) {
        regSpawnedThings.push(regSpawns[1]);
      }
      else {
        regSpawnedThings.push(null);
      }
    }

    const tables = [];
    setmapGrids(mapPieces);

    mapPieces.map((mapPiece, index1) => {
      tables.push (
        <Table sx={{border: '1px solid green'}} key={index1}>
          <TableBody color='inherit'>
            {mapPiece.map((row, index2) => {
              return (
                <TableRow sx={{border: '1px solid green'}} key={index2}>
                  {row.map((cell, index3) => {
                    switch(cell) {
                      case 0:
                        return <TableCell style={{color: 'white', border: '1px solid black', backgroundColor: 'white'}} key={index3} onContextMenu={e => customMenu(e, index1, index2, index3)}>{cell}</TableCell>
                      case 1:
                        return <TableCell style={{color: 'black', border: '1px solid black', backgroundColor: 'black'}} key={index3}>{cell}</TableCell>
                      case 2:
                        return <TableCell style={{color: 'green', border: '1px solid black', backgroundColor: 'green'}} key={index3} onContextMenu={e => customMenu(e, index1, index2, index3)}>{cell}</TableCell>
                      case 3:
                        return <TableCell style={{color: 'red', border: '1px solid black', backgroundColor: 'red'}} key={index3} onContextMenu={e => customMenu(e, index1, index2, index3)}>{cell}</TableCell>
                      case 4:
                        return <TableCell style={{color: 'orange', border: '1px solid black', backgroundColor: 'orange'}} key={index3} onContextMenu={e => customMenu(e, index1, index2, index3)}>{cell}</TableCell>
                      default:
                        return <TableCell style={{color: 'white', border: '1px solid black', backgroundColor: 'blue'}} key={index3} onContextMenu={e => customMenu(e, index1, index2, index3)}>{cell - 4}</TableCell>
                    }
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )
    })
    
    setSpawnList(spawnedThings);
    setRegSpawnList(regSpawnedThings);
    setCurrMap(tables);
  }

  const customMenu = (e, grid, row, cell) => {
    e.preventDefault();
    setMenuData({
      toggled: true,
      location: {
        x: e.pageX,
        y: e.pageY
      },
      target: {
        grid: grid,
        row: row,
        cell: cell
      }
    });
  }

  const getItemRarity = () => {
    //Roll for rarity then filter out
    const findRarity = Math.floor(Math.random() * 100) + 1;
    let itemRaritySpawn = "";
    if(findRarity > 0 && findRarity <= 13) {
      itemRaritySpawn = 'Rare';
    }
    else if(findRarity > 13 && findRarity <= 16) {
      itemRaritySpawn = "Legendary";
    }
    else if(findRarity > 16 && findRarity <= 66) {
      itemRaritySpawn = "Common";
    }
    else if(findRarity > 66 && findRarity <= 68) {
      itemRaritySpawn = "Artifact";
    }
    else if(findRarity > 68 && findRarity <= 93) {
      itemRaritySpawn = "Uncommon";
    }
    else {
      itemRaritySpawn = "Very Rare";
    }
    
    const filteredItems = [];
    props.items.map(item => {
      if(item.rarity === itemRaritySpawn) {
        filteredItems.push(item);
      }
    })

    const item = [];
    const selectedItem = filteredItems[Math.floor(Math.random() * filteredItems.length)];
    item.push(selectedItem);
    return item;
  }

  const getMaxCR = (tier) => {
    //10% chance for CR 0. 50% chance for tier main. 10% each for each other tier
    const encounterDifficulty = Math.floor(Math.random() * 100) + 1;

    if(encounterDifficulty >= 0 && encounterDifficulty <= tier[0]) {
      return 0;
    }
    else if(encounterDifficulty > tier[0] && encounterDifficulty <= tier[1]) {
      return Math.floor(Math.random() * 6) + 1; //1-6
    }
    else if(encounterDifficulty > tier[1] && encounterDifficulty <= tier[2]) {
      return Math.floor(Math.random() * 6) + 7; //7-12
    }
    else if(encounterDifficulty > tier[2] && encounterDifficulty <= tier[3]) {
      return Math.floor(Math.random() * 6) + 13; //13-18
    }
    else if(encounterDifficulty > tier[3] && encounterDifficulty <= tier[4]) {
      return Math.floor(Math.random() * 6) + 19; //19-24
    }
    else {
      return Math.floor(Math.random() * 6) + 25; //25-30
    }
  }

  const DisplaySpawns = () => {
    if(roomDisplay === -1) return;
    if(spawnList[roomDisplay] === null && regSpawnList[roomDisplay] === null) return

    if(spawnList[roomDisplay] !== null) {
      if(spawnList[roomDisplay][0].entityNum !== undefined) { //Entity
        return (
          <>
            <Stack direction='row' flexWrap='wrap' gap={1}>
              {spawnList[roomDisplay].map((thing, index) => {
                return (
                  <BackroomsEntities 
                    key={index}
                    name={thing.name}
                    locations={thing.locations}
                    description={thing.description}
                    statBlock={thing.statBlock}
                    challengeRating={thing.challengeRating}
                    entityNum={thing.entityNum}
                    drop={thing.drop}
                    displayType="Level"
                  />
                )
              })}
            </Stack>
            {regSpawnList[roomDisplay] !== null ?
              <ol type='number'>
                {regSpawnList[roomDisplay].map((spawn, index) => {
                  return <li key={index}>{spawn}</li>
                })}
              </ol>
            :
              ""
            }
          </>
        )
      }

      if(spawnList[roomDisplay][0].itemNum !== undefined) { //Item
        return (
          <>
            <BackroomsItem
              name={spawnList[roomDisplay][0].name}
              itemNum={spawnList[roomDisplay][0].itemNum}
              locations={spawnList[roomDisplay][0].locations}
              description={spawnList[roomDisplay][0].description}
              table={spawnList[roomDisplay][0].table}
              display='level'
            />
            {regSpawnList[roomDisplay] !== null ?
              <ol type='number'>
                {regSpawnList[roomDisplay].map((spawn, index) => {
                  return <li key={index}>{spawn}</li>
                })}
              </ol>
            :
              ""
            }
          </>
        )
      }

      return (
        <>
          <Typography variant='h5'>{spawnList[roomDisplay][0]}</Typography>
          {regSpawnList[roomDisplay] !== null ?
            <ol type='number'>
              {regSpawnList[roomDisplay].map((spawn, index) => {
                return <li key={index}>{spawn}</li>
              })}
            </ol>
          :
            ""
          }
        </>
      )
    }
    else {
      return (
        <>
          {regSpawnList[roomDisplay] !== null ?
            <ol type='number'>
              {regSpawnList[roomDisplay].map((spawn, index) => {
                return <li key={index}>{spawn}</li>
              })}
            </ol>
          :
            ""
          }
        </>
      )
    }
  }

  const DisplayMaps = () => {
    return (
      <Stack>
        <Stack direction='row'>
          {currMap[0]}
          {currMap[1]}
          {currMap[2]}
        </Stack>
        <Stack direction='row'>
          {currMap[3]}
          {currMap[4]}
          {currMap[5]}
        </Stack>
        <Stack direction='row'>
          {currMap[6]}
          {currMap[7]}
          {currMap[8]}
        </Stack>
      </Stack>
    )
  }

  const DisplayContent = () => {
    return (
      <Box>
        <Button variant='outlined' onClick={() => {setShowMap(false);}}>Hide Content</Button>
        <Button onClick={() => {setMapRendered(false);}} variant='outlined'>Generate new map</Button>
          {!mapRendered || currMap.length === 0 ?
            createMap()
          :
            <>
              <DisplayMaps />

              <FormControl fullWidth>
                <InputLabel id="room">Room</InputLabel>
                <Select
                  labelId="room"
                  id="roomSelect"
                  value={roomDisplay}
                  label="Room #"
                  onChange={(e) => {setRoomDisplay(e.target.value)}}
                >
                  <MenuItem value={0}>Room 1</MenuItem>
                  <MenuItem value={1}>Room 2</MenuItem>
                  <MenuItem value={2}>Room 3</MenuItem>
                  <MenuItem value={3}>Room 4</MenuItem>
                  <MenuItem value={4}>Room 5</MenuItem>
                  <MenuItem value={5}>Room 6</MenuItem>
                  <MenuItem value={6}>Room 7</MenuItem>
                  <MenuItem value={7}>Room 8</MenuItem>
                  <MenuItem value={8}>Room 9</MenuItem>
                </Select>
              </FormControl>

              <DisplaySpawns />
            </>
          }
      </Box>
    )
  }

  const handleShowMap = () => {
    if(initalize) {
      setInitialize(false);
    }
    setShowMap(true);
  }

  const handleContextMenuClick = (insideText) => {
    mapGrids[menuData.target.grid][menuData.target.row][menuData.target.cell] = insideText;
    //Set the color of the map piece.

    const savedGrids = [];
    for(let i = 0; i < mapGrids.length; i++) {
      if(i === menuData.target.grid) {
        savedGrids.push(
          <Table sx={{border: '1px solid green'}}>
            <TableBody color='inherit'>
              {mapGrids[menuData.target.grid].map((row, index2) => {
                return (
                  <TableRow sx={{border: '1px solid green'}} key={index2}>
                    {row.map((cell, index3) => {
                      switch(cell) {
                        case 0:
                          return <TableCell style={{color: 'white', border: '1px solid black', backgroundColor: 'white'}} key={index3} onContextMenu={e => customMenu(e, menuData.target.grid, index2, index3)}>{cell}</TableCell>
                        case 1:
                          return <TableCell style={{color: 'black', border: '1px solid black', backgroundColor: 'black'}} key={index3}>{cell}</TableCell>
                        case 2:
                          return <TableCell style={{color: 'green', border: '1px solid black', backgroundColor: 'green'}} key={index3} onContextMenu={e => customMenu(e, menuData.target.grid, index2, index3)}>{cell}</TableCell>
                        case 3:
                          return <TableCell style={{color: 'red', border: '1px solid black', backgroundColor: 'red'}} key={index3} onContextMenu={e => customMenu(e, menuData.target.grid, index2, index3)}>{cell}</TableCell>
                        case 4:
                          return <TableCell style={{color: 'orange', border: '1px solid black', backgroundColor: 'orange'}} key={index3} onContextMenu={e => customMenu(e, menuData.target.grid, index2, index3)}>{cell}</TableCell>
                        default:
                          return <TableCell style={{color: 'white', border: '1px solid black', backgroundColor: 'blue'}} key={index3} onContextMenu={e => customMenu(e, menuData.target.grid, index2, index3)}>{cell - 4}</TableCell>
                      }
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )
      }
      else {
        savedGrids.push(currMap[i]);
      }
    }

    setCurrMap(savedGrids);

    setMenuData({
      toggled: false,
      location: {
        x: 0,
        y: 0
      },
      bgColor: 'white',
      textColor: 'white',
      target: {
        grid: 0,
        row: 0,
        cell: 0
      }
    });
  }

  const CustomMenu = () => {
    return (
      <Paper sx={{ width: 320, maxWidth: '100%', top: menuData.location.y, left: menuData.location.x, position: 'absolute' }}>
        <MenuList>
          <MenuItem>
            <ListItemText onClick={() => handleContextMenuClick(0)}>Open tile</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemText onClick={() => handleContextMenuClick(2)}>Item</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemText onClick={() => handleContextMenuClick(3)}>Entity</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemText onClick={() => handleContextMenuClick(4)}>Special</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemText onClick={() => handleContextMenuClick(5)}>Regular Spawn(value of 1)</ListItemText>
          </MenuItem>
        </MenuList>
      </Paper>
    );
  }

  return (
    <>
      <Typography variant='h2'>Level {props.level.levelNum}, {props.level.name}</Typography>
      <Typography variant='h5'>Description:</Typography>
      <Typography variant='body1' sx={{textIndent: 25}}>{props.level.description}</Typography>
      {!showMap ? 
        <Button variant='outlined' onClick={handleShowMap}>Show Content</Button>: 
        <>
          <DisplayContent />
          {menuData.toggled ? <CustomMenu /> : ""}
        </>
      }
    </>
  )
}