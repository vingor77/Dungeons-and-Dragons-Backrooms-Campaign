import { Box, Container, Divider, Grid, Stack, Typography } from '@mui/material';
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

  const ShowSetBonuses = (props) => {
    if(props.set.revealed === 0) return <Typography variant='h5'>Bonuses not discovered.</Typography>

    let bonus = JSON.parse(props.set.bonus);
    let keys = Object.keys(bonus);

    const revealedBonuses = [];
    
    for(let i = 0; i < props.set.revealed; i++) {
      revealedBonuses.push([bonus[keys[i]], Object.keys(bonus[keys[i]])]);
    }

    return (
      <>
        <Stack direction='row' spacing={2}>
          {revealedBonuses.map((bonuses, index) => {
            return (
              <Box>
                {bonuses[1].map((b) => {
                  return (
                    <Typography variant='body1'><b>({keys[index]}) {b}:</b> {bonuses[0][b]}</Typography>
                  )
                })}
              </Box>
            )
          })}
        </Stack>
      </>
    )
  }

  
  return (
    <Box paddingLeft={5} paddingRight={5} paddingTop={2}>
      {gearSets === null ? 
        getSets()
        :
        <>
          {gearSets.map((set) => {
            return (
              <>
                <Box>
                  <Stack direction='row' spacing={2}>
                    <Typography variant='h5'><b>{set.setName}:</b></Typography>
                    <Stack>
                      {set.gear.map((gear, index) => {
                        return  (
                          <>
                            <Typography variant='body1'>{gear}</Typography>
                            <Divider />
                          </>
                        )
                      })}
                    </Stack>
                    <ShowSetBonuses set={set}/>
                  </Stack>
                </Box>
                <hr />
              </>
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