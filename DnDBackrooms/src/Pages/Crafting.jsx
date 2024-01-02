import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material'
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useState } from 'react'
import db from '../Components/firebase'

export default function Crafting() {
  const [items, setItems] = useState(null);

  const getItems = () => {
    const collectionRef = collection(db, 'crafts');
  
    const unsub = onSnapshot(collectionRef, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const sorted = doc.data().Items.sort((t1, t2) => (t1.Tier > t2.Tier) ? 1 : (t1.Tier < t2.Tier) ? -1 : 0);
        setItems(sorted);
      })
    })

    return () => unsub();
  }

  return (
    <Box paddingLeft={5} paddingRight={5} paddingTop={2}>
      {items === null ? 
        getItems()
      :
        <>
          <Typography variant='h2' sx={{textAlign: 'center'}}>Craftable items</Typography>
          <Stack direction='row' flexWrap='wrap' gap={1}>
            {items.map((item, index) => {
              const components = item.Pieces.split(",");
              const tools = item.Tools.split(",");
            
              return (
                <Card sx={{width: 275, textAlign: 'center'}} key={index}>
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
                    <Typography sx={{textDecoration: 'underline', fontWeight: 'bold'}}>Components</Typography>
                    {components.map((component) => {
                      return <Typography>{component}</Typography>
                    })}
                  </CardContent>
                </Card>
              )
            })}
          </Stack>
        </>
      }
    </Box>
  )
}