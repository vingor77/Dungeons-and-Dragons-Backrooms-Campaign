import { Box, Divider, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';

export default function BackroomsQuests(props) {
  const [currQuest, setCurrQuest] = useState("");

  const CreateUnlockedGrid = () => {
    const dataGridCols = [
      { field: 'id', headerName: 'ID', width: 50},
      { 
        field: 'name', 
        headerName: 'Quest Name', 
        width: 200
      },
      {
        field: 'outpost',
        headerName: 'Acquired from',
        width: 200,
      },
      {
        field: 'questGiver',
        headerName: 'Quest giver',
        width: 200,
      },
      {
        field: 'type',
        headerName: 'Quest Type',
        width: 200
      },
      {
        field: 'completed',
        headerName: 'Completed',
        width: 200,
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
    )
  }

  return (
    <div>
      {props.quests.length > 0 ?
        <>
          <CreateUnlockedGrid />
          {props.quests.map((quest, index) => {
            return (
              <div key={index}>
                {quest.name === currQuest ?
                  <>
                    <Typography variant='h2'>{quest.name}</Typography>
                    <br />
                    <Divider />
                    <br />
                    <Stack direction='row' spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                      <Box width='50%'>
                        <Typography variant='h5'>Description</Typography>
                        <Typography variant='body1'>{quest.description}</Typography>
                      </Box>
                      <Box>
                        <Typography variant='h5'>Reward</Typography>
                        <Typography variant='body1'>{quest.reward}</Typography>
                      </Box>
                    </Stack>
                  </>
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
