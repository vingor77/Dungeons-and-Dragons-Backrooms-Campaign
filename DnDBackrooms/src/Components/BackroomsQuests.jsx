import { Box, Divider, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';

export default function BackroomsQuests(props) {
  const [currQuest, setCurrQuest] = useState("");

  const dataGridCols = [
    { field: 'id', headerName: 'ID', flex: 0},
    { 
      field: 'name', 
      headerName: 'Quest Name', 
      flex: 1
    },
    {
      field: 'outpost',
      headerName: 'Acquired from',
      flex: 1
    },
    {
      field: 'questGiver',
      headerName: 'Quest giver',
      flex: 1
    },
    {
      field: 'type',
      headerName: 'Quest Type',
      flex: 1
    },
    {
      field: 'completed',
      headerName: 'Completed',
      flex: 1
    },
  ];

  let count = 0;
  const dataGridRows = [];

  props.quests.map(quest => {
    count++;
    const row = {
      id: count,
      name : quest.name,
      outpost: quest.outpost,
      questGiver: quest.questGiver,
      type: quest.type,
      completed: quest.completed ? "Yes": "No",
    }
    dataGridRows.push(row);
  })

  return (
    <div>
      {props.quests.length > 0 ?
        <>
          <DataGrid
            onRowClick={(dataGridRows) => {setCurrQuest(dataGridRows.row.name)}}
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

          {props.quests.map((quest, index) => {
            return (
              <div key={index}>
                {quest.name === currQuest ?
                  <Box textAlign='center'>
                    <Typography variant='h4' textAlign='center'>{quest.name}</Typography>
                    <Typography variant='body1'><b>Objective:</b> {quest.description}</Typography>
                    <Typography variant='body1'><b>Reward:</b> {quest.reward}</Typography>
                  </Box>
                :""
                }
              </div>
            )
          }
          )}
        </>
      :
        <Typography variant='h5' textAlign='center'>No quests unlocked.</Typography>
      }
    </div>
  )
}
