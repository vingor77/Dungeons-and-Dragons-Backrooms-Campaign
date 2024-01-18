import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import db from '../Components/firebase'
import React, { useEffect, useState } from 'react'
import Item from '../Components/BackroomsItem';
import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function Items() {
  const [items, setItems] = useState([]);
  const [currItem, setCurrItem] = useState("");
  const collectionRef = collection(db, 'items');

  useEffect(() => {
    const q = query(collectionRef, orderBy("rarity", "asc"));

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

  const dataGridCols = [
    { field: 'id', headerName: 'ID', flex: 0},
    { 
      field: 'name', 
      headerName: 'Item Name', 
      flex: 1
    },
    {
      field: 'num',
      headerName: 'Item number',
      flex: 1
    },
    {
      field: 'rarity',
      headerName: 'Rarity',
      flex: 1
    },
    {
      field: 'price',
      headerName: 'Artifact Price',
      flex: 1
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

  const Prices = () => {
    return (
      <Stack direction='row' flexWrap='wrap' gap={1}>
        {rows.map((row, index) => {
          return (
            <Card sx={{width: '220px'}} key={index}>
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

  return (
    <Box paddingLeft={5} paddingRight={5}>
      <Typography variant='h4' textAlign='center'>Prices</Typography>
      <Prices />
      <br />
      <Typography variant='caption' fontWeight='bold'>Prices may vary.</Typography>
      <Divider />
      <br />
      <Box>
        <Typography variant='h4' textAlign='center'>Items</Typography>
        <Typography textAlign='center'>Items of item number 0 are custom and/or magical.</Typography>
        <DataGrid
          onRowClick={(dataGridRows, event) => {
            setCurrItem(dataGridRows.row.name);
          }}
          rows={dataGridRows}
          columns={dataGridCols}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              }
            },
            columns: {
              columnVisibilityModel: {
                id: false
              }
            }
          }}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
        />

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
              display="normal"
            />: ""
          )
        })}
      </Box>
    </Box>
  )
}