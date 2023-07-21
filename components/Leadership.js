import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { app } from '../app';
import ListItem from '@mui/material/ListItem';
import Badge from '@mui/material/Badge';

const db = getFirestore(app);

export default function Leadership() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersData = async () => {
      const q = await getDocs(collection(db, "users"));
      const usersArray = q.docs.map((doc) => ({
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
      <h2>Leader board:</h2>
      {users.filter(user => user.markers ?? 0 !== 0).sort((a, b) => b.markers - a.markers).map((user, index) => (
        <ListItem key={index}>
          {`${index + 1}. ${user.email}`}
          {user.markers > 0 && <Badge badgeContent={user.markers} color="primary"> Markers</Badge>}
          {user.followers > 0 && <Badge badgeContent={user.followers} color="secondary">Connections</Badge>}
        </ListItem>
      ))}
    </div>
  );
}

