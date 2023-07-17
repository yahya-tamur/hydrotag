import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, where, query } from 'firebase/firestore';
import { app } from '../app';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import StarIcon from '@mui/icons-material/Star';
import ListItem from '@mui/material/ListItem';

const auth = getAuth(app);
const db = getFirestore(app);

export default function Users() {

  const [emailtext, setEmailText] = React.useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [followers, setFollowers] = useState([]);

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
    const filterUsers = () => {
      const filteredResults = users.filter((user) =>
        user.email.toLowerCase().includes(emailtext.toLowerCase())
      );
      setFilteredUsers(filteredResults);
    };
    filterUsers();
  }, [users, emailtext]);

  useEffect(() => {
    const fetchFollowings = async () => {
      const q = await getDocs(query(collection(db, "connections"), where('follower', '==', auth.currentUser.uid)));
      const followingArray = q.docs.map((doc) => ({id: doc.id, ...doc.data()}));
      setFollowings(followingArray);
    };
    const fetchFollowers = async () => {
      const q = await getDocs(query(collection(db, "connections"), where('following', '==', auth.currentUser.uid)));
      const followersArray = q.docs.map((doc) => doc.data().follower);
      setFollowers(followersArray);
    };
    if (auth.currentUser) {
      fetchFollowings();
      fetchFollowers();
    }
  }, []);

  const handleFollow = async (userId) => {
    const time = serverTimestamp();
    await addDoc(collection(db, "connections"), {
      follower: auth.currentUser.uid,
      following: userId,
      timestamp: time
    });
    alert("Now following " + userId + " since " + time);
    fetchFollowings();
  };

  const handleUnfollow = async (connectionId) => {
    await deleteDoc(doc(db, "connections", connectionId));
    alert("Unfollowed successfully");
    fetchFollowings();
  };

  const handleReport = async (userId) => {
    const time = serverTimestamp();
    await addDoc(collection(db, "reports"), {
      reporter: auth.currentUser.uid,
      reportedUser: userId,
      timestamp: time
    });
    alert("Reported user " + userId);
  };

  return (
    <div>
      <FormControl>
        <FormLabel>Follow User</FormLabel>
        <TextField value={emailtext} onChange={e => setEmailText(e.target.value)} placeholder="Search users..." />
      </FormControl>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2>Search Results:</h2>
          {filteredUsers.length > 0 ? (
            <ul>
              {filteredUsers.map((user) => (
                <ListItem key={user.id}>
                  {user.email}
                  {followings.find(following => following.following === user.id)
                    ? <Button onClick={() => handleUnfollow(followings.find(following => following.following === user.id).id)}>Unfollow</Button>
                    : <Button onClick={() => handleFollow(user.id)}>Follow</Button>
                  }
                  <Button onClick={() => handleReport(user.id)}>Report</Button>
                </ListItem>
              ))}
            </ul>
          ) : (
            <p>No results</p>
          )}
        </div>
        <div>
          <h2>Following:</h2>
          {followings.length > 0 ? (
            <ul>
              {followings.map((following) => (
                <ListItem key={following.id}>
                  {users.find(user => user.id === following.following)?.email}
                  {followers.includes(following.following) && <StarIcon />}
                  <Button onClick={() => handleUnfollow(following.id)}>Unfollow</Button>
                  <Button onClick={() => handleReport(following.following)}>Report</Button>
                </ListItem>
              ))}
            </ul>
          ) : (
            <p>You are not following anyone yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/*import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, where, query } from 'firebase/firestore';
import { app } from '../app';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import StarIcon from '@mui/icons-material/Star';
import ListItem from '@mui/material/ListItem';

const auth = getAuth(app);
const db = getFirestore(app);

export default function Users() {

  const [emailtext, setEmailText] = React.useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [followings, setFollowings] = useState([]);

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
    const filterUsers = () => {
      const filteredResults = users.filter((user) =>
        user.email.toLowerCase().includes(emailtext.toLowerCase())
      );
      setFilteredUsers(filteredResults);
    };
    filterUsers();
  }, [users, emailtext]);

  useEffect(() => {
    const fetchFollowings = async () => {
      const q = await getDocs(query(collection(db, "connections"), where('follower', '==', auth.currentUser.uid)));
      const followingArray = q.docs.map((doc) => ({id: doc.id, ...doc.data()}));
      setFollowings(followingArray);
    };
    if (auth.currentUser) fetchFollowings();
  }, []);

  const handleFollow = async (userId) => {
    const time = serverTimestamp();
    await addDoc(collection(db, "connections"), {
      follower: auth.currentUser.uid,
      following: userId,
      timestamp: time
    });
    alert("Now following " + userId + " since " + time);
    fetchFollowings();
  };

  const handleUnfollow = async (connectionId) => {
    await deleteDoc(doc(db, "connections", connectionId));
    alert("Unfollowed successfully");
    fetchFollowings();
  };

  return (
    <div>
      <FormControl>
        <FormLabel>Follow User</FormLabel>
        <TextField value={emailtext} onChange={e => setEmailText(e.target.value)} placeholder="Search users..." />
      </FormControl>
      <div>
        <h2>Search Results:</h2>
        {filteredUsers.length > 0 ? (
          <ul>
            {filteredUsers.map((user) => (
              <ListItem key={user.id}>
                {user.email}
                {followings.find(following => following.following === user.id)
                  ? <Button onClick={() => handleUnfollow(followings.find(following => following.following === user.id).id)}>Unfollow</Button>
                  : <Button onClick={() => handleFollow(user.id)}>Follow</Button>
                }
              </ListItem>
            ))}
          </ul>
        ) : (
          <p>No results</p>
        )}
      </div>
      <div>
        <h2>Following:</h2>
        {followings.length > 0 ? (
          <ul>
            {followings.map((following) => (
              <ListItem key={following.id}>
                {users.find(user => user.id === following.following)?.email} <StarIcon />
                <Button onClick={() => handleUnfollow(following.id)}>Unfollow</Button>
              </ListItem>
            ))}
          </ul>
        ) : (
          <p>You are not following anyone yet.</p>
        )}
      </div>
    </div>
  );
}*/