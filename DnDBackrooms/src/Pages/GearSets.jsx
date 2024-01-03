import { Box, Button, Card, CardContent, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useState } from 'react';
import db from '../Components/firebase';

export default function GearSets() {
  const [gearSets, setGearSets] = useState(null);

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

  const Bonuses = (props) => {
    if(props.set.revealed === 0) return <Typography>Collect more items to reveal the bonuses.</Typography>
    const bonus = JSON.parse(props.set.bonus);
    const keys = Object.keys(bonus);
    const gearType = Object.keys(bonus[keys[1]]);

    return (
      <Box>
        {keys.map((key, index) => {
          return (
            index < props.set.revealed ?
              <Typography><b>({key})</b> {bonus[keys[index]][gearType[props.bonusSet]]}</Typography>
            :
              ""
          )
        })}
      </Box>
    )
  }
  
  return (
    <Box paddingLeft={5} paddingRight={5} paddingTop={2}>
      {gearSets === null ? 
        getSets()
      :
        <>
          {gearSets.map((set, index) => {
            return (
              <Card key={index} sx={{padding: 0, margin: 0, border: '1px solid black'}}>
                <CardContent>
                  <Box>
                    <Typography variant='h5'><b><u>{set.setName}</u></b></Typography>
                    {set.gear.map((gear, index) => {
                      return (
                        <>
                          <Stack direction='row' key={index} spacing={2}>
                            <Typography sx={{width: {md: '20%', lg: '10%'}, minWidth: {md: '20%', lg: '10%'}}}>{gear}</Typography>
                            <Bonuses set={set} bonusSet={index}/>
                          </Stack>
                          <Divider />
                        </>
                      )
                    })}
                  </Box>
                </CardContent>
              </Card>
            )
          })}
        </>
      }
    </Box>
  )
}

/*
{
  "2": {
    "Sword": "Becomes a +4",
    "Shield": "Becomes a +1",
    "Helmet": "Becomes a +2",
    "Gloves": "Becomes a +2",
    "Plate": "Becomes a +2",
    "Greaves": "Gives +10 movement speed"
  },
  "4": {
    "Sword": "Becomes a +5",
    "Shield": "Becomes a +2",
    "Helmet": "Becomes a +3",
    "Gloves": "Becomes a +3",
    "Plate": "Becomes a +3",
    "Greaves": "Gives +20 movement speed"
  },
  "6": {
    "Sword": "Gains 'Create an aura out to 30 ft that gives +2 to attack and damage rolls while within it'",
    "Shield": "'Gains As a bonus action, create an aura out to 30 ft that reduces sanity drain to 0 for 1 hour'",
    "Helmet": "'Gains Create an aura out to 30 ft that gives temporary proficiency to all skill checks using Intelligence, If already proficient, gain expertise, If already expertise, gain advantage'",
    "Gloves": "'Gains Create an aura out to 30 ft that gives +5 to all Wisdom saving throws'",
    "Plate": "'Gains Create an aura out to 30 ft that gives all within it the effect of adamantine armor, regardless of armor type'",
    "Greaves": "'Gains As an action, create an aura out to 30 ft that gives all within it legendary resistance to Dexterity saving throws for 1 hour'"
  }
}

{
  "1": {
    "Belt": "Nothing",
    "Thrower": "Nothing",
    "Plate": "Nothing"
  },
  "3": {
    "Belt": "Nothing part 2",
    "Thrower": "Nothing part 2",
    "Plate": "Nothing part 2"
  }
}
*/