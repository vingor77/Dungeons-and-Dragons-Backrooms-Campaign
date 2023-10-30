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

    //Add other problem entities here.
    
    let entity = "";
    if(props.name.includes("Deathmoth")) {
      entity = "Creatures.Deathmoth";
    }
    else if(props.name.includes("Shadow")) {
      entity = "Creatures.Shadow-Faceling";
    }
    else if(props.name.includes("Memory")) {
      entity = "Creatures.Memory-Faceling";
    }
    else if(props.name.includes("Pink")) {
      entity = "Creatures.Pink-Faceling";
    }
    else {
      entity = "Creatures." + props.name;
    }

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
        {creatures === null ? getCreatures() : ""}
        {props.challengeRating !== 0 && creatures !== null ?
          <>
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
            <StatBlock />
          </>
        :
          <>
            <Typography variant='h2'>{props.name}</Typography>
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
  "Creatures.Clump":{"Id":"Clump","Name":"Clump","Path":"","Link":"https://ebshimizu.github.io/5emm/","SearchHint":"Clump\nmonstrosity\nunaligned","FilterDimensions":{"Level":"1/2","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Small monstrosity, unaligned"},"LastUpdateMs":0,"Version":"1.0.0","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Small monstrosity, unaligned","HP":{"Value":58,"Notes":"(9d6+27)"},"InitiativeModifier":5,"InitiativeAdvantage":false,"Speed":["walk 40 ft."],"AC":{"Value":13,"Notes":""},"Abilities":{"Str":4,"Dex":20,"Con":16,"Int":4,"Wis":8,"Cha":9},"Saves":[],"DamageVulnerabilities":[],"DamageResistances":[],"DamageImmunities":[],"ConditionImmunities":["blinded","deafened","charmed","frightened"],"Skills":[],"Senses":["tremorsense 10 ft.","passive Perception 9"],"Languages":[""],"Challenge":"1/2","Traits":[{"Name":"Blind and Deaf","Content":"The Clump is blind and deaf."}],"Actions":[{"Name":"Bite","Content":"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 7 (2d6) piercing damage. "}],"LegendaryActions":[],"Reactions":[{"Name":"Lunge","Content":"Whenever a target comes within 10 ft. of the Clump, it lunges onto the target making a bite attack."}],"Description":"","Player":"","ImageURL":""},
  "Creatures.Deathmoth":{"Id":"Deathmoth","Name":"Deathmoth","Path":"","Link":"https://ebshimizu.github.io/5emm/","SearchHint":"Deathmoth\nmonstrosity\nunaligned","FilterDimensions":{"Level":"5","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium monstrosity, unaligned"},"LastUpdateMs":0,"Version":"1.0.0","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium monstrosity, unaligned","HP":{"Value":144,"Notes":"(32d8+0)"},"InitiativeModifier":3,"InitiativeAdvantage":false,"Speed":["fly 60 ft."],"AC":{"Value":15,"Notes":"Natural armor"},"Abilities":{"Str":8,"Dex":17,"Con":10,"Int":14,"Wis":14,"Cha":12},"Saves":[],"DamageVulnerabilities":[],"DamageResistances":[],"DamageImmunities":[],"ConditionImmunities":[],"Skills":[{"Name":"Perception","Modifier":5}],"Senses":["passive Perception 15"],"Languages":[""],"Challenge":"5","Traits":[],"Actions":[{"Name":"Multiattack","Content":"Deathmoth makes two Spit attacks. "},{"Name":"Cut","Content":"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 36 (6d10+3) slashing damage. "},{"Name":"Spit","Content":"Ranged Weapon Attack: +6 to hit, range 10/30 ft., one target. Hit: 18 (3d10+2) acid damage. "}],"LegendaryActions":[],"Reactions":[],"Description":"","Player":"","ImageURL":""},
  "Creatures.Duller":{"Id":"Duller","Name":"Duller","Path":"","Link":"https://ebshimizu.github.io/5emm/","SearchHint":"Duller\nhumanoid\nneutral evil","FilterDimensions":{"Level":"10","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium humanoid, neutral evil"},"LastUpdateMs":0,"Version":"1.0.0","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium humanoid, neutral evil","HP":{"Value":214,"Notes":"(33d8+66)"},"InitiativeModifier":4,"InitiativeAdvantage":false,"Speed":["walk 30 ft."],"AC":{"Value":17,"Notes":""},"Abilities":{"Str":22,"Dex":18,"Con":15,"Int":13,"Wis":15,"Cha":10},"Saves":[],"DamageVulnerabilities":["Almond Water"],"DamageResistances":[],"DamageImmunities":[],"ConditionImmunities":["charmed"],"Skills":[{"Name":"Perception","Modifier":6}],"Senses":["passive Perception 16"],"Languages":[""],"Challenge":"10","Traits":[{"Name":"X-ray Vision","Content":"The Duller can see any living beings through walls."},{"Name":"No-Clip","Content":"The Duller may phase freely through any walls."},{"Name":"Scared","Content":"The Duller is afraid of being directly observed."}],"Actions":[{"Name":"Grapple","Content":"The Duller phases into a wall and attempts to grab a target. The target must succeed on a DC 16 Dexterity or Strength saving throw or be grappled and pulled 1 foot into the wall and begin suffocating."}],"LegendaryActions":[],"Reactions":[{"Name":"Run","Content":"The Duller may move up to it's movement speed upon being directly observed."}],"Description":"","Player":"","ImageURL":""},
  "Creatures.Hound":{"Id":"Hound","Name":"Hound","Path":"","Link":"https://ebshimizu.github.io/5emm/","SearchHint":"Hound\nbeast\nunaligned","FilterDimensions":{"Level":"1","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium beast, unaligned"},"LastUpdateMs":0,"Version":"1.0.0","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium beast, unaligned","HP":{"Value":82,"Notes":"(11d8+33)"},"InitiativeModifier":2,"InitiativeAdvantage":false,"Speed":["walk 30 ft."],"AC":{"Value":13,"Notes":""},"Abilities":{"Str":12,"Dex":14,"Con":16,"Int":7,"Wis":13,"Cha":10},"Saves":[],"DamageVulnerabilities":[],"DamageResistances":[],"DamageImmunities":[],"ConditionImmunities":[],"Skills":[],"Senses":["passive Perception 11"],"Languages":[""],"Challenge":"1","Traits":[{"Name":"Charge","Content":"If the Hound moves at least 10 ft. straight toward a target and then hits it with a bite attack on the same turn, the target takes an extra 4 (1d8) bludgeoning damage. If the target is a creature, it must succeed on a DC 13 strength saving throw or be knocked prone."},{"Name":"Afraid","Content":"The Hound is afraid of eye contact, loud noises, and bright lights. Upon one of these conditions being fulfilled, the Hound becomes feared of the source."}],"Actions":[{"Name":"Bite","Content":"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 8 (1d8+4) piercing damage. "},{"Name":"Claw","Content":"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) slashing damage. "}],"LegendaryActions":[],"Reactions":[],"Description":"","Player":"","ImageURL":""},
  "Creatures.Skin-Stealer":{"Id":"Skin-Stealer","Name":"Skin Stealer","Path":"","Link":"https://ebshimizu.github.io/5emm/","SearchHint":"Skin Stealer\naberration\nchaotic neutral","FilterDimensions":{"Level":"3","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium aberration, chaotic neutral"},"LastUpdateMs":0,"Version":"1.0.0","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium aberration, chaotic neutral","HP":{"Value":105,"Notes":"(14d8+42)"},"InitiativeModifier":-1,"InitiativeAdvantage":false,"Speed":["walk 30 ft."],"AC":{"Value":13,"Notes":""},"Abilities":{"Str":18,"Dex":8,"Con":16,"Int":13,"Wis":8,"Cha":8},"Saves":[],"DamageVulnerabilities":[],"DamageResistances":[],"DamageImmunities":[],"ConditionImmunities":[],"Skills":[{"Name":"Perception","Modifier":1}],"Senses":["passive Perception 11"],"Languages":[""],"Challenge":"3","Traits":[{"Name":"Clear Blood","Content":"The Skin Stealer has blood that is clear, rather than red. Whenever a Skin Stealer is cut or the skin is otherwise broken open, the blood shoots out around it, burning anything it touches. Whenever a creature hits the Skin Stealer with an attack that does slashing or piercing damage, creatures within 5 ft. take 3 (1d6) fire damage."},{"Name":"Shapeshift","Content":"The Skin Stealer may take on the look, mannerisms, and speech of a person by wearing the skin of a corpse."}],"Actions":[{"Name":"Multiattack","Content":"Skin Stealer makes two Punch attacks. "},{"Name":"Punch","Content":"Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) bludgeoning damage. "}],"LegendaryActions":[],"Reactions":[],"Description":"","Player":"","ImageURL":""},
  "Creatures.Shadow-Faceling":{"Id":"Shadow-Faceling","Name":"Shadow Faceling","Path":"","Link":"https://ebshimizu.github.io/5emm/","SearchHint":"Shadow Faceling\nhumanoid\nunaligned","FilterDimensions":{"Level":"2","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium humanoid, unaligned"},"LastUpdateMs":0,"Version":"1.0.0","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium humanoid, unaligned","HP":{"Value":22,"Notes":"(4d8+4)"},"InitiativeModifier":1,"InitiativeAdvantage":false,"Speed":["walk 30 ft."],"AC":{"Value":13,"Notes":""},"Abilities":{"Str":6,"Dex":12,"Con":12,"Int":12,"Wis":5,"Cha":14},"Saves":[],"DamageVulnerabilities":[],"DamageResistances":["acid","fire","thunder","non-magical bludgeoning, piercing, and slashing"],"DamageImmunities":["cold","necrotic","poison"],"ConditionImmunities":["charmed","exhaustion","frightened","grappled","paralyzed","petrified","poisoned","prone","restrained"],"Skills":[{"Name":"Stealth","Modifier":3}],"Senses":["passive Perception 7"],"Languages":[""],"Challenge":"2","Traits":[{"Name":"Easily Distracted","Content":"Whenever a light source is presented to the Shadow Faceling, it will face the light. Any attacks against the Shadow Faceling during this is at advantage."}],"Actions":[{"Name":"Multiattack","Content":"Shadow Faceling makes two Scratch attacks. "},{"Name":"Scratch","Content":"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 8 (1d10+3) psychic damage. "}],"LegendaryActions":[],"Reactions":[],"Description":"","Player":"","ImageURL":""},
  "Creatures.Memory-Faceling":{"Id":"Memory-Faceling","Name":"Memory Faceling","Path":"","Link":"https://ebshimizu.github.io/5emm/","SearchHint":"Memory Faceling\nhumanoid\nunaligned","FilterDimensions":{"Level":"5","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium humanoid, unaligned"},"LastUpdateMs":0,"Version":"1.0.0","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium humanoid, unaligned","HP":{"Value":144,"Notes":"(32d8+0)"},"InitiativeModifier":0,"InitiativeAdvantage":false,"Speed":["walk 30 ft."],"AC":{"Value":15,"Notes":""},"Abilities":{"Str":17,"Dex":10,"Con":10,"Int":18,"Wis":9,"Cha":16},"Saves":[],"DamageVulnerabilities":[],"DamageResistances":[],"DamageImmunities":["Almond Water"],"ConditionImmunities":[],"Skills":[{"Name":"Performance","Modifier":9},{"Name":"Deception","Modifier":9}],"Senses":["passive Perception 9"],"Languages":["All"],"Challenge":"5","Traits":[{"Name":"Shapeshift","Content":"The Memory Faceling takes on the appearance and mannerisms of a loved one. Upon seeing the Memory Faceling, the target must succeed on a DC 15 Wisdom saving throw or be charmed. While charmed, the target is harmless to the Memory Faceling and loses 2 sanity at the end of each of it's turns. You are immune to this effect for 24 hours afterwards."}],"Actions":[{"Name":"Scream","Content":"Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 28 (4d10+6) bludgeoning damage plus 7 (2d6) psychic damage. The target must make a DC 15 Wisdom Saving Throw or lose 1 sanity."}],"LegendaryActions":[],"Reactions":[],"Description":"","Player":"","ImageURL":""},
  "Creatures.Pink-Faceling":{"Id":"Pink-Faceling","Name":"Pink Faceling","Path":"","Link":"https://ebshimizu.github.io/5emm/","SearchHint":"Pink Faceling\nhumanoid\n","FilterDimensions":{"Level":"12","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium humanoid, "},"LastUpdateMs":0,"Version":"1.0.0","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium humanoid, ","HP":{"Value":247,"Notes":"(38d8+76)"},"InitiativeModifier":0,"InitiativeAdvantage":false,"Speed":["walk 30 ft."],"AC":{"Value":17,"Notes":""},"Abilities":{"Str":8,"Dex":10,"Con":14,"Int":20,"Wis":12,"Cha":10},"Saves":[{"Name":"Int","Modifier":9}],"DamageVulnerabilities":[],"DamageResistances":[],"DamageImmunities":[],"ConditionImmunities":[],"Skills":[],"Senses":["passive Perception 11"],"Languages":[""],"Challenge":"12","Traits":[],"Actions":[{"Name":"Class Spellcasting","Content":"Spellcasting. Pink Faceling is a 15th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 17, +9 to hit with spell attacks).  Pink Faceling has the following Wizard spells prepared:\n Cantrips (at will) Eldritch Blast \n 1st level (4 slots):  Charm Person\n 2nd level (3 slots):  Darkness, Invisibility\n 4th level (3 slots):  Hallucinatory Terrain\n 6th level (1 slot):  Circle of Death, Disintegrate\n 8th level (1 slot):  Feeblemind"}],"LegendaryActions":[],"Reactions":[],"Description":"","Player":"","ImageURL":""},
  "Creatures.Burster":{"Id":"Burster","Name":"Burster","Path":"","Link":"https://ebshimizu.github.io/5emm/","SearchHint":"Burster\nhumanoid\nunaligned","FilterDimensions":{"Level":"5","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium humanoid, unaligned"},"LastUpdateMs":0,"Version":"1.0.0","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium humanoid, unaligned","HP":{"Value":143,"Notes":"(22d8+44)"},"InitiativeModifier":-2,"InitiativeAdvantage":false,"Speed":["walk 30 ft."],"AC":{"Value":15,"Notes":""},"Abilities":{"Str":6,"Dex":7,"Con":14,"Int":12,"Wis":20,"Cha":10},"Saves":[],"DamageVulnerabilities":[],"DamageResistances":[],"DamageImmunities":["acid","poison"],"ConditionImmunities":["blinded"],"Skills":[{"Name":"Perception","Modifier":8}],"Senses":["truesight 30 ft.","passive Perception 18"],"Languages":[""],"Challenge":"5","Traits":[],"Actions":[{"Name":"Multiattack","Content":"Burster makes two Poison Spray attacks. "},{"Name":"Poison Spray","Content":"Ranged Weapon Attack: +6 to hit, range 10/30 ft., one target. Hit: 18 (3d8+5) poison damage. The target must make a DC 15 Constitution saving throw or be poisoned for 1 minute."},{"Name":"Acid Spray (Recharge 5-6)","Content":"The spores on the Burster explode outwards shooting acid in a 30 ft. cone. Any creature within the radius must make a DC 15 Dexterity Saving throw or be coated in acid, taking 18 (4d8) acid damage and becoming blinded for 1 minute."}],"LegendaryActions":[],"Reactions":[{"Name":"Spray","Content":"Whenever a creature comes within 30 ft. of the Burster, it will use either the poison or acid spray action."}],"Description":"","Player":"","ImageURL":""},
  "Creatures.Reviook":{"Id":"Reviook","Name":"Reviook","Path":"","Link":"https://ebshimizu.github.io/5emm/","SearchHint":"Reviook\nmonstrosity\nunaligned","FilterDimensions":{"Level":"2","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Large monstrosity, unaligned"},"LastUpdateMs":0,"Version":"1.0.0","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Large monstrosity, unaligned","HP":{"Value":93,"Notes":"(11d10+33)"},"InitiativeModifier":0,"InitiativeAdvantage":false,"Speed":["burrow 30 ft.","walk 30 ft."],"AC":{"Value":13,"Notes":""},"Abilities":{"Str":22,"Dex":10,"Con":16,"Int":7,"Wis":5,"Cha":6},"Saves":[],"DamageVulnerabilities":[],"DamageResistances":[],"DamageImmunities":[],"ConditionImmunities":[],"Skills":[],"Senses":["tremorsense 30 ft.","passive Perception 7"],"Languages":[""],"Challenge":"2","Traits":[],"Actions":[{"Name":"Multiattack","Content":"Reviook makes two Punch attacks. "},{"Name":"Punch","Content":"Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 13 (2d6+6) bludgeoning damage. "},{"Name":"Burrow","Content":"The Reviook burrows into the ground up to it's movement speed."},{"Name":"Burst","Content":"The Reviook breaks open a 15 ft. radius and 30 ft. deep circle centered on itself in the floor. Any creature within the range must succeed on a DC 13 Dexterity saving throw or fall into the hole, taking 10 (3d6) bludgeoning damage. The Reviook also makes a punch attack against any creatures who failed."}],"LegendaryActions":[],"Reactions":[],"Description":"","Player":"","ImageURL":""},
  "Creatures.Wretch":{"Id":"Wretch","Name":"Wretch","Path":"","Link":"https://ebshimizu.github.io/5emm/","SearchHint":"Wretch\nhumanoid\n","FilterDimensions":{"Level":"8","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium humanoid, "},"LastUpdateMs":0,"Version":"1.0.0","Source":"Homebrew (Falindrith's Monster Maker)","Type":"Medium humanoid, ","HP":{"Value":93,"Notes":"(11d8+44)"},"InitiativeModifier":-1,"InitiativeAdvantage":false,"Speed":["walk 30 ft."],"AC":{"Value":16,"Notes":""},"Abilities":{"Str":20,"Dex":8,"Con":18,"Int":4,"Wis":5,"Cha":10},"Saves":[],"DamageVulnerabilities":[],"DamageResistances":[],"DamageImmunities":["poison","acid"],"ConditionImmunities":["poisoned","exhaustion","frightened","diseased"],"Skills":[],"Senses":["passive Perception 7"],"Languages":[""],"Challenge":"8","Traits":[{"Name":"Infect","Content":"The Wretch infects any living thing it touches. Whenever a creature is hit by an attack other than the crowbar, it must succeed on a DC 13 Constitution saving throw or progress 1 stage of the Wretched Cycle."},{"Name":"Wretched Cycle","Content":"The Wretch is an infected being that spreads it's infection easily. The Cycle is a 3 stage disease. At stage 1, the infected becomes itchy and uncomfortable. At stage 2, the infected begins to lose skin, hair, nails, etc. and becomes unable to speak. During stage 2, the infected loses 10 health per minute and cannot be healed. Almond Water consumption will pause the effect for 1 minute unless it is Green Almond Water. At stage 3, the infected lose entire nails and teeth or they shift to unnatural positions, the skin around the eyes dissolve to never allow blinking again. Once in this stage, only Green Almond Water may reverse the effect, to a certain degree. The malformations revert but the infected's maximum health is reduced by 10 permanently."},{"Name":"Weapons","Content":"Wretches are capable of wielding weapons, most notably crowbars."}],"Actions":[{"Name":"Multiattack","Content":"Wretch makes two Crowbar attacks or makes one Crowbar attack, and one Whip attack or makes two Whip attacks. "},{"Name":"Crowbar","Content":"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 27 (4d10+5) bludgeoning damage. "},{"Name":"Whip","Content":"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 27 (4d10+5) slashing damage. "},{"Name":"Bite","Content":"Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 41 (8d8+5) piercing damage plus 11 (2d10) poison damage. "}],"LegendaryActions":[],"Reactions":[],"Description":"","Player":"","ImageURL":""}
}
*/