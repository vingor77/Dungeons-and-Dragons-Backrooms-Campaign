import { Box, Container, Toolbar } from '@mui/material'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'
import db from '../Components/firebase';
import { DataGrid } from '@mui/x-data-grid';
import BackroomsEntities from '../Components/BackroomsEntities';

export default function Entities() {
    const [entities, setEntities] = useState([]);
    const [currEntity, setCurrEntity] = useState("");
  
    const collectionRef = collection(db, 'entities');
  
    useEffect(() => {
      const q = query(collectionRef, orderBy("entityNum", "asc"));
  
      const unsub = onSnapshot(q, (querySnapshot) => {
        const objects = [];
        querySnapshot.forEach((doc) => {
          objects.push(doc.data());
        })
        setEntities(objects);
      })
  
      return () => {
        unsub();
      }
    }, [])
    
    const dataGridCols = [
      { field: 'id', headerName: 'ID', flex: 0},
      { 
        field: 'name', 
        headerName: 'Entity Name', 
        flex: 1
      },
      {
        field: 'num',
        headerName: 'Entity number',
        flex: 1
      },
      {
        field: 'cr',
        headerName: 'Challenge Rating',
        flex: 1
      },
      {
        field: 'location',
        headerName: 'Spawn Locations',
        flex: 1
      }
  ];
  
  let count = 0;
  let cr = "";
  const dataGridRows = [];
  let spawnLocations = "";

  entities.map(entity => {
    {entity.challengeRating === 0 ? cr = "N/A": cr = entity.challengeRating}
    {entity.locations.map((location, index) => {
      if(index === 0) {
        spawnLocations = location;
      }
      else {
        spawnLocations = spawnLocations + ", " + location;
      }
    })}

    count++;
    const row = {
      id: count,
      name: entity.name,
      num: entity.entityNum,
      cr: cr,
      location: spawnLocations
    }
    dataGridRows.push(row);
    spawnLocations = "";
  })

    return (
      <Box paddingLeft={5} paddingRight={5} paddingTop={2}>
        <Toolbar />
        <DataGrid
          onRowClick={(dataGridRows) => {
            setCurrEntity(dataGridRows.row.name);
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
        
        {entities.map((entity, index) => {
          return (
            entity.name === currEntity ? 
            <BackroomsEntities 
              key={index}
              name={entity.name}
              locations={entity.locations}
              description={entity.description}
              statBlock={entity.statBlock}
              challengeRating={entity.challengeRating}
              entityNum={entity.entityNum}
              drop={entity.drop}
            />: ""
          )
        })}
      </Box>
    )
}
