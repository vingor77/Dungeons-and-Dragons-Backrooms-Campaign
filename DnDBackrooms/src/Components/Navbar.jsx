import React, { useState } from 'react'
import { AppBar, Stack, Toolbar, Link, Menu, Button, MenuItem, Box, IconButton, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
  const [open, setOpen] = useState(null);
  const [open2, setOpen2] = useState(null);
  const [open3, setOpen3] = useState(null);
  const [openSmall, setOpenSmall] = useState(null);

  return (
    <Box paddingLeft={5} paddingRight={5}>
      <AppBar position='sticky'>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={(e) => {setOpenSmall(e.currentTarget)}}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={openSmall}
              open={openSmall}
              onClose={() => setOpenSmall(null)}
              MenuListProps={{
                'aria-labelledby': 'basic-link',
              }}
            >
              <Stack>
                <Button href='/' color='inherit' underline='none'>Home</Button>
                <Button onClick={(event) => setOpen(event.currentTarget)} color='inherit'>General information</Button>
                <Button onClick={(event) => setOpen2(event.currentTarget)} color='inherit'>Player information</Button>
                <Button onClick={(event) => setOpen3(event.currentTarget)} color='inherit'>DM information</Button>
              </Stack>
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button href='/' color='inherit' underline='none'>Home</Button>
            <Box>
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
                <Stack divider={<Divider />}>
                  <Button href='/items' color='inherit' underline='none' size='small'>Items</Button>
                  <Button href='/crafts' color='inherit' underline='none' size='small'>Crafts</Button>
                  <Button href='/gearSets' color='inherit' underline='none' size='small'>Gear Sets</Button>
                  <Button href='/groups' color='inherit' underline='none' size='small'>Groups</Button>
                  <Button href='/quests' color='inherit' underline='none' size='small'>Quests</Button>
                  <Button href='/gods' color='inherit' underline='none' size='small'>Gods</Button>
                  <Button href='/avatars' color='inherit' underline='none' size='small'>Avatars</Button>
                </Stack>
              </Menu>
            </Box>
            <Box>
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
                <Stack divider={<Divider />}>
                  <Button href='/info' color='inherit' underline='none' size='small'>Player Info</Button>
                  <Button href='/functions' color='inherit' underline='none' size='small'>Player Functions</Button>
                </Stack>
              </Menu>
            </Box>
            <Box>
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
                <Stack divider={<Divider />}>
                  <Button href='/outposts' color='inherit' underline='none' size='small'>Outposts</Button>
                  <Button href='/entities' color='inherit' underline='none' size='small'>Entities</Button>
                  <Button href='/levels' color='inherit' underline='none' size='small'>Levels</Button>
                  <Button href='/edits' color='inherit' underline='none' size='small'>Updates</Button>
                </Stack>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}