import React, { useState } from 'react'
import { AppBar, Stack, Toolbar, Link, Container, Menu, Button, MenuItem, Box } from '@mui/material';

export default function Navbar() {
  const [open, setOpen] = useState(null);
  const [open2, setOpen2] = useState(null);
  const [open3, setOpen3] = useState(null);

  return (
    <Box paddingLeft={5} paddingRight={5}>
      <AppBar position='sticky'>
        <Toolbar>
          <Stack direction='row' spacing={2} sx={{color: 'white'}}>
            <Button href='/' color='inherit' underline='none'>Home</Button>

            <div className='general'>
              <Button
                id="basic-link"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={(event) => setOpen(event.currentTarget)}
                color='inherit'
              >
                General information
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={open}
                open={open}
                onClose={() => setOpen(false)}
                MenuListProps={{
                  'aria-labelledby': 'basic-link',
                }}
              >
                <MenuItem><Link href='/items' color='inherit' underline='none'>Items</Link></MenuItem>
                <MenuItem><Link href='/crafts' color='inherit' underline='none'>Crafts</Link></MenuItem>
                <MenuItem><Link href='/gearSets' color='inherit' underline='none'>Gear Sets</Link></MenuItem>
                <MenuItem><Link href='/groups' color='inherit' underline='none'>Groups</Link></MenuItem>
                <MenuItem><Link href='/quests' color='inherit' underline='none'>Quests</Link></MenuItem>
                <MenuItem><Link href='/gods' color='inherit' underline='none'>Gods</Link></MenuItem>
                <MenuItem><Link href='/avatars' color='inherit' underline='none'>Avatars</Link></MenuItem>
              </Menu>
            </div>

            <div className='player'>
              <Button
                id="basic-link"
                aria-controls={open2 ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open2 ? 'true' : undefined}
                onClick={(event) => setOpen2(event.currentTarget)}
                color='inherit'
              >
                Player information
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={open2}
                open={open2}
                onClose={() => setOpen2(false)}
                MenuListProps={{
                  'aria-labelledby': 'basic-link',
                }}
              >
                <MenuItem><Link href='/info' color='inherit' underline='none'>Player Info</Link></MenuItem>
                <MenuItem><Link href='/functions' color='inherit' underline='none'>Player Functions</Link></MenuItem>
              </Menu>
            </div>

            <div className='dm'>
              <Button
                id="basic-link"
                aria-controls={open3 ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open3 ? 'true' : undefined}
                onClick={(event) => setOpen3(event.currentTarget)}
                color='inherit'
              >
                DM information
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={open3}
                open={open3}
                onClose={() => setOpen3(false)}
                MenuListProps={{
                  'aria-labelledby': 'basic-link',
                }}
              >
                <MenuItem><Link href='/outposts' color='inherit' underline='none'>Outposts</Link></MenuItem>
                <MenuItem><Link href='/entities' color='inherit' underline='none'>Entities</Link></MenuItem>
                <MenuItem><Link href='/levels' color='inherit' underline='none'>Levels</Link></MenuItem>
              </Menu>
            </div>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  )
}