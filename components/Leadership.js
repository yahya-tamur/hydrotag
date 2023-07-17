import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { app } from '../app';
import ListItem from '@mui/material/ListItem';
import Badge from '@mui/material/Badge';

const db = getFirestore(app);

export default function Leadership() {
  const [users, setUsers] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchUsersData = async () => {
      const q = await getDocs(collection(db, "users"));
      const usersArray = q.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersArray);
    };
    fetchUsersData();
  }, []);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      let data = [];
      for (let user of users) {
        const markersSnap = await getDocs(query(collection(db, "markers"), where('poster', '==', user.id)));
        const markersCount = markersSnap.size;

        const connectionsSnap = await getDocs(query(collection(db, "connections"), where('userId', '==', user.id)));
        const connectionsCount = connectionsSnap.size;

        data.push({
          userId: user.id,
          email: user.email,
          markersCount,
          connectionsCount
        });
      }
      data.sort((a, b) => b.markersCount - a.markersCount);
      setLeaderboardData(data);
    };
    fetchLeaderboardData();
  }, [users]);

  return (
    <div>
      <h2>Leaderboard:</h2>
      {leaderboardData.map((user, index) => (
        <ListItem key={index}>
          {`${index + 1}. ${user.email}`}
          {user.markersCount > 0 && <Badge badgeContent={user.markersCount} color="primary"> Markers</Badge>}
          {user.connectionsCount > 0 && <Badge badgeContent={user.connectionsCount} color="secondary">Connections</Badge>}
        </ListItem>
      ))}
    </div>
  );
}

