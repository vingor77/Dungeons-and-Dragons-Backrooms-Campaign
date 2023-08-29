import { Box, Container, Divider, Typography } from '@mui/material'
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useState } from 'react'
import db from '../Components/firebase'
import { DataGrid } from '@mui/x-data-grid'

export default function Avatars() {
  const [avatars, setAvatars] = useState(null);
  const [currAvatar, setCurrAvatar] = useState("");

  const getAvatars = () => {
    const collectionRef = collection(db, 'avatars');
  
    const unsub = onSnapshot(collectionRef, (querySnapshot) => {
      let stuff = [];
      querySnapshot.forEach((doc) => {
        stuff.push(doc.data());
      })
      setAvatars(stuff);
    })

    return () => unsub();
  }

  const Overview = () => {
    return (
      <Box>
        <Typography variant='h2'>Overview</Typography>
        <Box border='3px solid black'>
          <Typography variant='body1' sx={{textIndent: 25}}>"And so, the Gods descended from the heavens, as they came down to form paradise. Just as a sculptor brings forth their masterpiece from a lump of clay, the divine touch of the Gods brought forth paradise from the Void. Each God played a pivotal role in creation, blessing us with many gifts…and necessary evils. We give ourselves to the Gods, appeasing them in the hopes that they may continue to bless us with yet more gifts, and usher in eons of prosperity to come."</Typography>
        </Box>
        <br />
        <Box border='3px solid black'>
          <Typography variant='body1' sx={{textIndent: 25}}>In the beginning, The Backrooms were home to many powerful beings, each commanding an aspect of reality. They were as close as family, but that all changed after humans first entered The Backrooms. These siblings had reigned as gods over the humans, until they were overthrown and their alliance was fractured. Today, many of the "gods" are corrupted, dead or isolated, but they may soon be reunited against a force which threatens their entire home, and all its inhabitants alike.</Typography>
          <br />
          <Typography variant='body1' sx={{textIndent: 25}}>The Pantheon is one of the more esoteric interpretations of the Backrooms, shedding light on its metaphysical nature and the forces at work behind it. At the center of its narrative are siblings whose relationships with each-other transcend time and space. Although this story may be one of Gods, there is an undeniably human element to it. Its themes are of legacy, purpose, betrayal, heartbreak, reconciliation, and more.</Typography>
        </Box>
      </Box>
    )
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
          field: 'status',
          headerName: 'Status',
          width: 250,
        },
        {
          field: 'level',
          headerName: 'Primary level',
          width: 250,
        },
        {
          field: 'god',
          headerName: 'Avatar of',
          width: 250,
        },
    ];
    
    let count = 0;
    const dataGridRows = [];
  
    avatars.map(avatar => {
      count++;
      const row = {
        id: count,
        name: avatar.name,
        status: avatar.status,
        level: avatar.level,
        god: avatar.god,
      }
      dataGridRows.push(row);
    })

    return (
        <DataGrid
          onRowClick={(dataGridRows) => {
            setCurrAvatar(dataGridRows.row.name);
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
    );
  }

  const ShowAvatarInfo = (props) => {
    return (
      <>
        <Typography variant='h2'>{props.avatar.name}, avatar of {props.avatar.god}</Typography>
        <Typography variant='h5'>Quote</Typography>
        <Divider />
        <br />
        <Typography variant='body1'>{props.avatar.quote}</Typography>
        <br />
        <Typography variant='h5'>Overview</Typography>
        <Divider />
        <br />
        <Typography variant='body1'>{props.avatar.overview}</Typography>
      </>
    )
  }

  return (
    <Container>
      <Overview />
      {avatars === null ? getAvatars() : 
      <>
        <CreateDataGrid />
        {avatars.map((avatar, index) => {
          return (
            <div key={index}>
              {avatar.name === currAvatar ?
              <>
                <ShowAvatarInfo avatar={avatar}/>
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
