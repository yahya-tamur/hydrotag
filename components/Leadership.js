import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../app';
import ListItem from '@mui/material/ListItem';
import { Chip, Button, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
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
      console.log(users);
      setUsers(usersArray);
    };
    fetchUsersData();
  }, []);

  return (
    <div>
      <h2>Top Marker Placement:</h2>
      {users
        .filter(user => user.markers ?? 0 !== 0)
        .sort((a, b) => b.markers - a.markers)
        .map((user, index) => (
          <ListItem key={index}>
            {`${index + 1}. ${user.email}`}
            <Button
              onClick={() => {
                setProfileUser(user);
                setDialogOpen(true);
              }}
              style={{ color: '#209cee' }}
            >
              Profile
            </Button>
            {/*user.markers > 0 && <Badge badgeContent={user.markers} color="primary"> Markers</Badge>*/}
            <Chip label={user.markers} color="primary" variant="outlined" sx={{ ml: '20px' }} />
            {/*user.followers > 0 && <Badge badgeContent={user.followers} color="secondary">Connections</Badge>*/}
          </ListItem>
        ))}

      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
      >
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
          {/* Here you should render the user profile information */}
          <UserProfile user={profileUser} />
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
