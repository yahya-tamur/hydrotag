import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../app';
import {
  Chip,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  ListItem,
  ListItemButton,
  ListItemText,
  List,
} from '@mui/material';
import UserProfile from './UserProfile';

const db = getFirestore(app);

export default function Leadership() {
  const [users, setUsers] = useState([]);
  const [profileUser, setProfileUser] = useState(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUsersData = async () => {
      const q = await getDocs(collection(db, 'users'));
      const usersArray = q.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersArray);
    };
    fetchUsersData();
  }, []);

  return (
    <div>
      <h2>Top Marker Placement:</h2>
      <List sx={{ width: '400px', marginTop: '-17px'}}>
        {users
          .filter(user => user.markers ?? 0 !== 0)
          .sort((a, b) => b.markers - a.markers)
          .map((user, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${index + 1}.`} sx={{ width: '20px' }} />
              <ListItemText primary={user.name} sx={{ width: '200px' }} />
              <ListItemButton
                sx={{ width: '85px', mr: '-30px' }}
                onClick={() => {
                  setProfileUser(user);
                  setDialogOpen(true);
                }}
                style={{ color: '#209cee' }}
              >
                Profile
              </ListItemButton>
              {/*user.markers > 0 && <Badge badgeContent={user.markers} color="primary"> Markers</Badge>*/}
              <Chip label={user.markers} color="primary" variant="outlined" sx={{ ml: '50px', width: '50px' }} />
              {/*user.followers > 0 && <Badge badgeContent={user.followers} color="secondary">Connections</Badge>*/}
            </ListItem>
          ))}
      </List>

      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
      >
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
          {/* Here you should render the user profile information */}
          <DialogContentText>
            <UserProfile user={profileUser} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
