import { Box, Card, CardContent, Divider, FormControl, Input, InputLabel, MenuItem, Select, Stack, Toolbar, Typography } from '@mui/material'
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useState } from 'react'
import db from '../Components/firebase'

export default function Crafting() {
  const [items, setItems] = useState(null);
  const [revealed, setRevealed] = useState({});
  const [tier, setTier] = useState('1');
  const [tool, setTool] = useState('');
  const [name, setName] = useState('');

  const getItems = () => {
    const collectionRef = collection(db, 'crafts');
  
    const unsub = onSnapshot(collectionRef, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const sorted = doc.data().data.sort((t1, t2) => (t1.Tier > t2.Tier) ? 1 : (t1.Tier < t2.Tier) ? -1 : 0);
        setItems(sorted);
        setRevealed(doc.data().revealed);
      })
    })

    return () => unsub();
  }

  const DisplayCrafts = () => {
    const filtered = [];

    for(let i = 0; i < items.length; i++) {
      if(
        (items[i].Item.toUpperCase().includes(name.toUpperCase()) || name === '') &&
        items[i].Tier === parseInt(tier) &&
        items[i].Tools.includes(tool)
      ) {
        filtered.push(items[i]);
      }
    }

    return (
      <Stack direction='row' flexWrap='wrap' gap={1}>
        {filtered.map((item, index) => {
          const components = item.Pieces.split(",");
          const tools = item.Tools.split(",");
          let count = 0;
        
          for(let i = 0; i < tools.length; i++) {
            if(item.Tier <= revealed[tools[i]]) {
              count++;
            }
          }
        
          return (
            <>
              {count === 0 ?
                ""
              :
                <Card sx={{width: {xs: '100%', md: '275px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '300px'}} key={index}>
                  <CardContent>
                    <Typography variant="h5">{item.Item} <i>({item.Tier})</i></Typography>
                    <Divider />
                    <Stack direction='row' spacing={2} textAlign='center' divider={<Divider orientation="vertical" flexItem />}>
                      <Box width='10%'>
                        <Typography sx={{textDecoration: 'underline', fontWeight: 'bold'}}>DC</Typography>
                        <Typography>{item.DC}</Typography>
                      </Box>
                      <Box width='40%'>
                        <Typography sx={{textDecoration: 'underline', fontWeight: 'bold'}}>Stat</Typography>
                        <Typography>{item.Stat}</Typography>
                      </Box>
                      <Box width='50%'>
                        <Typography sx={{textDecoration: 'underline', fontWeight: 'bold'}}>Tools</Typography>
                        {tools.map((tool) => {
                          return <Typography>{tool}</Typography>
                        })}
                      </Box>
                    </Stack>
                    <Divider />
                    <Stack direction='row' divider={<Divider orientation="vertical" flexItem />}>
                      <Box width='50%'>
                        <Typography sx={{textDecoration: 'underline', fontWeight: 'bold'}}>NPC only</Typography>
                        <Typography>{item.npc}</Typography>
                      </Box>
                      <Box width='50%'>
                        <Typography sx={{textDecoration: 'underline', fontWeight: 'bold'}}>Attempts</Typography>
                        <Typography>{item.attempts}</Typography>
                      </Box>
                    </Stack>
                    <Divider />
                    <Typography sx={{textDecoration: 'underline', fontWeight: 'bold'}}>Components</Typography>
                    {components.map((component) => {
                      return <Typography>{component}</Typography>
                    })}
                  </CardContent>
                </Card>
              }
            </>
          )
        })}
      </Stack>
    )
  }

  return (
    <Box paddingLeft={5} paddingRight={5} paddingTop={2}>
      <Toolbar />
      {items === null ?
        <>
          {getItems()}
        </>
      :
        <Box>
          <Typography variant='h2' sx={{textAlign: 'center'}}>Craftable items</Typography>
          <Stack spacing={2} direction={{sm: 'column', md: 'row'}} gap={1}>
            <Box>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder='Enter item name' labelId='name'></Input>
            </Box>
            <FormControl sx={{minWidth: 150}}>
              <InputLabel id="tool">Select Tool</InputLabel>
              <Select
                labelId='tool'
                label={"Select Tool"}
                onChange={e => setTool(e.target.value)}
                value={tool}
              >
                <MenuItem value=''>None</MenuItem>
                <MenuItem value='Alchemist'>Alchemist</MenuItem>
                <MenuItem value='Calligrapher'>Calligrapher</MenuItem>
                <MenuItem value='Cook'>Cook</MenuItem>
                <MenuItem value='Leatherworker'>Leatherworker</MenuItem>
                <MenuItem value='Smith'>Smith</MenuItem>
                <MenuItem value='Carpenter'>Carpenter</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{minWidth: 150}}>
              <InputLabel id="tier">Select Tier</InputLabel>
              <Select
                labelId='tier'
                label={"Select Tier"}
                onChange={e => setTier(e.target.value)}
                value={tier}
              >
                <MenuItem value='1'>1</MenuItem>
                <MenuItem value='2'>2</MenuItem>
                <MenuItem value='3'>3</MenuItem>
                <MenuItem value='4'>4</MenuItem>
                <MenuItem value='5'>5</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <DisplayCrafts />
        </Box>
      }
    </Box>
  )
}