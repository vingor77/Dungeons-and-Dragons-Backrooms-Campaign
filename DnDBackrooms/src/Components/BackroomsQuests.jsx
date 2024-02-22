import { Box, Card, CardContent, Chip, Divider, FormControl, Input, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'

export default function BackroomsQuests(props) {
  const [name, setName] = useState('');
  const [complete, setComplete] = useState('');
  const [type, setType] = useState('');

  const DisplayQuests = () => {
    const filtered = [];

    for(let i = 0; i < props.quests.length; i++) {
      if(
        (props.quests[i].name.toUpperCase().includes(name.toUpperCase()) || name === '') &&
        (props.quests[i].completed === complete || complete === '') &&
        (props.quests[i].type.toUpperCase().includes(type.toUpperCase()) || type === '')
      ) {
        filtered.push(props.quests[i]);
      }
    }

    return (
      <Stack direction='row' flexWrap='wrap' gap={1}>
        {filtered.map((quest, index) => {
          return (
            <Card sx={{width: {xs: '100%', md: '550px'}, textAlign: 'center', border: '1px solid black'}} key={index}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant='h4' textAlign='center'>{quest.name}</Typography>
                  {quest.completed ? <Chip label='Complete' /> : <Chip label='Incomplete' />}
                </Stack>
                <Divider />
                <Stack direction='row' textAlign='center'>
                  <Stack width='50%'>
                    <Typography><b>Acquisition:</b> {quest.outpost}</Typography>
                    <Typography><b>Recieved from:</b> {quest.questGiver}</Typography>
                      <Typography><b>Quest Type:</b> {quest.type}</Typography>
                  </Stack>
                  <Stack width='50%'>
                    <Typography><b>Objective:</b> {quest.description}</Typography>
                    <Typography><b>Reward:</b> {quest.reward}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )
        }
        )}
      </Stack>
    )
  }

  return (
    props.quests.length > 0 ?
      <>
        <Stack direction={{xs: 'column', md: 'row'}} spacing={2} marginBottom={1}>
          <Box>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder='Enter quest name' labelId='name'></Input>
          </Box>
          <FormControl sx={{minWidth: 250}}>
            <InputLabel id="complete">Select completion status</InputLabel>
            <Select
              labelId='complete'
              label={"Select complete"}
              onChange={e => setComplete(e.target.value)}
              value={complete}
            >
              <MenuItem value=''>None</MenuItem>
              <MenuItem value={true}>Complete</MenuItem>
              <MenuItem value={false}>Incomplete</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{minWidth: 250}}>
            <InputLabel id="type">Select quest type</InputLabel>
            <Select
              labelId='type'
              label={"Select type"}
              onChange={e => setType(e.target.value)}
              value={type}
            >
              <MenuItem value=''>None</MenuItem>
              <MenuItem value='Kill'>Kill</MenuItem>
              <MenuItem value='Gather'>Gather</MenuItem>
              <MenuItem value='Survey'>Survey</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <DisplayQuests />
      </>
    :
      <Typography variant='h5' textAlign='center'>No quests unlocked.</Typography>
  )
}