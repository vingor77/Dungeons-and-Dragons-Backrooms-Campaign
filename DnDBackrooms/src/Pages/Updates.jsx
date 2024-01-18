import { Box, Button, Card, CardActions, CardContent, FormControl, Input, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import { collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import db from '../Components/firebase';

export default function Updates() {
  const [craftTier, setCraftTier] = useState(1);
  const [tool, setTool] = useState('');
  const [toolList, setToolList] = useState(null);

  const [gearSets, setGearSets] = useState(null);
  const [gear, setGear] = useState('');
  const [gearBonuses, setGearBonuses] = useState(0);

  const [groups, setGroups] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [relationValues, setRelationValues] = useState([0, 0]);

  const [quests, setQuests] = useState(null);
  const [selectedQuest, setSelectedQuest] = useState('');
  const [unlockComplete, setUnlockComplete] = useState([false, false]);

  const getTools = () => {
    const collectionRef = collection(db, 'crafts');

    const unsub = onSnapshot(collectionRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data().revealed);
      })
      setToolList(objects);
    })

    return () => {
      unsub();
    }
  }

  const getGear = () => {
    const collectionRef = collection(db, 'gearSets');

    const unsub = onSnapshot(collectionRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setGearSets(objects);
    })

    return () => {
      unsub();
    }
  }

  const getGroups = () => {
    const collectionRef = collection(db, 'groups');

    const unsub = onSnapshot(collectionRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setGroups(objects);
    })

    return () => {
      unsub();
    }
  }

  const getQuests = () => {
    const collectionRef = collection(db, 'quests');

    const unsub = onSnapshot(collectionRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setQuests(objects);
    })

    return () => {
      unsub();
    }
  }

  const editCraft = () => {
    if(craftTier > 5 || craftTier < 1) {
      alert('Crafting tier must be between 1 and 5.');
      return;
    }
    if(tool === '') {
      alert('Please select tool.');
      return;
    }

    let tempTools = toolList['0'];
    tempTools[tool] = craftTier;

    updateDoc(doc(db, 'crafts', 'Crafts'), {
      revealed: tempTools
    });

    setCraftTier(0);
    setTool('');
  }

  const editGear = () => {
    if(gear === '') {
      alert('Please select gear.')
      return
    }

    let gearCount = 0;

    for(let i = 0; i < gearSets.length; i++) {
      if(gearSets[i].setName === gear) {
        gearCount = gearSets[i].gear.length;
      }
    }

    if(gearBonuses >= gearCount || gearBonuses < 0) {
      alert('Revealed must be between 0 and ' + (gearCount - 1));
      return;
    }

    updateDoc(doc(db, "gearSets", gear), {
      revealed: gearBonuses
    });

    setGearBonuses(0);
    setGear('');
  }

  const editGroups = () => {
    if(selectedGroup === '') {
      alert('Please select a group.');
      return;
    }

    if(relationValues[0] > 10 || relationValues[1] > 5 || relationValues[0] < 0 || relationValues[1] < 0) {
      alert('Tier must be within 0 and 10 and Points must be within 0 and 5.');
      return;
    }

    updateDoc(doc(db, "groups", selectedGroup), {
      relations: relationValues
    });

    setRelationValues([0, 0]);
    setSelectedGroup('');
  }

  const editQuests = () => {
    if(selectedQuest === '') {
      alert('Please select a quest');
      return;
    }

    updateDoc(doc(db, "quests", selectedQuest), {
      unlocked: unlockComplete[0],
      completed: unlockComplete[1]
    });

    setUnlockComplete([false, false]);
    setSelectedQuest('');
  }

  return (
    <Box marginLeft={5} marginRight={4} marginTop={2}>
      <Stack direction='row' flexWrap='wrap' gap={1}>
        {toolList === null ?
          getTools()
        :
          <Card sx={{width: '49%', minWidth: '49%', border: '1px solid black'}}>
            <CardContent>
              <Typography variant='h5'>Edit crafting tier</Typography>
              <Stack direction='row'>
                <FormControl sx={{ m: 1, minWidth: 100 }}>
                  <InputLabel id="toolSelection">Tool</InputLabel>
                  <Select
                    labelId='toolSelection'
                    label={"Select Tool"}
                    onChange={e => {setTool(e.target.value)}}
                    value={tool}
                  >
                    {Object.keys(toolList['0']).map((t) => {
                      return <MenuItem value={t}>{t}</MenuItem>
                    })}
                  </Select>
                </FormControl>
                <Box>
                  <InputLabel id='toolTier'>Tier</InputLabel>
                  <Input type='number' value={craftTier} onChange={(e) => setCraftTier(parseInt(e.target.value))} labelId='toolTier'></Input>
                </Box>
              </Stack>
            </CardContent>
            <CardActions>
              <Button onClick={editCraft}>Submit changes</Button>
            </CardActions>
          </Card>
        }

        {gearSets === null ?
          getGear()
        :
          <Card sx={{width: '50%', minWidth: '50%', border: '1px solid black'}}>
            <CardContent>
              <Typography variant='h5'>Edit gear set</Typography>
              <Stack direction='row'>
                <FormControl sx={{ m: 1, minWidth: 100 }}>
                  <InputLabel id="gearSelection">Gear</InputLabel>
                  <Select
                    labelId='gearSelection'
                    label={"Select Gear"}
                    onChange={e => {setGear(e.target.value)}}
                    value={gear}
                  >
                    {gearSets.map((set) => {
                      return <MenuItem value={set.setName}>{set.setName}</MenuItem>
                    })}
                  </Select>
                </FormControl>
                <Box>
                  <InputLabel id='gearRevealed'>Revealed</InputLabel>
                  <Input type='number' value={gearBonuses} onChange={(e) => setGearBonuses(parseInt(e.target.value))} placeholder='Enter tier change' labelId='gearRevealed'></Input>
                </Box>
              </Stack>
            </CardContent>
            <CardActions>
              <Button onClick={editGear}>Submit changes</Button>
            </CardActions>
          </Card>      
        }

        {groups === null ?
          getGroups()
        :
          <Card sx={{width: '49%', minWidth: '49%', border: '1px solid black'}}>
            <CardContent>
              <Typography variant='h5'>Edit group relations</Typography>
              <Stack direction='row' spacing={1}>
                <FormControl sx={{ m: 1, minWidth: 100 }}>
                  <InputLabel id="groupSelection">Group</InputLabel>
                  <Select
                    labelId='groupSelection'
                    label={"Select group"}
                    onChange={e => {setSelectedGroup(e.target.value)}}
                    value={selectedGroup}
                  >
                    {groups.map((group) => {
                      return (
                        group.relations[0] === 'None' ? "" : <MenuItem value={group.name}>{group.name}</MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
                <Box>
                  <InputLabel id='relationTier'>Tier</InputLabel>
                  <Input type='number' value={relationValues[0]} onChange={(e) => setRelationValues([parseInt(e.target.value), relationValues[1]])} placeholder='Enter tier change' id='relationTier'></Input>
                </Box>
                <Box>
                  <InputLabel id='relationPoint'>Points</InputLabel>
                  <Input type='number' value={relationValues[1]} onChange={(e) => setRelationValues([relationValues[0], parseInt(e.target.value)])} placeholder='Enter points change' id='relationPoint'></Input>
                </Box>
              </Stack>
            </CardContent>
            <CardActions>
              <Button onClick={editGroups}>Submit changes</Button>
            </CardActions>
          </Card>      
        }

        {quests === null ?
          getQuests()
        :
          <Card sx={{width: '50%', minWidth: '50%', border: '1px solid black'}}>
            <CardContent>
              <Typography variant='h5'>Edit quest relations</Typography>
              <FormControl sx={{ m: 1, minWidth: 100 }}>
                <InputLabel id="questSelection">Quest</InputLabel>
                <Select
                  labelId='questSelection'
                  label={"Select quest"}
                  onChange={e => {setSelectedQuest(e.target.value)}}
                  value={selectedQuest}
                >
                  {quests.map((quest) => {
                    return (
                      <MenuItem value={quest.name}>{quest.name}</MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 100 }}>
                <InputLabel id="lockSelect">Lock status</InputLabel>
                <Select
                  labelId='lockSelect'
                  label={"Select status"}
                  onChange={e => {setUnlockComplete([e.target.value, unlockComplete[1]])}}
                  value={unlockComplete[0]}
                >
                  <MenuItem value={true}>true</MenuItem>
                  <MenuItem value={false}>false</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 100 }}>
                <InputLabel id="completeSelect">Complete status</InputLabel>
                <Select
                  labelId='completeSelect'
                  label={"Select status"}
                  onChange={e => {setUnlockComplete([unlockComplete[0], e.target.value])}}
                  value={unlockComplete[1]}
                >
                  <MenuItem value={true}>true</MenuItem>
                  <MenuItem value={false}>false</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
            <CardActions>
              <Button onClick={editQuests}>Submit changes</Button>
            </CardActions>
          </Card>      
        }
      </Stack>
    </Box>
  )
}
