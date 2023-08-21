import { Container } from '@mui/material'
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
    
    const CreateDataGrid = () => {
      const dataGridCols = [
          { field: 'id', headerName: 'ID', width: 90},
          { 
            field: 'name', 
            headerName: 'Entity Name', 
            width: 250 
          },
          {
            field: 'num',
            headerName: 'Entity number',
            width: 250,
          },
          {
            field: 'cr',
            headerName: 'Challenge Rating',
            width: 250,
            editable: true,
          },
      ];
      
      let count = 0;
      let cr = "";
      const dataGridRows = [];
    
      entities.map(entity => {
        {entity.challengeRating === 0 ? cr = "N/A": cr = entity.challengeRating}
        count++;
        const row = {
          id: count,
          name: entity.name,
          num: entity.entityNum,
          cr: cr,
        }
        dataGridRows.push(row);
      })

      return (
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
              }
            }}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
          />
      );
    }

    return (
      <Container>
        <CreateDataGrid />
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
            />: ""
          )
        })}
      </Container>
    )
}