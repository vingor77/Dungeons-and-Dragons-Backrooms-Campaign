import { Box, Button, Card, CardContent, Container, Divider, Grid, Input, Stack, Toolbar, Typography } from '@mui/material';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useState } from 'react';
import db from '../Components/firebase';

export default function GearSets() {
  const [gearSets, setGearSets] = useState(null);
  const [currSet, setcurrSet] = useState('');
  const [item, setItem] = useState('');

  const getSets = () => {
    const collectionRef = collection(db, 'gearSets');
  
    const unsub = onSnapshot(collectionRef, (querySnapshot) => {
      let stuff = [];
      querySnapshot.forEach((doc) => {
        stuff.push(doc.data());
      })
      setGearSets(stuff);
    })

    return () => unsub();
  }

  const DisplayFilteredGear = (props) => {
    let displayed = false;

    if(props.set.setName.toUpperCase().includes(currSet.toUpperCase()) || currSet === '') {
      for(let i = 0; i < props.set.gear.length; i++) {
        if(displayed === false && (item === '' || props.set.gear[i].toUpperCase().includes(item.toUpperCase()))) {
          return <DisplayGearSets set={props.set}/>
        }
      }
    }
  }

  const DisplayGearSets = (props) => {
    const set = JSON.parse(props.set.bonus);
    const keys = Object.keys(set);
    
    return (
      <Card sx={{width: '100%', border: '1px solid black', marginTop: '12px'}}>
        <CardContent>
          <Typography variant='h5' textAlign='center'>{props.set.setName}</Typography>
          <Stack direction={{xs: 'column', md: 'row'}} gap={2}>
            {keys.map((key, index) => {
              return (
                <Card sx={{width: {xs: '100%', md: '450px'}, height: '240px', border: '1px solid black'}}>
                  <CardContent>
                    <Typography textAlign='center' sx={{textDecoration: 'underline'}}>{props.set.gear[index]}</Typography>
                    {props.set.revealed > 0 ?
                      <Box>
                        {Object.keys(set[key]).map((s, index) => {
                          return (
                            index < props.set.revealed ? <Typography key={index}><b>({s})</b>: {set[key][s]}</Typography> : ""
                          )
                        })}
                      </Box>
                    :
                      <Typography textAlign='center'>Not enough items discovered.</Typography>
                    }
                  </CardContent>
                </Card>
              )
            })}
          </Stack>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Box paddingLeft={5} paddingRight={5} paddingTop={2}>
      <Toolbar />
      {gearSets === null ? 
        getSets()
      :
        <>
          <Stack direction={{xs: 'column', md: 'row'}} gap={2}>
            <Input value={currSet} onChange={e => setcurrSet(e.target.value)} placeholder='Enter gear set name' labelId='set'></Input>
            <Input value={item} onChange={e => setItem(e.target.value)} placeholder='Enter item name' labelId='item'></Input>
          </Stack>
          {gearSets.map((set, index) => {
            return (
              <DisplayFilteredGear set={set} key={index}/>
            )
          })}
        </>
      }
    </Box>
  )
}

/*
const test = {
  0: {2: "You are no longer vulnerable to the other damage types."},
  1: {2: "Friendly missiles are no longer attracted to you."}
}
*/

//console.log(JSON.stringify(test));