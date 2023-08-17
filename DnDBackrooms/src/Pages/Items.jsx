import { collection, onSnapshot, doc, addDoc, orderBy, query } from 'firebase/firestore'
import db from '../Components/firebase'
import React, { useEffect, useState } from 'react'
import Item from '../Components/BackroomsItem';
import { Container, Divider, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

export default function Items() {
  const [items, setItems] = useState([]);
  const [itemIndex, setItemIndex] = useState(-1);
  const [raritySelection, setRaritySelection] = useState("All");

  const collectionRef = collection(db, 'items');

  useEffect(() => {
    const q = query(collectionRef, orderBy("itemNum", "asc"));

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

  const displayItem = index => {
    setItemIndex(index);
  }

  const rows = [
    ["Common", "1", "0", "0", "0", "0", "0"],
    ["Uncommon", "2", "1", "1", "1", "1.5", "1.5"],
    ["Rare", "6", "3", "3", "3.5", "4", "5"],
    ["Very Rare", "10", "5", "5.5", "6", "7", "8"],
    ["Legendary", "14", "7", "8", "8.5", "10", "11"],
    ["Artifact", "5x Tier 0 sell", "Varies per artifact", "N/A", "N/A", "N/A", "N/A"],
    ["One-of-a-kind", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"],
  ]

  return (
    <Container className='items'>
      <div className='generaliteminfo'>
        <Typography variant='h1'>Item Info and Pricing</Typography>
        <Typography variant='body1'>
          Note: Items of item number 0 are custom and/or magical, not innate to the Backrooms. Almond water is worth the equivalent of 500 gold in D&D.
          Magic item prices work per regular D&D rules such as a rare is 2,000 to 20,000 gold, which translates to 4 to 40 almond water.
          Almond water is the only unbuyable resource within the game.
        </Typography>
        <ItemPrices rows={rows}/>
        <Typography variant='caption' fontWeight='bold'>Prices may vary.</Typography>
        <Divider />
      </div>
      <div className='iteminfo'>
        <FormControl size='small' fullWidth>
          <InputLabel id='itemRarityLabel'>Item rarity</InputLabel>
          <Select labelId='itemRarityLabel' id='itemRarity' label='rarityPicker' value={raritySelection} onChange={(e, value) => {setRaritySelection(e.target.value); setItemIndex(-1)}}>
            <MenuItem value='All'>All</MenuItem>
            <MenuItem value='Common'>Common</MenuItem>
            <MenuItem value='Uncommon'>Uncommon</MenuItem>
            <MenuItem value='Rare'>Rare</MenuItem>
            <MenuItem value='Very Rare'>Very Rare</MenuItem>
            <MenuItem value='Legendary'>Legendary</MenuItem>
            <MenuItem value='Artifact'>Artifact</MenuItem>
            <MenuItem value='One-of-a-kind'>One-of-a-kind</MenuItem>
          </Select>
        </FormControl>
        {items.map((item, index) => {
          return raritySelection === 'All' ? <button onClick={() => {displayItem(index)}} key={index}>{item.name}</button>: item.rarity === raritySelection ? <button onClick={() => {displayItem(index)}} key={index}>{item.name}</button>: "";
        })}
        {itemIndex >= 0 ? 
          <Item 
            name={items[itemIndex].name}
            itemNum={items[itemIndex].itemNum}
            rarity={items[itemIndex].rarity}
            locations={items[itemIndex].locations}
            artifactPrice={items[itemIndex].artifactPrice}
            description={items[itemIndex].description}
            table={items[itemIndex].table}
          />: ""
        }
      </div>
    </Container>
  )
}

function ItemPrices(props) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}}>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell align='center'>Buy Price</TableCell>
            <TableCell align='center'>Tier 0 Sell Price</TableCell>
            <TableCell align='center'>Tier 3 Sell Price</TableCell>
            <TableCell align='center'>Tier 5 Sell Price</TableCell>
            <TableCell align='center'>Tier 6 Sell Price</TableCell>
            <TableCell align='center'>Tier 9 Sell Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map(row => {
            return (
              <TableRow key={row[0]} sx={{ '&:last-child td, &:kast-child th': {border: 0}}}>
                <TableCell>{row[0]}</TableCell>
                <TableCell align='center'>{row[1]}</TableCell>
                <TableCell align='center'>{row[2]}</TableCell>
                <TableCell align='center'>{row[3]}</TableCell>
                <TableCell align='center'>{row[4]}</TableCell>
                <TableCell align='center'>{row[5]}</TableCell>
                <TableCell align='center'>{row[6]}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}