import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import db from '../Components/firebase'
import React, { useEffect, useState } from 'react'
import Item from '../Components/BackroomsItem';
import { Box, Card, CardContent, Divider, FormControl, Input, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';

export default function Items() {
  const [items, setItems] = useState([]);
  const collectionRef = collection(db, 'items');
  const [name, setName] = useState('');
  const [num, setNum] = useState('');
  const [rarity, setRarity] = useState('');

  useEffect(() => {
    const q = query(collectionRef, orderBy("name", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setItems(objects);
    })

    return () => {
      unsub();
    }
  }, [])

  const rows = [
    ["Common", "1", "0"],
    ["Uncommon", "2", "1"],
    ["Rare", "6", "3"],
    ["Very Rare", "10", "5"],
    ["Legendary", "14", "7"],
    ["Artifact", "5x Sell", "Varies"],
    ["One-of-a-kind", "N/A", "N/A"]
  ]

  const Prices = () => {
    return (
      <Stack direction='row' flexWrap='wrap' gap={1}>
        {rows.map((row, index) => {
          return (
            <Card sx={{width: {xs: '100%', md: '220px'}}} key={index}>
              <CardContent>
                <Typography textAlign='center' variant='h5'><b>{row[0]}</b></Typography>
                <Typography textAlign='center'>Buy price: {row[1]}</Typography>
                <Typography textAlign='center'>Base sell price: {row[2]}</Typography>
              </CardContent>
            </Card>
          )
        })}
      </Stack>
    )
  }

  const DisplayItems = () => {
    const filtered = [];

    for(let i = 0; i < items.length; i++) {
      if(
        (items[i].name.toUpperCase().includes(name.toUpperCase()) || name === '') &&
        (items[i].rarity === rarity || rarity === '') &&
        ((parseInt(num) === 0 && items[i].itemNum === 0) || num === '')
      ) {
        filtered.push(items[i]);
      }
      else if(
        (items[i].name.toUpperCase().includes(name.toUpperCase()) || name === '') &&
        (items[i].rarity === rarity || rarity === '') &&
        ((parseInt(num) !== 0 && items[i].itemNum !== 0) || num === '')
      ) {
        filtered.push(items[i]);
      }
    }

    return (
      <Stack direction='row' flexWrap='wrap' gap={1}>
        {filtered.map((item, index) => {
          return (
            <Item 
              key={index}
              name={item.name}
              itemNum={item.itemNum}
              locations={item.locations}
              description={item.description}
              table={item.table}
              rarity={item.rarity}
              artifactPrice={item.artifactPrice}
              display="normal"
            />
          )
        })}
      </Stack>
    )
  }

  return (
    <Box paddingLeft={5} paddingRight={5} paddingTop={2}>
      <Typography variant='h4' textAlign='center'>Prices</Typography>
      <Prices />
      <br />
      <Typography variant='caption' fontWeight='bold'>Prices may vary.</Typography>
      <Divider />
      <br />

      <Stack direction={{xs: 'column', md: 'row'}} spacing={2} flexWrap='wrap' gap={1}>
        <Box>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder='Enter item name' labelId='name'></Input>
        </Box>
        <FormControl sx={{minWidth: 150}}>
          <InputLabel id="rarity">Select Type</InputLabel>
          <Select
            labelId='type'
            label={"Select type"}
            onChange={e => setNum(e.target.value)}
            value={num}
          >
            <MenuItem value=''>None</MenuItem>
            <MenuItem value='0'>Custom</MenuItem>
            <MenuItem value='1'>Backrooms</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{minWidth: 150}}>
          <InputLabel id="rarity">Select Rarity</InputLabel>
          <Select
            labelId='rarity'
            label={"Select Rarity"}
            onChange={e => setRarity(e.target.value)}
            value={rarity}
          >
            <MenuItem value=''>None</MenuItem>
            <MenuItem value='Common'>Common</MenuItem>
            <MenuItem value='Uncommon'>Uncommon</MenuItem>
            <MenuItem value='Rare'>Rare</MenuItem>
            <MenuItem value='Very Rare'>Very Rare</MenuItem>
            <MenuItem value='Legendary'>Legendary</MenuItem>
            <MenuItem value='Artifact'>Artifact</MenuItem>
            <MenuItem value='One-of-a-kind'>One-of-a-kind</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <DisplayItems />
    </Box>
  )
}