import React from 'react'
import { Box, Card, Chip, Divider, Stack, Table, TableCell, TableRow, Typography } from '@mui/material';


export default function BackroomsItem(props) {
  const DisplayTable = () => {
    const table = JSON.parse(props.table);
    const keys = Object.keys(table);
    return (
      <Table size='small'>
        <TableRow>
          {Object.keys(table[keys[0]]).map((key, index) => {
            return <TableCell key={index}>{key}</TableCell>
          })}
        </TableRow>
        {keys.map((index) => {
          return (
            <TableRow>
              {Object.keys(table[keys[index]]).map((k, index2) => {
                return <TableCell key={index2}>{table[keys[index]][k]}</TableCell>
              })}
            </TableRow>
          )
        })}
      </Table>
    )
  }

  return (
    <Card variant="outlined" sx={{width: {xs: '100%', md: '450px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '350px'}}>
      <Box sx={{ p: 2 }}>
        <Typography gutterBottom variant="h5" component="div" flex={1}>{props.name}</Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Chip label={'Item#: ' + props.itemNum} flex={1}/>
          {props.rarity === 'Artifact' ?
            <Chip label={props.rarity + ': ' + props.artifactPrice} flex={1}/>
          :
            <Chip label={props.rarity} flex={1}/>
          }
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2">{props.description}</Typography>
        </Stack>
      </Box>
      {props.table !== false && props.table !== true ?
        <>
          <Divider variant='dash'/>
          <DisplayTable />
        </>
      :
        ""
      }
    </Card>
  )
}


/*
const temp = {
  0:  {Color: "Turquoise Blue", Effect: "Heal 2d8 health and cure 1 stage of all diseases."},
  1:  {Color: "Amethyst Purple", Effect: "Deal 2d8 lightning damage."},
  2:  {Color: "Ruby Red", Effect: "Remove a level of exhaustion."},
  3:  {Color: "Onyx Black", Effect: "Deal 8d6 necrotic damage."},
  4:  {Color: "Navy Blue", Effect: "Slow movement speed by 10 ft. for 1 hour."},
  5:  {Color: "Quartz White", Effect: "Polymorph into a white blob. Make a DC 17 Consitution saving throw for the next 3 turns. On a pass, revert back. This is permanent if 3 saving throws are failed."}
}

console.log(JSON.stringify(temp));
*/

/* This is the Casino room shop for level 5.
{"0":{"Item":"Dice of Destiny","Price":"500"},"1":{"Item":"Portable God","Price":"3000"},"2":{"Item":"Backrooms TCG pack","Price":"13"},"3":{"Item":"Cashew Water","Price":"1"},"4":{"Item":"Antimatter Rifle","Price":"4,800"},"5":{"Item":"Royal Ration","Price":"1,036"},"6":{"Item":"Level Key","Price":"20,720"},"7":{"Item":"Potion of sanity stall","Price":"30"},"8":{"Item":"Dark Reparation vial","Price":"125"},"9":{"Item":"Questionably Stealthy Boots","Price":"50"},"10":{"Item":"Squirt gun","Price":"5"},"11":{"Item":"Capsule of Rixa Gas","Price":"70"},"12":{"Item":"Prayer Glass","Price":"12,054"},"13":{"Item":"Red Light White Light","Price":"2"},"14":{"Item":"2 Vials of Liquid Silence","Price":"7,020"},"15":{"Item":"20 ft. of rope","Price":"1"},"16":{"Item":"20 rations","Price":"100"},"17":{"Item":"10 non-energy ammo","Price":"10"},"18":{"Item":"10 energy ammo","Price":"50"},"19":{"Item":"Teleport to selected level","Price":"10 per level away from 5. Add 100 per 100 levels. Non-numbered levels are 500 flat."},"20":{"Item":"Speak with anybody within the Backrooms","Price":"Depends on the person"},"21":{"Item":"Become protected from any one entity","Price":"Depends on the entity"},"22":{"Item":"Create any anomalous item","Price":"Depends on the item"}}
*/