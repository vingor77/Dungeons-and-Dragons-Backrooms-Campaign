import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import db from '../Components/firebase'
import React, { useEffect, useState } from 'react'
import Item from '../Components/BackroomsItem';
import { Container, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function Items() {
  const [items, setItems] = useState([]);
  const [currItem, setCurrItem] = useState("");

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

  /*
  const getItemLocations = () => {
    for(let i = 0; i < items.length; i++) {
      let found = false;
      for(let j = 0; j < items[i].locations.length; j++) {
        if(items[i].locations[j] !== 'All' && !found) {
          console.log(items[i].name);
          found = true;
        }
      }
    }
  }
  */

  const rows = [
    ["Common", "1", "0", "0", "0", "0", "0"],
    ["Uncommon", "2", "1", "1", "1", "1.5", "1.5"],
    ["Rare", "6", "3", "3", "3.5", "4", "5"],
    ["Very Rare", "10", "5", "5.5", "6", "7", "8"],
    ["Legendary", "14", "7", "8", "8.5", "10", "11"],
    ["Artifact", "5x Tier 0 sell", "Varies per artifact", "N/A", "N/A", "N/A", "N/A"],
    ["One-of-a-kind", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"],
  ]

  const CreateDataGrid = () => {
    const dataGridCols = [
      { field: 'id', headerName: 'ID', width: 90},
      { 
        field: 'name', 
        headerName: 'Item Name', 
        width: 250 
      },
      {
        field: 'num',
        headerName: 'Item number',
        width: 250,
      },
      {
        field: 'rarity',
        headerName: 'Rarity',
        width: 250,
        editable: true,
      },
      {
        field: 'price',
        headerName: 'Artifact Price',
        width: 250,
        editable: true,
      },
    ];

    let count = 0;
    let arPrice = 0;
    const dataGridRows = [];

    items.map(item => {
      {item.artifactPrice === -1 ? arPrice = "N/A": arPrice = item.artifactPrice}
      count++;
      const row = {
        id: count,
        name: item.name,
        num: item.itemNum,
        rarity: item.rarity,
        price: arPrice,
      }
      dataGridRows.push(row);
    })

    return (
      <DataGrid
        onRowClick={(dataGridRows, event) => {
          event.defaultPrevented = true;
          setCurrItem(dataGridRows.row.name);
        }}
        rows={dataGridRows}
        columns={dataGridCols}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            }
          }
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
      />
    );
  }

  return (
    <Container className='items'>
      <div className='generaliteminfo'>
        <Typography variant='h1' sx={{textAlign: 'center'}}>Item Info and Pricing</Typography>
        <ul>
          <li>Almond water is worth the equivalent of 500 gold in D&D.</li>
          <li>Magic item prices work per regular D&D rules such as a rare is 2,000 to 20,000 gold, which translates to 4 to 40 almond water.</li>
          <li>Almond water is the only unbuyable resource within the game.</li>
        </ul>
        <ItemPrices rows={rows}/>
        <br />
        <Typography variant='caption' fontWeight='bold'>Prices may vary.</Typography>
        <Divider />
      </div>
      <br />
      <div className='iteminfo'>
        <Typography variant='h2'>Items:</Typography>
        <Typography variant='body1'>Items of item number 0 are custom and/or magical.</Typography>
        <CreateDataGrid />
        {items.map((item, index) => {
          return (
            item.name === currItem ? 
            <Item 
              key={index}
              name={item.name}
              itemNum={item.itemNum}
              locations={item.locations}
              description={item.description}
              table={item.table}
            />: ""
          )
        })}
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