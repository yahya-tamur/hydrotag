import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, where, query, onSnapshot } from 'firebase/firestore';
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

const auth = getAuth(app);
const db = getFirestore(app);

export default function Users() {
  const [emailtext, setEmailText] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState("");
  const [reportText, setReportText] = useState("");
  const [userIdToReport, setUserIdToReport] = useState(null);

  const reportTypes = ["Falsely pinning a water source", "Inappropriate reviews", "Spamming", "Being a bully"];

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (userId) => {
    setUserIdToReport(userId);
    setOpen(true);
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
      handleClose();
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
        user.email.toLowerCase().includes(emailtext.toLowerCase()) && user.id !== auth.currentUser.uid
      );
      setFilteredUsers(filteredResults);
    };
    filterUsers();
  }, [users, emailtext]);

  useEffect(() => {
    const fetchFollowings = () => {
      const unsub = onSnapshot(query(collection(db, "connections"), where('follower', '==', auth.currentUser.uid)), (snapshot) => {
        const followingArray = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
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
  };

  const handleUnfollow = async (connectionId) => {
    await deleteDoc(doc(db, "connections", connectionId));
  };

  const handleReport = (userId) => {
    handleOpen(userId);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmitReport}>Submit Report</Button>
        </DialogActions>
      </Dialog>

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
                  {(followings.find(following => following.following === user.id)
                    ? <Button onClick={() => handleUnfollow(followings.find(following => following.following === user.id).id)}>Unfollow</Button>
                    : <Button onClick={() => handleFollow(user.id)}>Follow</Button>
                  )}
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
            <p>You are not following any users yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}


