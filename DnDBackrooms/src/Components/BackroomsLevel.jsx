import { AppBar, Box, Button, Chip, Dialog, Divider, ListItemText, MenuItem, MenuList, Modal, Paper, Stack, Table, TableBody, TableCell, TableRow, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import BackroomsItem from './BackroomsItem';
import BackroomsEntities from './BackroomsEntities';
import { collection, onSnapshot } from 'firebase/firestore';
import db from '../Components/firebase';
import Thalassophobia from './SpecialtyLevels/Thalassophobia';

export default function BackroomsLevel(props) {
  const [possibleRegSpawns, setPossibleRegSpawns] = useState([]);
  const [showMap, setShowMap] = useState(true);
  const [currMap, setCurrMap] = useState([]);
  const [mapRendered, setMapRendered] = useState(null);
  const [spawnList, setSpawnList] = useState([]);
  const [regSpawnList, setRegSpawnList] = useState([]);
  const [roomDisplay, setRoomDisplay] = useState(0);
  const [entityOpen, setEntityOpen] = useState([false, false, false, false, false]);
  const [openMap, setOpenMap] = useState(true);

  const getRegSpawns = () => {
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
  }

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

    return finishMap(grid, size, center);
  }

  const createHallPaths = (grid, size, center) => {
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

    return finishMap(grid, size, center);
  }

  const finishMap = (grid, size, center) => {
    //Create map side walls 
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        if((i < (center - 2) || i > (center + 2)) && (j === 0 || j === (size - 1))) {
          grid[i][j] = 1;
        }
        if((j < (center - 2) || j > (center + 2)) && (i === 0 || i === (size - 1))) {
          grid[i][j] = 1;
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

          && entity.entityNum > 0 && entity.entityNum < 67 && entity.entityNum !== 1 && entity.entityNum !== 18 && entity.entityNum !== 26 //entity num checks are in place since not all stat blocks are finished. Remove this line later.

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
    if(possibleRegSpawns.length === 0) getRegSpawns();
    else {
      const size = 17; //Arbitrary number I like.
      const center = 8;
      const mapPieces = [];
      const spawnedThings = [];
      const regSpawnedThings = [];
      for(let i = 0; i < 4; i++) {
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
  
      mapPieces.map((mapPiece, index1) => {
        tables.push (
          <Table sx={{border: '2px solid black'}} key={index1}>
            <TableBody>
              {mapPiece.map((row, index2) => {
                return (
                  <TableRow sx={{border: '1px solid black'}} key={index2}>
                    {row.map((cell, index3) => {
                      switch(cell) {
                        case 0:
                          return <TableCell style={{color: 'white', border: '3px solid black', backgroundColor: 'white'}} key={index3}>{cell}</TableCell>
                        case 1:
                          return <TableCell style={{color: 'black', border: '1px solid black', backgroundColor: 'black'}} key={index3}>{cell}</TableCell>
                        case 2:
                          return <TableCell style={{color: 'green', border: '1px solid black', backgroundColor: 'green'}} key={index3}>{cell}</TableCell>
                        case 3:
                          return <TableCell style={{color: 'red', border: '1px solid black', backgroundColor: 'red'}} key={index3}>{cell}</TableCell>
                        case 4:
                          return <TableCell style={{color: 'orange', border: '1px solid black', backgroundColor: 'orange'}} key={index3}>{cell}</TableCell>
                        default:
                          return <TableCell style={{color: 'white', border: '1px solid black', backgroundColor: 'blue'}} key={index3}>{cell - 4}</TableCell>
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

  const handleEntityModalOpen = (index) => {
    const temp = [];
    for(let i = 0; i < entityOpen.length; i++) {
      temp.push(entityOpen[i]);
    }
    temp[index] = true;
    setEntityOpen(temp);
  }

  const handleEntityModalClose = (index) => {
    const temp = [];
    for(let i = 0; i < entityOpen.length; i++) {
      temp.push(entityOpen[i]);
    }
    temp[index] = false;
    setEntityOpen(temp);
  }


  const DisplaySpawns = () => {
    if(roomDisplay === -1) return;
    if(spawnList[roomDisplay] === null && regSpawnList[roomDisplay] === null) {
      return (
        <Typography variant='h3'>No spawns have occured within the room.</Typography>
      )
    }

    if(spawnList[roomDisplay] !== null) {
      if(spawnList[roomDisplay][0].entityNum !== undefined) { //Entity
        const style = {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#fdf1dc',
          border: '2px solid #000',
          maxHeight: '80%',
          maxWidth: 601,
          overflow: 'auto'
        };
        return (
          <>
            <Box borderRight='1px solid black' width={{xs: '100%', md: '50%'}}>
              <Typography variant='h4' textAlign='center'>Entities</Typography>
              {spawnList[roomDisplay].map((thing, index) => {
                return (
                 <>
                  <Button onClick={() => handleEntityModalOpen(index)} variant='outlined' sx={{marginRight: '2px'}}>{thing.name}</Button>
                  <Modal
                    open={entityOpen[index]}
                    onClose={() => handleEntityModalClose(index)}
                    aria-labelledby="entityStatblock"
                    aria-describedby="Stat-block"
                  >
                    <Box sx={style}>
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
                    </Box>
                  </Modal>
                 </>
                )
              })}
            </Box>
            <Box width={{xs: '100%', md: '25%'}}>
              {regSpawnList[roomDisplay] !== null ?
                <Stack>
                  <Typography variant='h4' textAlign='center'>Reg spawns</Typography>
                  <ol type='number'>
                    {regSpawnList[roomDisplay].map((spawn, index) => {
                      return <li key={index}>{spawn}</li>
                    })}
                  </ol>
                </Stack>
              :
                ""
              }
            </Box>
          </>
        )
      }

      if(spawnList[roomDisplay][0].itemNum !== undefined) { //Item
        return (
          <>
            <Box borderRight='1px solid black' width={{xs: '100%', md: '50%'}}>
              <Typography variant='h4' textAlign='center'>Item</Typography>
              <Box>
                <BackroomsItem
                  name={spawnList[roomDisplay][0].name}
                  itemNum={spawnList[roomDisplay][0].itemNum}
                  locations={spawnList[roomDisplay][0].locations}
                  description={spawnList[roomDisplay][0].description}
                  table={spawnList[roomDisplay][0].table}
                  rarity={spawnList[roomDisplay][0].rarity}
                  artifactPrice={spawnList[roomDisplay][0].artifactPrice}
                  display='level'
                  style={{margin: 'auto'}}
                />
              </Box>
            </Box>
            <Box width={{xs: '100%', md: '25%'}}>
              {regSpawnList[roomDisplay] !== null ?
                <Stack>
                  <Typography variant='h4' textAlign='center'>Reg spawns</Typography>
                  <ol type='number'>
                    {regSpawnList[roomDisplay].map((spawn, index) => {
                      return <li key={index}>{spawn}</li>
                    })}
                  </ol>
                </Stack>
              :
                ""
              }
            </Box>
          </>
        )
      }

      return (
        <>
          <Box width={{xs: '100%', md: '50%'}} borderRight={{xs: 'none', md: '1px solid black'}}>
            <Typography variant='h4' textAlign='center'>Special</Typography>
            <Typography variant='h5'>{spawnList[roomDisplay][0]}</Typography>
          </Box>
          <Box width={{xs: '100%', md: '25%'}}>
            {regSpawnList[roomDisplay] !== null ?
              <Stack>
                <Typography variant='h4' textAlign='center'>Reg spawns</Typography>
                <ol type='number'>
                  {regSpawnList[roomDisplay].map((spawn, index) => {
                    return <li key={index}>{spawn}</li>
                  })}
                </ol>
              </Stack>
            :
              ""
            }
          </Box>
        </>
      )
    }
    else {
      return (
        <Box width='75%'>
          {regSpawnList[roomDisplay] !== null ?
            <Stack>
              <Typography variant='h4' textAlign='center'>Reg spawns</Typography>
              <ol type='number'>
                {regSpawnList[roomDisplay].map((spawn, index) => {
                  return <li key={index}>{spawn}</li>
                })}
              </ol>
            </Stack>
          :
            ""
          }
        </Box>
      )
    }
  }

  const NoGenLevel = () => {
    switch(props.level.name) {
      case "Thalassophobia":
        return <Thalassophobia content={JSON.parse(props.level.extraContent)} playerLoc={props.level['Player Location']}/>
      default:
        return <Typography>Not implemented yet</Typography>
    }
  }

  const DisplayContent = () => {
    return (
      <Box>
        {props.level.genType === 'None' ? 
          <>
            <NoGenLevel />
          </>
        :
          <>
            {!mapRendered || currMap.length === 0 ?
              createMap()
            :
              <>
                <Button onClick={() => setOpenMap(true)}>Open Map</Button>
                <Dialog
                  fullScreen
                  open={openMap}
                  onClose={() => setOpenMap(false)}
                >
                  <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                      <Button onClick={() => {setMapRendered(false);}} color='inherit' variant='outlined'>Generate new map</Button>
                      <Box sx={{width: '100%', typography: 'body1', ml: 2, flex: 1 }}>
                        <Stack direction='row'>
                          <Button color='inherit' onClick={() => {setRoomDisplay(0)}}>Room 1</Button>
                          <Button color='inherit' onClick={() => {setRoomDisplay(1)}}>Room 2</Button>
                          <Button color='inherit' onClick={() => {setRoomDisplay(2)}}>Room 3</Button>
                          <Button color='inherit' onClick={() => {setRoomDisplay(3)}}>Room 4</Button>
                        </Stack>
                      </Box>
                      <Button autoFocus color="inherit" onClick={() => setOpenMap(false)}>
                        Close
                      </Button>
                    </Toolbar>
                  </AppBar>

                  <Box padding={1} paddingBottom={0}>
                    <Typography variant='h3' textAlign='center'>Level {props.level.levelNum}, {props.level.name}</Typography>
                    <Typography textAlign='center'>{props.level.description}</Typography>
                    <br />
                    <Stack direction={{xs: 'column', md: 'row'}} justifyContent="space-between" alignItems="flex-start">
                      <Chip label={'Wi-Fi Strength: ' + props.level.wifi} />
                      <Chip label={'Sanity Drain Class: ' + props.level.sanityDrainClass} />
                      <Chip label={'Survival Difficulty Class: ' + props.level.survivalDifficultyClass} />
                    </Stack>
                  </Box>
                  <br />

                  <Divider />
                  <br />
                  <Stack direction={{xs: 'column', md: 'row'}} sx={{height: '400px'}}>
                    <DisplaySpawns />
                  </Stack>
                  <Box>
                    <Stack overflow='auto'>
                      <Stack direction='row'>
                        {currMap[0]}
                        {currMap[1]}
                      </Stack>
                      <Stack direction='row'>
                        {currMap[2]}
                        {currMap[3]}
                      </Stack>
                    </Stack>
                  </Box>
                </Dialog>
              </>
            }
          </>
        }
      </Box>
    )
  }

  const handleShowMap = () => {
    setShowMap(true);
  }

  return (
    <>
      <Box width='85%'>
        {!showMap ? 
          <Button variant='outlined' onClick={handleShowMap}>Show Content</Button>: 
          <>
            <DisplayContent />
          </>
        }
      </Box>
    </>
  )
}

const customContent = {
  'Player Location': [0, 0, 0, 0],
  Daylight: {
    Name: 'The Daylight Zone',
    Description: 'The area between the surface and 5000 feet below the surface. This area is considered bright light.',
    'Sanity Drain Class': 1,
    Time: '10 minutes per 1000 feet traveled',
    Events: {
      'Exit 9': 'At 500 feet North and 500 feet deep, a large gray rock with brown and black pipes puncturing it sits floating in the water. A small hole, about the size of a person, intersects the rock. This is an exit to Level 9.',
      'Exit 880': 'At 20000 feet West and 0 feet deep, an exit to Level 880 exists. There is no visual markings, but upon crossing the threshold the player is teleported.',
      'Tiny': 'Anywhere within the Daylight Zone, Tiny may appear and attack the players. Once every 1000 feet traversed, Tiny has a 5% chance to appear.'
    }
  },
  Twilight: {
    Name: 'The Twilight Zone',
    Description: 'The area between 5000 and 20000 feet below the surface. This area is considered dim light.',
    'Sanity Drain Class': 2,
    Time: '10 minutes per 1500 feet traveled',
    Events: {
      'Exit 8': 'At 20000 feet deep, a mountainous eruption of gray rocks comes into view. On the rocks are flashing green and red lights, leading through a large cave mouth. This leads to Level 8.',
      'Tiny': 'Anywhere within the Twilight Zone, Tiny may appear and attack the players. Once every 1000 feet traversed, Tiny has a 5% chance to appear.'
    }
  },
  Midnight: {
    Name: 'The Midnight Zone',
    Description: 'The area between 20000 and 300000 feet below the surface. This area is considered dark.',
    'Sanity Drain Class': 3,
    Time: '10 minutes per 1000 feet traveled',
    Events: {
      'Thing': 'Anywhere within the Midnight Zone, The Thing may appear and attack the players. Once every 1000 feet traversed, The Thing has a 5% chance to appear.'
    }
  },
  Abyss: {
    Name: 'The Abyss',
    Description: 'The area 30000 feet and deeper. This area is too dark for flashlights to work.',
    'Sanity Drain Class': 5,
    Time: '10 minutes per 500 feet traveled',
    Events: {
      'Exit 83': 'Upon reaching The Abyss, there is a chance of falling unconcious. This leads the player to Level 83.',
      'Leviathan Tooth': 'At North 1000, East 10000, and depth 35000, there lies a cave of orangish-red rocks that contains a Leviathans Tooth',
      'Thing': 'Anywhere within the Abyss, The Thing may appear and attack the players. Once every 1000 feet traversed, The Thing has a 5% chance to appear.'
    }
  }
}

//console.log(JSON.stringify(customContent));