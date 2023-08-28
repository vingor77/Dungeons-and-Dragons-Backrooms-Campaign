import { Container } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import db, { storage } from '../Components/firebase'
import BackroomsOutposts from '../Components/BackroomsOutposts';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { DataGrid } from '@mui/x-data-grid';

export default function Outposts() {
  const [outposts, setOutposts] = useState([]);
  const [shopImages, setShopImages] = useState([]);
  const [currOutpost, setCurrOutpost] = useState("");

  const collectionRef = collection(db, 'outposts');
  useEffect(() => {
    const unsub = onSnapshot(collectionRef, (querySnapshot) => {
      const objects = [];
      querySnapshot.forEach((doc) => {
        objects.push(doc.data());
      })
      setOutposts(objects);
    })

    return () => {
      unsub();
    }
  }, []);

  useEffect(() => {
    const storageRef = ref(storage, 'shops/' + currOutpost);
  
    let tempImages = [];
    listAll(storageRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          tempImages.push(url);
        })
      })
    })
    setShopImages(tempImages);

  }, [currOutpost])

  const CreateOutpostGrid = () => {
    const dataGridCols = [
      { field: 'id', headerName: 'ID', width: 90},
      { 
        field: 'name', 
        headerName: 'Outpost Name', 
        width: 250 
      },
      {
        field: 'group',
        headerName: 'Belongs to',
        width: 250,
      },
      {
        field: 'location',
        headerName: 'Location',
        width: 250,
      },
    ];
  
    let count = 0;
    const dataGridRows = [];

    outposts.map(outpost => {
      count++;
      const row = {
        id: count,
        name: outpost.name,
        group: outpost.group,
        location: outpost.location,
      }
      dataGridRows.push(row);
    })

    return (
      <DataGrid
        onRowClick={(dataGridRows) => setCurrOutpost(dataGridRows.row.name)}
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
    )
  }

  return (
    <Container>
      <CreateOutpostGrid />
        {outposts.map((outpost, index) => {
          if(outpost.name === currOutpost) {
            return <BackroomsOutposts outpost={outpost} shopImages={shopImages} key={index}/>
          }
        })}
    </Container>
  )
}
