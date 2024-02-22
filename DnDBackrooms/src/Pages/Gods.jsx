import { Box, Container, Divider, Toolbar, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useState } from 'react'
import db from '../Components/firebase'

export default function Gods() {
  const [gods, setGods] = useState(null);
  const [currGod, setCurrGod] = useState("");

  const getGods = () => {
    const collectionRef = collection(db, 'gods');
  
    const unsub = onSnapshot(collectionRef, (querySnapshot) => {
      let stuff = [];
      querySnapshot.forEach((doc) => {
        stuff.push(doc.data());
      })
      setGods(stuff);
    })

    return () => unsub();
  }
  
  const dataGridCols = [
    { field: 'id', headerName: 'ID', flex: 0},
    { 
      field: 'name',
      headerName: 'Name',
      flex: 1
    },
    {
      field: 'godOf',
      headerName: 'God of',
      flex: 1
    },
    {
      field: 'avatarCount',
      headerName: '# of avatars',
      flex: 1
    },
  ];

  let count = 0;
  const dataGridRows = [];

  if(gods === null) {
    getGods();
  }
  else {
    gods.map(god => {
      count++;
      const row = {
        id: count,
        name: god.name,
        godOf: god.godOf,
        avatarCount: god.avatarCount,
      }
      dataGridRows.push(row);
    })
  }

  return (
    <Box paddingLeft={5} paddingRight={5} paddingTop={2}>
      <Toolbar />
      {gods === null ? getGods() : 
        <>
          <DataGrid
            onRowClick={(dataGridRows) => {
              setCurrGod(dataGridRows.row.name);
            }}
            rows={dataGridRows}
            columns={dataGridCols}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                }
              },
              columns: {
                columnVisibilityModel: {
                  id: false
                }
              }
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
          />
          
          {gods.map((god, index) => {
            return (
              <div key={index}>
                {god.name === currGod ?
                  <>
                    <Typography variant='h2'>{god.name}, God of {god.godOf}</Typography>
                    <Typography variant='h5'>Avatars</Typography>
                    <Divider />
                    <ul>
                      {god.avatars.map((avatar, index) => {
                        return <li key={index}>{avatar}</li>
                      })}
                    </ul>
                  </>
                  :""
                }
              </div>
            )
          })}
        </>
      }
    </Box>
  )
}
