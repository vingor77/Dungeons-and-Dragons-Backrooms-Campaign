import { Box, Button, Card, CardActions, CardContent, Container, Divider, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore';
import db from '../Components/firebase';

export default function Home() {
  const data = [];

  //Add shit for Quests
  const addShit = () => {
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
  
  /* //Add shit for levels
  const addShit = () => {
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
  
  /* //Add shit for outposts
  const addShit = () => {
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

  /*
  const Items = [{"Item":"Anti-Smiler Armor","Pieces":"3 Smiler Repellent, 3 Firesalt","DC":10,"Stat":"Strength","Tier":1,"Tools":"Smith,Leatherworker","npc":"Yes","attempts":3},
  {"Item":"Iron Sheet (Good Condition)","Pieces":"3 Iron Sheets (Bad Condition)","DC":10,"Stat":"Strength","Tier":1,"Tools":"Smith,Alchemist","npc":"No","attempts":3}];

  const addShit = () => {
    for(let i = 0; i < Items.length; i++) {
      setDoc(doc(db, 'crafts', 'Crafts'), {
        Items
      })
    }
  }
  */

  return (
    <Box paddingLeft={5} paddingRight={5}>
      {data.length === 0 ?
        <Button variant='outlined'>This aint do shit</Button>
      :
        <button onClick={addShit}>Add shit</button>
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