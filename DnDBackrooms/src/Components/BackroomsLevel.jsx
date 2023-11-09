import { Box, Button, Input, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import BackroomsItem from './BackroomsItem';
import BackroomsEntities from './BackroomsEntities';
import { collection, onSnapshot } from 'firebase/firestore';
import db from '../Components/firebase';
import CasinoShop from '../Images/CasinoRoomShop.png';

export default function BackroomsLevel(props) {
  const [spawn, setSpawn] = useState(-1);
  const [spawnType, setSpawnType] = useState("");
  const [regSpawns, setRegSpawns] = useState([]);
  const [possibleRegSpawns, setPossibleRegSpawns] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [initalize, setInitialize] = useState(true);
  const [currMap, setCurrMap] = useState(null);
  const [mapRendered, setMapRendered] = useState(null);

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

    if(spawn <= props.level.spawns[0]) {
      setSpawnType("Nothing");
      nextType = "Nothing"
    }
    else if(spawn > props.level.spawns[0] && spawn <= props.level.spawns[1]) {
      setSpawnType("Item");
      nextType = "Item"
    }
    else if(spawn > props.level.spawns[1] && spawn <= props.level.spawns[2]) {
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

    //Regular spawn locations on the map.
    let regSpawnCount = Math.floor(Math.random() * (Number(props.level.regSpawns) + 1));

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
  }, [spawn])

  const createMap = () => {
    if(props.level.genType[0] === 'None') return;

    const type = props.level.genType[Math.floor(Math.random() * props.level.genType.length)];
    setMapRendered(true);

    switch(type) {
      case 'Room':
        createRoomMap();
        break;
      case 'Hall':
        createHallMap();
        break;
    }
  };

  const createHallMap = () => {
    let size = Math.floor(Math.random() * 10) + 15; //Size of 15 to 24
    if(size % 2 == 0) {
      size++;
    }
    const center = Math.ceil(size / 2) - 1;

    const grid = [];
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

        //Add in regular spawns and items/entities.
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
      
            let regSpawnNum = 5;
            for(let i = 0; i < regSpawns.length; i++) {
              while(grid[xSpawn][ySpawn] !== 0 && grid[xSpawn][ySpawn] !== -1) {
                xSpawn = Math.floor(Math.random() * size);
                ySpawn = Math.floor(Math.random() * size);
              }
              grid[xSpawn][ySpawn] = regSpawnNum;
              regSpawnNum++;
            }
          }
        
          spawnLocation();
        }
    
        //Change the placeholder end values
        for(let i = 0; i < grid.length; i++) {
          for(let j = 0; j < grid[i].length; j++) {
            if(grid[i][j] === -1) {
              grid[i][j] = 0;
            }
          }
        }

    setCurrMap(
      <>
        <Table sx={{border: '1px solid black'}}>
          <TableBody color='inherit'>
            {grid.map((row, index) => {
              return (
                <TableRow sx={{border: '1px solid black'}} key={index}>
                  {row.map((cell, index) => {
                    switch(cell) {
                      case 0:
                        return <TableCell style={{color: 'white', border: '1px solid black', backgroundColor: 'white'}} key={index} onClick={toggleWalked}>{cell}</TableCell>
                      case 1:
                        return <TableCell style={{color: 'black', border: '1px solid black', backgroundColor: 'black'}} key={index}>{cell}</TableCell>
                      case 2:
                        return <TableCell style={{color: 'green', border: '1px solid black', backgroundColor: 'green'}} key={index}>{cell}</TableCell>
                      case 3:
                        return <TableCell style={{color: 'red', border: '1px solid black', backgroundColor: 'red'}} key={index}>{cell}</TableCell>
                      case 4:
                        return <TableCell style={{color: 'orange', border: '1px solid black', backgroundColor: 'orange'}} key={index}>{cell}</TableCell>
                      default:
                        return <TableCell style={{color: 'white', border: '1px solid black', backgroundColor: 'blue'}} key={index}>{cell - 4}</TableCell>
                    }
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {spawnType === "Item" || spawnType === 'Item1' ? <CheckSpawnItem altDisplay='false' /> : ""}
        {spawnType === "Entity" || spawnType === "Entity1" ? <CheckSpawnEntity altDisplay='false' /> : ""}
        {spawnType === "Special" || spawnType === "Special1" ? <CheckSpawnSpecial altDisplay='false'/> : ""}
        {spawnType === 'Nothing' || spawnType === 'Nothing1' ? <CheckSpawnNothing altDisplay='false' /> : ""}
      </>
    )
  }

  const toggleWalked = (e) => {
    //White to Teal to Pink to White
    if(e.target.style.backgroundColor === 'white') {
      e.target.style.backgroundColor = 'teal';
      e.target.style.color = 'teal';
    }
    else if(e.target.style.backgroundColor === 'teal') {
      e.target.style.backgroundColor = 'pink';
      e.target.style.color = 'pink';
    }
    else {
      e.target.style.backgroundColor = 'white';
      e.target.style.color = 'white';
    }
  }

  const createRoomMap = () => {
    let size = Math.floor(Math.random() * 10) + 15; //Size of 15 to 24
    if(size % 2 == 0) {
      size++;
    }
    const center = Math.ceil(size / 2) - 1;

    //Create a grid and set any end pieces to -1 since that won't be used later on ever.
    const grid = [];
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

    //Path algorithm
    const paths = []; //2D array where 0 is path 1, 1 is path 2, etc.
    
    //Left
    let randI = Math.floor(Math.random() * size);
    while(grid[randI][0] !== -1) {
      randI = Math.floor(Math.random() * size);
    }
    paths[0] = [{i: randI, j: 0}];

    //Right
    randI = Math.floor(Math.random() * size);
    while(grid[randI][size - 1] !== -1) {
      randI = Math.floor(Math.random() * size);
    }
    paths[1] = [{i: randI, j: (size - 1)}];

    //Top
    let randJ = Math.floor(Math.random() * size);
    while(grid[0][randJ] !== -1) {
      randJ = Math.floor(Math.random() * size);
    }
    paths[2] = [{i: 0, j: randJ}];

    //Bottom
    randJ = Math.floor(Math.random() * size);
    while(grid[size - 1][randJ] !== -1) {
      randJ = Math.floor(Math.random() * size);
    }
    paths[3] = [{i: (size - 1), j: randJ}];

    //Go in a random direction with checks for edges of the map and end points. Cannot go backwards nor can it go off the map. If it hits an end point, end the algorithm.
    for(let i = 0; i < paths.length; i++) {
      let end = false;
      while(!end) {
        const currentTile = paths[i][paths[i].length - 1];

        if(i === 0) {
          if(((currentTile.i === (center - 2) || currentTile.i === (center - 1) || currentTile.i === (center) || currentTile.i === (center + 1) || currentTile.i === (center + 2)) && (currentTile.j === (size - 1))) && paths[i].length > 1) {
            end = true;
          }
          else if(((currentTile.j === (center - 2) || currentTile.j === (center - 1) || currentTile.j === (center) || currentTile.j === (center + 1) || currentTile.j === (center + 2)) && (currentTile.i === 0 || currentTile.i === (size - 1))) && paths[i].length > 1) {
            end = true;
          }
        }
        else if(i === 1) {
          if(((currentTile.i === (center - 2) || currentTile.i === (center - 1) || currentTile.i === (center) || currentTile.i === (center + 1) || currentTile.i === (center + 2)) && (currentTile.j === 0)) && paths[i].length > 1) {
            end = true;
          }
          else if(((currentTile.j === (center - 2) || currentTile.j === (center - 1) || currentTile.j === (center) || currentTile.j === (center + 1) || currentTile.j === (center + 2)) && (currentTile.i === 0) || currentTile.i === (size - 1)) && paths[i].length > 1) {
            end = true;
          }
        }
        //Top
        else if(i === 2) {
          if(((currentTile.i === (center - 2) || currentTile.i === (center - 1) || currentTile.i === (center) || currentTile.i === (center + 1) || currentTile.i === (center + 2)) && (currentTile.j === 0 || currentTile.j === (size - 1))) && paths[i].length > 1) {
            end = true;
          }
          else if(((currentTile.j === (center - 2) || currentTile.j === (center - 1) || currentTile.j === (center) || currentTile.j === (center + 1) || currentTile.j === (center + 2)) && (currentTile.i === (size - 1))) && paths[i].length > 1) {
            end = true;
          }
        }
        //Bottom
        else {
          if(((currentTile.i === (center - 2) || currentTile.i === (center - 1) || currentTile.i === (center) || currentTile.i === (center + 1) || currentTile.i === (center + 2)) && (currentTile.j === (size - 1) || currentTile.j === 0)) && paths[i].length > 1) {
            end = true;
          }
          else if(((currentTile.j === (center - 2) || currentTile.j === (center - 1) || currentTile.j === (center) || currentTile.j === (center + 1) || currentTile.j === (center + 2)) && (currentTile.i === 0)) && paths[i].length > 1) {
            end = true;
          }
        }

        if(!end) {
          let direction = Math.floor(Math.random() * 4);
          let success = false;
          let alreadyChosen = false;
          while(!success) {
            switch(direction) {
              case 0:
                //Left
                if(currentTile.j - 1 < 0 || alreadyChosen) {
                  alreadyChosen = false;
                  direction = Math.floor(Math.random() * 4);
                  break;
                }

                paths[i].push({i: paths[i][paths[i].length - 1].i, j: (paths[i][paths[i].length - 1].j - 1)});
                success = true;
                break;
              case 1:
                //Right
                if(currentTile.j + 1 > (size - 1) || alreadyChosen) {
                  alreadyChosen = false;
                  direction = Math.floor(Math.random() * 4);
                  break;
                }

                paths[i].push({i: paths[i][paths[i].length - 1].i, j: (paths[i][paths[i].length - 1].j + 1)});
                success = true;
                break;
              case 2:
                //Top
                if(currentTile.i - 1 < 0 || alreadyChosen) {
                  alreadyChosen = false;
                  direction = Math.floor(Math.random() * 4);
                  break;
                }

                paths[i].push({i: (paths[i][paths[i].length - 1].i - 1), j: paths[i][paths[i].length - 1].j});
                success = true;
                break;
              case 3:
                //Bottom
                if(currentTile.i + 1 > (size - 1) || alreadyChosen) {
                  alreadyChosen = false;
                  direction = Math.floor(Math.random() * 4);
                  break;
                }

                paths[i].push({i: (paths[i][paths[i].length - 1].i + 1), j: paths[i][paths[i].length - 1].j});
                success = true;
                break;
              default:
                break;
            } 
          }
        }
      }
    }

    for(let i = 0; i < paths.length; i++) {
      for(let j = 0; j < paths[i].length; j++) {
        const pathI = paths[i][j].i;
        const pathJ = paths[i][j].j;
        if(grid[pathI][pathJ] !== -1 && grid[pathI][pathJ] !== 2 && grid[pathI][pathJ] !== 3 && grid[pathI][pathJ] !== 4) {
          grid[pathI][pathJ] = 0;
        }
      }
    }

    //Setup room borders
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        if((i === 0 || i === (size - 1)) && (grid[i][j] !== -1)) {
          grid[i][j] = 1;
        }
        if((j === 0 || j === (size - 1)) && (grid[i][j] !== -1)) {
          grid[i][j] = 1;
        }
      }
    }

    //Add in regular spawns and items/entities.
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
  
        let regSpawnNum = 5;
        for(let i = 0; i < regSpawns.length; i++) {
          while(grid[xSpawn][ySpawn] !== 0 && grid[xSpawn][ySpawn] !== -1) {
            xSpawn = Math.floor(Math.random() * size);
            ySpawn = Math.floor(Math.random() * size);
          }
          grid[xSpawn][ySpawn] = regSpawnNum;
          regSpawnNum++;
        }
      }
    
      spawnLocation();
    }

    //Change the placeholder end values
    for(let i = 0; i < grid.length; i++) {
      for(let j = 0; j < grid[i].length; j++) {
        if(grid[i][j] === -1) {
          grid[i][j] = 0;
        }
      }
    }

    setCurrMap(
      <>
        <Table sx={{border: '1px solid black'}}>
          <TableBody color='inherit'>
            {grid.map((row, index) => {
              return (
                <TableRow sx={{border: '1px solid black'}} key={index}>
                  {row.map((cell, index) => {
                    switch(cell) {
                      case 0:
                        return <TableCell style={{color: 'white', border: '1px solid black', backgroundColor: 'white'}} key={index} onClick={toggleWalked}>{cell}</TableCell>
                      case 1:
                        return <TableCell style={{color: 'black', border: '1px solid black', backgroundColor: 'black'}} key={index}>{cell}</TableCell>
                      case 2:
                        return <TableCell style={{color: 'green', border: '1px solid black', backgroundColor: 'green'}} key={index}>{cell}</TableCell>
                      case 3:
                        return <TableCell style={{color: 'red', border: '1px solid black', backgroundColor: 'red'}} key={index}>{cell}</TableCell>
                      case 4:
                        return <TableCell style={{color: 'orange', border: '1px solid black', backgroundColor: 'orange'}} key={index}>{cell}</TableCell>
                      default:
                        return <TableCell style={{color: 'white', border: '1px solid black', backgroundColor: 'blue'}} key={index}>{cell - 4}</TableCell>
                    }
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {spawnType === "Item" || spawnType === 'Item1' ? <CheckSpawnItem altDisplay='false' /> : ""}
        {spawnType === "Entity" || spawnType === "Entity1" ? <CheckSpawnEntity altDisplay='false' /> : ""}
        {spawnType === "Special" || spawnType === "Special1" ? <CheckSpawnSpecial altDisplay='false'/> : ""}
        {spawnType === 'Nothing' || spawnType === 'Nothing1' ? <CheckSpawnNothing altDisplay='false' /> : ""}
      </>
    )
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

    return filteredItems[Math.floor(Math.random() * filteredItems.length)];
  }

  const CheckSpawnItem = (properties) => {
    const selectedItem = getItemRarity();

    return (
      <>
        <BackroomsItem 
          name={selectedItem.name}
          itemNum={selectedItem.itemNum}
          locations={selectedItem.locations}
          description={selectedItem.description}
          table={selectedItem.table}
        />
        <br />
        {regSpawns.length !== 0 && properties.altDisplay === 'false' ?
          <>
            <br />
            <Typography variant='h5'>Regular spawns(blue):</Typography>
            <Box border='1px solid black'>
              <br />
              <ol type='1'>
                {regSpawns.map((spawn, index) => {
                  return <li key={index}>{spawn} </li>
                })}
              </ol>
            </Box>
          </>
        :
          ""
        }
      </>
    )
  }

  const getMaxCR = (tier, encounterDifficulty) => {
    switch(tier) {
      case 1:
        if(encounterDifficulty > 0 && encounterDifficulty <= 50) {
          return Math.floor(Math.random() * 5) + 1;
        }
        else if(encounterDifficulty > 50 && encounterDifficulty <= 62) {
          return Math.floor(Math.random() * 5) + 6;
        }
        else if(encounterDifficulty > 62 && encounterDifficulty <= 74) {
          return Math.floor(Math.random() * 5) + 11;
        }
        else if(encounterDifficulty > 74 && encounterDifficulty <= 86) {
          return Math.floor(Math.random() * 5) + 16;
        }
        else {
          return Math.floor(Math.random() * 14) + 17;
        }
      case 2:
        if(encounterDifficulty > 0 && encounterDifficulty <= 50) {
          return Math.floor(Math.random() * 5) + 6;
        }
        else if(encounterDifficulty > 50 && encounterDifficulty <= 62) {
          return Math.floor(Math.random() * 5) + 1;
        }
        else if(encounterDifficulty > 62 && encounterDifficulty <= 74) {
          return Math.floor(Math.random() * 5) + 11;
        }
        else if(encounterDifficulty > 74 && encounterDifficulty <= 86) {
          return Math.floor(Math.random() * 5) + 16;
        }
        else {
          return Math.floor(Math.random() * 14) + 17;
        }
      case 3:
        if(encounterDifficulty > 0 && encounterDifficulty <= 50) {
          return Math.floor(Math.random() * 5) + 11;
        }
        else if(encounterDifficulty > 50 && encounterDifficulty <= 62) {
          return Math.floor(Math.random() * 5) + 6;
        }
        else if(encounterDifficulty > 62 && encounterDifficulty <= 74) {
          return Math.floor(Math.random() * 5) + 1;
        }
        else if(encounterDifficulty > 74 && encounterDifficulty <= 86) {
          return Math.floor(Math.random() * 5) + 16;
        }
        else {
          return Math.floor(Math.random() * 14) + 17;
        }
      case 4:
        if(encounterDifficulty > 0 && encounterDifficulty <= 50) {
          return Math.floor(Math.random() * 5) + 16;
        }
        else if(encounterDifficulty > 50 && encounterDifficulty <= 62) {
          return Math.floor(Math.random() * 5) + 6;
        }
        else if(encounterDifficulty > 62 && encounterDifficulty <= 74) {
          return Math.floor(Math.random() * 5) + 11;
        }
        else if(encounterDifficulty > 74 && encounterDifficulty <= 86) {
          return Math.floor(Math.random() * 5) + 1;
        }
        else {
          return Math.floor(Math.random() * 14) + 17;
        }
      case 5:
        if(encounterDifficulty > 0 && encounterDifficulty <= 50) {
          return Math.floor(Math.random() * 5) + 17;
        }
        else if(encounterDifficulty > 50 && encounterDifficulty <= 62) {
          return Math.floor(Math.random() * 5) + 6;
        }
        else if(encounterDifficulty > 62 && encounterDifficulty <= 74) {
          return Math.floor(Math.random() * 5) + 11;
        }
        else if(encounterDifficulty > 74 && encounterDifficulty <= 86) {
          return Math.floor(Math.random() * 5) + 16;
        }
        else {
          return Math.floor(Math.random() * 14) + 1;
        }
      default:
        break;
    }
  }

  const CheckSpawnEntity = (properties) => {
    //Determine maximum cr based on player tier for the encounter then choose randomly until it is equal to the total. Stretch: Add a limit of entities in the encounter.
    //TODO: Find a way to display the statblocks nicer.
    const tier = 1;
    const maxPlayers = 5;
    const encounterDifficulty = Math.floor(Math.random() * 100) + 1;
    let maxCR = getMaxCR(tier, encounterDifficulty);

    const chosenEntities = [];
    let cutOff = 1000;
    let currCR = maxCR;

    if(maxCR > 0) {
      while(chosenEntities.length < maxPlayers && cutOff > 0) {
        const entity = props.entities[Math.floor(Math.random() * props.entities.length)];
  
        if(entity.challengeRating <= currCR && entity.challengeRating > 0

          && entity.entityNum > 0 && entity.entityNum < 32 && entity.entityNum !== 18 && entity.entityNum !== 26 //entity num checks are in place since not all stat blocks are finished. Remove this line later.

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

    return (
      <>
        {chosenEntities.map((entity, index) => {
          return (
            <BackroomsEntities 
              key={index}
              name={entity.name}
              locations={entity.locations}
              description={entity.description}
              statBlock={entity.statBlock}
              challengeRating={entity.challengeRating}
              entityNum={entity.entityNum}
              displayType="Level"
            />
          )
        })}
        {regSpawns.length !== 0 && properties.altDisplay === 'false' ?
          <>
            <br />
            <Typography variant='h5'>Regular spawns(blue):</Typography>
            <Box border='1px solid black'>
              <br />
              <ol type='1'>
                {regSpawns.map((spawn, index) => {
                  return <li key={index}>{spawn} </li>
                })}
              </ol>
            </Box>
          </>
        :
          ""
        }
      </>
    )
  }

  const CheckSpawnSpecial = (properties) => {
    return (
      <>
        {properties.altDisplay === 'false' ? 
          <>
            <Typography variant='h5'>Possible specials:</Typography>
            <Box border='1px solid black'>
              <ol type='1'>
                {props.level.specials.map((special, index) => {
                  return <li key={index}>{special}</li>
                })}
              </ol>
            </Box>
            {regSpawns.length !== 0 ?
              <>
                <br />
                <Typography variant='h5'>Regular spawns(blue):</Typography>
                <Box border='1px solid black'>
                  <br />
                  <ol type='1'>
                    {regSpawns.map((spawn, index) => {
                      return <li key={index}>{spawn}</li>
                    })}
                  </ol>
                </Box>
              </>
            :
              ""
            }
          </>
        :
          <>
            <Typography variant='h5'>Main Options</Typography>
            <Box border='1px solid black'>
              <Stack spacing={1} padding={2}>
                {props.level.specials.map((special, index) => {
                  return <Typography variant='body1' key={index}>{special}</Typography>
                })}
              </Stack>
            </Box>
          </>
        }
      </>
    )
  }

  const CheckSpawnNothing = (properties) => {
    return (
      <>
        {properties.altDisplay === 'false' ?
        <>
          {regSpawns.length !== 0 ?
            <>
              <br />
              <Typography variant='h5'>Regular spawns(blue):</Typography>
              <Box border='1px solid black'>
                <br />
                <ol type='1'>
                  {regSpawns.map((spawn, index) => {
                    return <li key={index}>{spawn} </li>
                  })}
                </ol>
              </Box>
            </>
          :
            ""
          }
        </>
      :
        <>
          <Typography variant='h1'>Ain't shit here</Typography>
        </>
      }
      </>
    )
  }

  const DisplayContent = () => {
    if(props.level.genType[0] === 'None') {
      //Put all content here.
      //Check for each specialty
      //games, shop, playerLocation, map, items(for inside building. This doesn't need to be pulled or anything, we have it.)
      return (
        <>
          <Button variant='outlined' onClick={handleHideMap}>Hide Content</Button>
          <CheckSpawnSpecial altDisplay='true' />
          {props.level.games === undefined ? 
            ""
          :
            <>
              <br />
              <Box border='1px solid black' padding={2}>
                <Typography variant='h5'>Casino games</Typography>
                {props.level.games.map((game, index) => {
                  return (
                    <div key={index}>
                      <Typography variant='body1'>{index + 1}: {game}</Typography>
                      <br />
                    </div>
                  )
                })}
              </Box>
            </>
          }
          {props.level.shop !== undefined ? 
            <>
              <br />
              <Typography variant='h5'>Shop</Typography>
              <img src={CasinoShop} />
            </> 
          : 
            ""
          }
          {props.level.playerLocation !== undefined ?
            <Stack direction='row' spacing={2}>
              {/*The inputs don't do anything yet. For now manual updating is fine.*/}
              <Stack>
                <Typography variant='body1'>North: {props.level.playerLocation[0]}</Typography>
                <Input type='number' placeholder='Update North'></Input>
              </Stack>
              <Stack>
                <Typography variant='body1'>South: {props.level.playerLocation[1]}</Typography>
                <Input type='number' placeholder='Update South'></Input>
              </Stack>
              <Stack>
                <Typography variant='body1'>East: {props.level.playerLocation[2]}</Typography>
                <Input type='number' placeholder='Update East'></Input>
              </Stack>
              <Stack>
                <Typography variant='body1'>West: {props.level.playerLocation[3]}</Typography>
                <Input type='number' placeholder='Update West'></Input>
              </Stack>
            </Stack>
          :
            ""
          }
          {props.level.cityMap !== undefined ?
            "Display city map here."
          :
            ""
          }
          {props.level.name === 'The Endless City' ? <CheckSpawnItem altDisplay='true' /> : ""}
        </>
      )
    }

    return (
      <>
        <Button variant='outlined' onClick={handleHideMap}>Hide Content</Button>
        <Button onClick={() => {setSpawn(Math.round(Math.random() * 100) + 1); setMapRendered(false);}} variant='outlined'>Generate new map</Button>
        {spawnType !== null ?
        <>
          {!mapRendered ?
            createMap()
          :
            <>
              {currMap}
            </>
          }
        </>
        : 
          ""
        }
      </>
    )
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
        </>
      }
    </>
  )
}