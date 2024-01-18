import { Box, Button, Card, CardActions, CardContent, Container, Divider, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import db from '../Components/firebase';

export default function Home() {
  const data = [];

  /* //Quests
  const addToDB = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'quests', data[i].name), {
        completed: data[i].completed === 'TRUE',
        description: data[i].description,
        name: data[i].name,
        outpost: data[i].outpost,
        questGiver: data[i].questGiver,
        reward: data[i].reward,
        unlocked: data[i].unlocked === 'TRUE',
        type: data[i].type
      })
    }
  }
  */
  
  /* //Items
  const addToDB = () => {
    for(let i = 0; i < data.length; i++) {
      const locations = data[i].locations.split(",");
      setDoc(doc(db, 'items', data[i].name), {
        artifactPrice: data[i].artifactPrice,
        description: data[i].description,
        itemNum: data[i].itemNum,
        locations: locations,
        name: data[i].name,
        rarity: data[i].rarity,
        table: data[i].table === 'Y' ? true : false
      })
    }
  }
  */

  /* //Levels
  const addToDB = () => {
    for(let i = 0; i < data.length; i++) {
      let gens = data[i].genType.split(",");
      let spawn = data[i].spawns.split(",");
      let special = data[i].specials.split(",");

      setDoc(doc(db, 'levels', data[i].name), {
        description: data[i].description,
        levelNum: data[i].levelNum.toString(),
        name: data[i].name,
        noEntities: data[i].noEntities,
        regSpawns: data[i].regSpawns,
        sanityDrainClass: data[i].sanityDrainClass,
        sanityDrainType: data[i].sanityDrainType,
        survivalDifficultyClass: data[i].survivalDifficultyClass.toString(),
        time: data[i].time,
        wifi: data[i].wifi,
        genType: gens,
        spawns: spawn,
        specials: special,
      })
    }
  }
  */
  
  /* //Outposts
  const addToDB = () => {
    for(let i = 0; i < data.length; i++) {
      let people = data[i].notablePeople.split(",");
      let shops;
      if(data[i].hasShops === 'FALSE') {
        shops = false;
      }
      else {
        shops = true;
      }

      setDoc(doc(db, 'outposts', data[i].name), {
        description: data[i].description,
        group: data[i].group,
        hasShops: shops,
        location: data[i].location,
        name: data[i].name,
        notablePeople: people,
      })
    }
  }
  */

  //Crafts
  const addToDB = () => {
    for(let i = 0; i < data.length; i++) {
      updateDoc(doc(db, 'crafts', 'Crafts'), {
        data
      })
    }
  }

  return (
    <Box paddingLeft={5} paddingRight={5}>
      {data.length === 0 ?
        <Button variant='outlined'>This currently does nothing</Button>
      :
        <button onClick={addToDB}>Add shit</button>
      }
      <Typography variant='h1'>Welcome!</Typography>
      <Typography variant='body1'>
        This is an application I have created to specifically run my Dungeons and Dragons Backrooms game. It is an open-world game so everything needs to be ready ahead of time.
        This application allows me to do that, utilizing firebase. There is no logins or requirements to use it. If you are a player, you can look in the general and player informations.
        If you are a DM, you can look at everything.
      </Typography>
    </Box>
  )
}