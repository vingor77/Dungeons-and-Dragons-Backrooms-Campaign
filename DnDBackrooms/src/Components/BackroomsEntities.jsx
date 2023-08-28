import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import React, { useState } from 'react'
import db from '../Components/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function BackroomsEntities(props) {
  const [creatures, setCreatures] = useState(null);

  const getCreatures = () => {
    const collectionRef = collection(db, 'statBlocks');
  
    const unsub = onSnapshot(collectionRef, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setCreatures(JSON.parse(doc.data().data));
      })
    })

    return () => unsub();
  }

  const StatBlock = () => {
    if(creatures ===  null) return;

    const entity = "Creatures." + props.name;
    let list = "";
    const statChart = (num) => {
      let bonus = Math.floor((num - 10)/2);
      if(bonus >= 0) return "+" + bonus;
      else return bonus;
    }

    return (
      <Box bgcolor='#fdf1dc' width='50%' padding={2} borderTop='5px solid orange' borderBottom='5px solid orange'>
        <Typography variant='h2'>{creatures[entity].Name}</Typography>
        <Typography variant='body1'><i>{creatures[entity].Type}</i></Typography>
        <br />
        <Divider  sx={{bgcolor: 'red'}}/>
        <br />
        <Typography variant='body1'><b>Armor Class</b> {creatures[entity].AC.Value} {creatures[entity].AC.Notes}</Typography>
        <Typography variant='body1'><b>Hit Points</b> {creatures[entity].HP.Value} {creatures[entity].HP.Notes}</Typography>
        {creatures[entity].Speed.map((speed) => {
          if(speed.includes("walk")) speed = speed.substring(5);
          if(list === "") list = speed;
          else list = list + ", " + speed;
        })}
        <Typography variant='body1'><b>Speed</b> {list}</Typography>
        <br />
        <Divider sx={{bgcolor: 'red'}}/>
        <br />
        <Stack spacing={6} direction='row' textAlign='center' justifyContent='center'>
          <Stack>
            <Typography variant='body1'>Str</Typography>
            <Typography variant='body1'>{creatures[entity].Abilities.Str} ({statChart(Number(creatures[entity].Abilities.Str))})</Typography>
          </Stack>
          <Stack>
            <Typography variant='body1'>Dex</Typography>
            <Typography variant='body1'>{creatures[entity].Abilities.Dex} ({statChart(Number(creatures[entity].Abilities.Dex))})</Typography>
          </Stack>
          <Stack>
            <Typography variant='body1'>Con</Typography>
            <Typography variant='body1'>{creatures[entity].Abilities.Con} ({statChart(Number(creatures[entity].Abilities.Con))})</Typography>
          </Stack>
          <Stack>
            <Typography variant='body1'>Int</Typography>
            <Typography variant='body1'>{creatures[entity].Abilities.Int} ({statChart(Number(creatures[entity].Abilities.Int))})</Typography>
          </Stack>
          <Stack>
            <Typography variant='body1'>Wis</Typography>
            <Typography variant='body1'>{creatures[entity].Abilities.Wis} ({statChart(Number(creatures[entity].Abilities.Wis))})</Typography>
          </Stack>
          <Stack>
            <Typography variant='body1'>Cha</Typography>
            <Typography variant='body1'>{creatures[entity].Abilities.Cha} ({statChart(Number(creatures[entity].Abilities.Cha))})</Typography>
          </Stack>
        </Stack>
        <br />
        <Divider  sx={{bgcolor: 'red'}}/>
        <br />
        {creatures[entity].Skills.length > 0 ?
          <>
            {list = ""}
            {creatures[entity].Skills.map((skill) => {
              if(list === "") list = skill.Name + " " + skill.Modifier;
              else list = list + ", " + skill.Name + " " + skill.Modifier;
            })}
            <Typography variant='body1'><b>Skills</b> {list}</Typography>
          </>
          :""
        }
        {creatures[entity].DamageResistances.length > 0 ?
          <>
            {list = ""}
            {creatures[entity].DamageResistances.map((dRes) => {
              if(list === "") list = dRes;
              else list = list + ", " + dRes;
            })}
            <Typography variant='body1'><b>Damage Resistances</b> {list}</Typography>
          </>
          :""
        }
        {creatures[entity].DamageImmunities.length > 0 ?
          <>
            {list = ""}
            {creatures[entity].DamageImmunities.map((dImm) => {
              if(list === "") list = dImm;
              else list = list + ", " + dImm;
            })}
            <Typography variant='body1'><b>Damage Immunities</b> {list}</Typography>
          </>
          :""
        }
        {creatures[entity].DamageVulnerabilities.length > 0 ?
          <>
            {list = ""}
            {creatures[entity].DamageVulnerabilities.map((dVuln) => {
              if(list === "") list = dVuln;
              else list = list + ", " + dVuln;
            })}
            <Typography variant='body1'><b>Damage Vulnerabilities</b> {list}</Typography>
          </>
          :""
        }
        {creatures[entity].ConditionImmunities.length > 0 ?
          <>
            {list = ""}
            {creatures[entity].ConditionImmunities.map((cImm) => {
              if(list === "") list = cImm;
              else list = list + ", " + cImm;
            })}
            <Typography variant='body1'><b>Condition Immunities</b> {list}</Typography>
          </>
          :""
        }
        {creatures[entity].Senses.length > 0 ?
          <>
            {list = ""}
            {creatures[entity].Senses.map((sense) => {
              if(list === "") list = sense;
              else list = list + ", " + sense;
            })}
            <Typography variant='body1'><b>Senses</b> {list}</Typography>
          </>
          :""
        }
        {creatures[entity].Languages[0] !== "" ?
          <>
            {list = ""}
            {creatures[entity].Languages.map((language) => {
              if(list === "") list = language;
              else list = list + ", " + language;
            })}
            <Typography variant='body1'><b>Languages</b> {list}</Typography>
          </>
          :<Typography variant='body1'><b>Languages</b> -</Typography>
        }
        <Typography variant='body1'><b>Challenge</b> {creatures[entity].Challenge}</Typography>
        {creatures[entity].Traits.length > 0 ?
          <>
            <br />
            <Typography variant='h6'>Traits</Typography>
            <Divider  sx={{bgcolor: 'red'}}/>
            <br />
            {creatures[entity].Traits.map((trait, index) => {
              return (
                <div key={index}>
                  <Typography variant='body1'><b>{trait.Name}.</b> {trait.Content}</Typography>
                  <br />
                </div>
              )
            })}
          </>
          :""
        }
        {creatures[entity].Actions.length > 0 ?
          <>
            <Typography variant='h6'>Actions</Typography>
            <Divider  sx={{bgcolor: 'red'}}/>
            <br />
            {creatures[entity].Actions.map((action, index) => {
              return (
                <div key={index}>
                  <Typography variant='body1'><b>{action.Name}.</b> {action.Content}</Typography>
                  <br />
                </div>
              )
            })}
          </>
          :""
        }
        {creatures[entity].LegendaryActions.length > 0 ?
          <>
            <Typography variant='h6'>Legendary Actions</Typography>
            <Divider  sx={{bgcolor: 'red'}}/>
            <br />
            {creatures[entity].LegendaryActions.map((action, index) => {
              return (
                <div key={index}>
                  <Typography variant='body1'><b>{action.Name}.</b> {action.Content}</Typography>
                  <br />
                </div>
              )
            })}
          </>
          :""
        }
        {creatures[entity].Reactions.length > 0 ?
          <>
            <Typography variant='h6'>Reactions</Typography>
            <Divider  sx={{bgcolor: 'red'}}/>
            <br />
            {creatures[entity].Reactions.map((action, index) => {
              return (
                <div key={index}>
                  <Typography variant='body1'><b>{action.Name}.</b> {action.Content}</Typography>
                  <br />
                </div>
              )
            })}
          </>
          :""
        }
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant='h5'>Spawn locations:</Typography>
        <ul>
          {props.locations.map((element, index) => {
            return (
              <li key={index}>{element}</li>
            );
          })}
        </ul>
        <Typography variant='h5'>Description:</Typography>
        <Typography variant='body1' sx={{textIndent: 25}}>{props.description}</Typography>
        {creatures === null ? getCreatures() : ""}
        {props.challengeRating !== 0 && creatures !== null ?
          <StatBlock />
          :
          <>
            <Typography variant='body1'>No stat block available</Typography>
          </>
        }
      </CardContent>
    </Card>
  )
}


/* Paste here. Once all are done, move it to database
{
  "Creatures.Smiler":{"Id":"Smiler","Name":"Smiler","Path":"","Link":"https://ebshimizu.github.io/5emm/","SearchHint":"Smiler\nhumanoid\n","FilterDimensions":{"Level":"1","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium humanoid, "},"LastUpdateMs":0,"Version":"1.0.0","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium humanoid, ","HP":{"Value":45,"Notes":"(10d8+0)"},"InitiativeModifier":0,"InitiativeAdvantage":false,"Speed":["walk 40 ft."],"AC":{"Value":13,"Notes":""},"Abilities":{"Str":10,"Dex":10,"Con":10,"Int":10,"Wis":10,"Cha":10},"Saves":[],"DamageVulnerabilities":[],"DamageResistances":[],"DamageImmunities":[],"ConditionImmunities":[],"Skills":[],"Senses":["passive Perception 10"],"Languages":[""],"Challenge":"1","Traits":[],"Actions":[{"Name":"Smile","Content":"The Smiler rushes towards a creature within 40 ft. The target must make a DC 13 Dexterity saving throw or take 70% maximum health psychic damage."}],"LegendaryActions":[],"Reactions":[],"Description":"","Player":"","ImageURL":""},
  "Creatures.Window":{"Id":"Window","Name":"Window","Path":"","Link":"https://ebshimizu.github.io/5emm/","SearchHint":"Window\nhumanoid\nAny evil alignment","FilterDimensions":{"Level":"1/4","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium humanoid, Any evil alignment"},"LastUpdateMs":0,"Version":"1.0.0","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium humanoid, Any evil alignment","HP":{"Value":45,"Notes":"(10d8+0)"},"InitiativeModifier":4,"InitiativeAdvantage":false,"Speed":["walk 0 ft."],"AC":{"Value":13,"Notes":""},"Abilities":{"Str":18,"Dex":18,"Con":10,"Int":10,"Wis":10,"Cha":10},"Saves":[],"DamageVulnerabilities":[],"DamageResistances":[],"DamageImmunities":[],"ConditionImmunities":["All"],"Skills":[{"Name":"Perception","Modifier":4}],"Senses":["passive Perception 14"],"Languages":[""],"Challenge":"1/4","Traits":[{"Name":"Whisper","Content":"The Window endlessly whispers loud enough to be heard up to 30 ft. away. A creature that hears it must make a DC 13 Wisdom saving throw or be charmed. While a creature is charmed by the Window, it must spend it's turn walking towards the Window. The creature may repeat this save at the end of each of its turns. Afterwards, that creature is immune to this effect for 24 hours. Creatures who are immune to charm are immune to this effect."}],"Actions":[{"Name":"Multiattack","Content":"Window makes , and undefined. "},{"Name":"Grapple","Content":"The Window grapples a creature within 5 ft."},{"Name":"Pull","Content":"The Window attempts to pull a grappled creature into the window frame. The target must make a DC 13 Dexterity or Strength saving throw or be pulled into the window frame and take 5 psychic damage, lose 5 sanity, and get thrown back out to the nearest spot within 10 ft."}],"LegendaryActions":[],"Reactions":[],"Description":"","Player":"","ImageURL":""},
  "Creatures":["Clump"],"Creatures.Clump":{"Id":"Clump","Name":"Clump","Path":"","Link":"https://ebshimizu.github.io/5emm/","SearchHint":"Clump\nmonstrosity\nunaligned","FilterDimensions":{"Level":"1/2","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Small monstrosity, unaligned"},"LastUpdateMs":0,"Version":"1.0.0","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Small monstrosity, unaligned","HP":{"Value":58,"Notes":"(9d6+27)"},"InitiativeModifier":5,"InitiativeAdvantage":false,"Speed":["walk 60 ft."],"AC":{"Value":13,"Notes":""},"Abilities":{"Str":4,"Dex":20,"Con":16,"Int":4,"Wis":8,"Cha":9},"Saves":[{"Name":"Str","Modifier":-1}],"DamageVulnerabilities":["bludgeoning"],"DamageResistances":["acid"],"DamageImmunities":["bludgeoning"],"ConditionImmunities":["blinded","deafened","charmed","frightened"],"Skills":[{"Name":"Arcana","Modifier":-3}],"Senses":["tremorsense 10 ft.","passive Perception 9"],"Languages":["a"," b"," c"," d"," e"],"Challenge":"1/2","Traits":[{"Name":"Blind and Deaf","Content":"The Clump is blind and deaf."}],"Actions":[{"Name":"Multiattack","Content":"Clump makes , and undefined. "},{"Name":"Bite","Content":"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 7 (2d6) piercing damage. "},{"Name":"New Action","Content":""},{"Name":"Class Spellcasting","Content":"Spellcasting. Clump is a 1st-level spellcaster. Its spellcasting ability is Charisma (spell save DC 9, +1 to hit with spell attacks).  Clump has the following Bard spells prepared:\n• "}],"LegendaryActions":[{"Name":"Bite","Content":"Clump makes a Bite attack."}],"Reactions":[{"Name":"Lunge","Content":"Whenever a creature comes within 10 ft. of the Clump, it lunges onto the target and makes a Bite attack."}],"Description":"","Player":"","ImageURL":""}
}
*/