import { getAuth } from "firebase/auth";
import { useRouter } from 'next/router';
import Map from '../components/Map';
import Users from '../components/Users';
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import LogoutIcon from '@mui/icons-material/Logout';
import Leadership from '../components/Leadership';
import Profile from '../components/Profile';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';

import { app } from '../app';
const auth = getAuth(app);
const drawerWidth = 240;


export default function Home() {
  const [selected, setSelected] = React.useState("Map");

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, bgcolor: '#209cee'}}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {selected}
          </Typography>   
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, ml: `${drawerWidth}px` }}
      >
        <Toolbar />
        {(() => {switch (selected) {
          case 'Map': return (<Map />);
          case 'Add Users': return (<Users />);
          case 'Leadership Board': return (<Leadership />);
          case 'Profile': return (<Profile />);
          default: return (
            <Typography paragraph>
              not implemented yet!
            </Typography>
          );
        } })()}
      </Box>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {[
            ["Map", <TravelExploreIcon />],
            ["Add Users", <Diversity1Icon />],
            ["Leadership Board", <StarIcon />],
            ["Profile", <PersonIcon />],
          ].map((tuple, index) => (
          <ListItem key={tuple[0]} disablePadding>
          <ListItemButton onClick={() => setSelected(tuple[0])}>
            <ListItemIcon>
              {tuple[1]}
            </ListItemIcon>
            <ListItemText primary={tuple[0]} />
          </ListItemButton>
        </ListItem>
          ))
        }
        </List>
        <Divider />
        <List>
          <ListItem key={"logout"} disablePadding>
            <ListItemButton onClick={() => auth.signOut()}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Log Out" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
