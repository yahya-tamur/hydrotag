import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, updateDoc, increment, getFirestore, collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, where, query, onSnapshot } from 'firebase/firestore';
import { app } from '../app';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import StarIcon from '@mui/icons-material/Star';
import ListItem from '@mui/material/ListItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

import UserProfile from './UserProfile';

const auth = getAuth(app);
const db = getFirestore(app);

export default function Users() {
  const [nametext, setNameText] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [openReport, setOpenReport] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [reportType, setReportType] = useState("");
  const [reportText, setReportText] = useState("");
  const [userIdToReport, setUserIdToReport] = useState(null);
  const [profileUserId, setProfileUserId] = useState(null);

  const reportTypes = ["Falsely pinning a water source", "Inappropriate reviews", "Spamming", "Being a bully"];

  const handleCloseReport = () => {
    setOpenReport(false);
  };

  const handleOpenReport = (userId) => {
    setUserIdToReport(userId);
    setOpenReport(true);
  };

  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  const handleOpenProfile = (userId) => {
    setProfileUserId(userId);
    setOpenProfile(true);
  };

  const handleSubmitReport = async () => {
    if (reportType && reportText) {
      const time = serverTimestamp();
      await addDoc(collection(db, "reports"), {
        reporter: auth.currentUser.uid,
        reportedUser: userIdToReport,
        timestamp: time,
        type: reportType,
        description: reportText
      });
      setReportType("");
      setReportText("");
      handleCloseReport();
      alert("Your report has been submitted and is being reviewed.");
    } else {
      alert("Please fill in all fields to submit a report.");
    }
  };

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
        (user.name ?? "no name").toLowerCase().includes(nametext.toLowerCase()) && user.id !== auth.currentUser.uid
      );
      setFilteredUsers(filteredResults);
    };
    filterUsers();
  }, [users, nametext]);

  useEffect(() => {
    const fetchFollowings = () => {
      const unsub = onSnapshot(query(collection(db, "connections"), where('follower', '==', auth.currentUser.uid)), (snapshot) => {
        const followingArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFollowings(followingArray);
      });
      return unsub;
    };

    const fetchFollowers = () => {
      const unsub = onSnapshot(query(collection(db, "connections"), where('following', '==', auth.currentUser.uid)), (snapshot) => {
        const followersArray = snapshot.docs.map((doc) => doc.data().follower);
        setFollowers(followersArray);
      });
      return unsub;
    };

    if (auth.currentUser) {
      const unsubFollowings = fetchFollowings();
      const unsubFollowers = fetchFollowers();
      return () => {
        unsubFollowings();
        unsubFollowers();
      }
    }
  }, []);

  const handleFollow = async (userId) => {
    const time = serverTimestamp();
    await addDoc(collection(db, "connections"), {
      follower: auth.currentUser.uid,
      following: userId,
      timestamp: time
    });
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      following: increment(1)
    });
    await updateDoc(doc(db, 'users', userId), {
      followers: increment(1)
    });
  };

  const handleUnfollow = async (connection) => {
    await deleteDoc(doc(db, "connections", connection.id));
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      following: increment(-1)
    });
    await updateDoc(doc(db, 'users', connection.following), {
      followers: increment(-1)
    });
  };

  const handleReport = (userId) => {
    handleOpenReport(userId);
  };

  return (
    <div>
      {/* Report User Dialog */}
      <Dialog open={openReport} onClose={handleCloseReport}>
        <DialogTitle>Report User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the following details for your report.
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel>Report Type</InputLabel>
            <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              {reportTypes.map((type, index) => (
                <MenuItem value={type} key={index}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="dense"
            label="Report Description"
            type="text"
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReport}>Cancel</Button>
          <Button onClick={handleSubmitReport}>Submit Report</Button>
        </DialogActions>
      </Dialog>

      {/* User Profile Dialog */}
      <Dialog open={openProfile} onClose={handleCloseProfile}>
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
          {/* Here you should render the user profile information */}
          <DialogContentText>
            User ID: {profileUserId}
            <UserProfile user={users.find(user => user.id === profileUserId)} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProfile}>Close</Button>
        </DialogActions>
      </Dialog>

      <FormControl>
        <FormLabel>Find People to follow!</FormLabel>
        <TextField value={nametext} onChange={e => setNameText(e.target.value)} placeholder="Search users..." />
      </FormControl>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2>Search Results:</h2>
          {filteredUsers.length > 0 ? (
            <ul>
              {filteredUsers.map((user) => (
                <ListItem key={user.id}>
                  {user.name}
                  {followings.find(following => following.following === user.id) && followers.includes(user.id) && <StarIcon />}
                  {(followings.find(following => following.following === user.id)
                    ? <Button onClick={() => handleUnfollow(followings.find(following => following.following === user.id))} style={{ color: '#209cee' }}>Unfollow</Button>
                    : <Button onClick={() => handleFollow(user.id)} style={{ color: '#209cee' }}>Follow</Button>
                  )}
                  <Button onClick={() => handleReport(user.id)} style={{ color: '#209cee' }}>Report</Button>
                  <Button onClick={() => handleOpenProfile(user.id)} style={{ color: '#209cee' }}>Profile</Button>
                </ListItem>
              ))}

            </ul>
          ) : (
            <p>No results</p>
          )}
        </div>
        <div>
        </div>
        <div>
        </div>
      </div>
    </div>
  );
}



