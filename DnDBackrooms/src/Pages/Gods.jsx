import { Container, Divider, Typography } from '@mui/material'
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

  const CreateDataGrid = () => {
    const dataGridCols = [
        { field: 'id', headerName: 'ID', width: 90},
        { 
          field: 'name',
          headerName: 'Name',
          width: 250
        },
        {
          field: 'godOf',
          headerName: 'God of',
          width: 250,
        },
        {
          field: 'avatarCount',
          headerName: '# of avatars',
          width: 250,
        },
    ];
    
    let count = 0;
    const dataGridRows = [];
  
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

    return (
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
    );
  }

  return (
    <Container>
      {gods === null ? getGods() : 
        <>
          <CreateDataGrid />
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
    </Container>
  )
}
