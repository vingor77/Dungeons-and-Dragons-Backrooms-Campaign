import React, { useState } from 'react'
import { Box, Container, List, ListItem, ListItemButton, ListItemText, ListSubheader, Stack, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';

export default function GeneralInfo() {
  const [shownRules, setShownRules] = useState("");

  const DisplayInfo = () => {
    return (
      <>
        <Stack direction='row' borderBottom='1px solid black'>
          <Box borderRight='1px solid black' width='10%'>
            <List>
              <ListSubheader>Rule select</ListSubheader>
              <ListItemButton onClick={() => setShownRules("house")}>
                <ListItemText primary="House rules" />
              </ListItemButton>
              <ListItemButton onClick={() => setShownRules("flee")}>
                <ListItemText primary="Fleeing rules" />
              </ListItemButton>
              <ListItemButton onClick={() => setShownRules("level")}>
                <ListItemText primary="Level rules" />
              </ListItemButton>
            </List>
          </Box>
          <Box width='90%'>
            {shownRules === 'house' ?
              <Stack direction='row'>
                <Box borderRight='1px solid black' width='60%'>
                <Typography variant='h4' textAlign='center'>Rules</Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="Full perkins crit" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Ammunition, rations, and time passed in-game are kept track of. 1 Ration per day required" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="All effects or immunities that state 1 day or 24 hours also reset on a log rest" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Long rests may only be taken in certified safe spots, unless a shelter is built" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Due to anomalous darkness, darkvision is removed. It is instead replace by either a AA flashlight with 4 extra batteries, or a C lantern with 1 extra battery." />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="The available tool sets are: Alchemist, Calligrapher, Cook, Leatherworker, Smith, Carpenter, and Thieves tools" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="While in combat, no new rooms will be generated. Instead, when leaving the edge of the map, you instead loop to the other side" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="There is a 5% chance to loop to the other side of the map when trying to leave" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Almond water is worth 500 gold each for purposes of magic items" />
                    </ListItem>
                  </List>
                </Box>
                <Box width='40%'>
                  <Typography variant='h4' textAlign='center'>Gear slots</Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="Helmet" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Chest" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Arms (Including hands)" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Belt" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Legs (Including feet)" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="10 Rings (Each finger)" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Necklace" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Cloak" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Main Hand" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Off Hand" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Any number of Miscellaneous" />
                    </ListItem>
                  </List>
                </Box>
              </Stack>
            :
              shownRules === 'flee' ?
                <>
                  <Typography variant='h4' textAlign='center'>Fleeing</Typography>
                  <Stack direction='row' spacing={2}>
                    <Box borderRight='1px solid black' width='33%'>
                      <Typography textAlign='center' sx={{textDecoration: 'underline'}}>Pre-requisites for running away:</Typography>
                      <List>
                        <ListItem>
                          <ListItemText primary="1. All party members must be at least 60 feet away from any creature currently engaged in combat" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="2. All party members must agree to fleeing" />
                        </ListItem>
                      </List>
                    </Box>
                    <Box borderRight='1px solid black' width='34%'>
                      <Typography textAlign='center' sx={{textDecoration: 'underline'}}>Action of running away:</Typography>
                      <List>
                        <ListItem>
                          <ListItemText primary="1. All party members must make a Dexterity skill check. This is then averaged between all rolls" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="2. The DC is equal to the highest Challenge Rating among creatures currently engaged in combat minus the average player level" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="3. The minimum DC is 13" />
                        </ListItem>
                      </List>
                    </Box>
                    <Box width='33%'>
                      <Typography textAlign='center' sx={{textDecoration: 'underline'}}>Effects of running away:</Typography>
                      <List>
                        <ListItem>
                          <ListItemText primary="1. If successful, all creatures engaged in combat despawn and drop nothing" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="2. If successful, all party members are instantly teleported back together" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="3. If unsuccessful, all party members resume combat as normal. This may be attempted again after 1 full round of combat has passed" />
                        </ListItem>
                      </List>
                    </Box>
                  </Stack>
                </>
              :
                <>
                  <Typography variant='h4' textAlign='center'>Level</Typography>
                  <Stack direction='row'>
                    <Box width='50%' borderRight='1px solid black'>
                      <List>
                        <ListItem>
                          <ListItemText><b>Time:</b> A multiplier representing the rate in which time flows within the level. This value is anywhere between x0.5 and x2</ListItemText>
                        </ListItem>
                        <ListItem>
                          <ListItemText><b>Wi-Fi:</b> A percentage representing the strength of the Wi-Fi within the level</ListItemText>
                        </ListItem>
                        <ListItem>
                          <ListItemText><b>Sanity:</b> A numerical value between 0 and 100 representing how sane a player is. This decreases while within levels at varying rates</ListItemText>
                        </ListItem>
                      </List>
                    </Box>
                    <Box width='50%'>
                      <Typography textAlign='center' sx={{textDecoration: 'underline'}}>Effects of low sanity:</Typography>
                      <List>
                        <ListItem>
                          <ListItemText primary="While at or below 75 sanity, any mental stat is decreased by 1 OR maximum health is decreaed by 10" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="While at or below 50 sanity, any physical stat is decreased by 1 OR maximum health is decreaed by 15" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="While at or below 25 sanity, any stat is decreased by 2 OR maximum health is decreaed by 20" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="While at 0 sanity, you are fighting for life. Initially, the creature at 0 sanity must make a DC 10 Wisdom saving throw. This saving throw is remade every 10 minutes regardless of location" />
                        </ListItem>
                        <Stack direction='row' spacing={2}>
                          <Box width='50%'>
                            <Typography textAlign='center' sx={{textDecoration: 'underline'}}>On a pass</Typography>
                            <Typography textAlign='center'>Raise the DC by 5. No other effects</Typography>
                          </Box>
                          <Box width='50%'>
                            <Typography textAlign='center' sx={{textDecoration: 'underline'}}>On a fail</Typography>
                            <Typography textAlign='center'>Gain 1 level of exhaustion. The DC remains the same</Typography>
                          </Box>
                        </Stack>
                      </List>
                    </Box>
                  </Stack>
                </>
            }
          </Box>
        </Stack>
      </>
    )
  }

  return (
    <Box paddingLeft={5} paddingRight={5}>
      <DisplayInfo />
    </Box>
  );
}