import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import {
  updateDoc,
  increment,
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  where,
  query,
  doc,
  serverTimestamp,
  addDoc,
  deleteDoc,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { app } from '../app';
import {
  FormControl,
  FormLabel,
  TextField,
  Button,
  ListItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  Typography,
  InputLabel,
  MenuItem,
  Select,
  Divider,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { Box, borders, styled } from '@mui/system';
import UserProfile from './UserProfile';

const auth = getAuth(app);
const db = getFirestore(app);

const LabelText = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: 'black',
  cursor: 'pointer',
}));

export default function Profile() {
  const [bio, setBio] = useState('');
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [users, setUsers] = useState([]);
  const [openFollowings, setOpenFollowings] = useState(false);
  const [openFollowers, setOpenFollowers] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [profileUserId, setProfileUserId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [openReport, setOpenReport] = useState(false);
  const [reportType, setReportType] = useState('');
  const [reportText, setReportText] = useState('');
  const [userIdToReport, setUserIdToReport] = useState(null);
  const reportTypes = ['Falsely pinning a water source', 'Inappropriate reviews', 'Spamming', 'Being a bully'];

  const fetchData = async () => {
    const usersQuery = await getDocs(collection(db, 'users'));
    const usersArray = usersQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(usersArray);
    setBio(usersArray.find(user => user.id === auth.currentUser.uid).bio);

    const connectionsQuery = await getDocs(collection(db, 'connections'));
    const connectionsArray = connectionsQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFollowers(connectionsArray.filter(conn => conn.following == auth.currentUser.uid));
    const followingsArray = connectionsArray.filter(conn => conn.follower == auth.currentUser.uid);
    setFollowings(followingsArray);

    const intakeQuery = await getDocs(collection(db, 'waterIntake'));
    const intakeArray = intakeQuery.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
    setWaterIntakelog(
      intakeArray.filter(
        intake => followingsArray.find(f => f.following == intake.userId) || intake.userId == auth.currentUser.uid
      )
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFollow = async userId => {
    const time = serverTimestamp();
    await addDoc(collection(db, 'connections'), {
      follower: auth.currentUser.uid,
      following: userId,
      timestamp: time,
    });
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      following: increment(1),
    });
    await updateDoc(doc(db, 'users', userId), {
      followers: increment(1),
    });
    fetchData();
  };

  const handleUnfollow = async connection => {
    await deleteDoc(doc(db, 'connections', connection.id));
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      following: increment(-1),
    });
    await updateDoc(doc(db, 'users', connection.following), {
      followers: increment(-1),
    });
    fetchData();
  };
  const handleBioUpdate = async () => {
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      bio: bio,
    });
    fetchData();
  };

  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  const handleOpenProfile = userId => {
    setProfileUserId(userId);
    setOpenProfile(true);
  };

  const handleCloseReport = () => {
    setOpenReport(false);
  };

  const handleOpenReport = userId => {
    setUserIdToReport(userId);
    setOpenReport(true);
  };

  const handleSubmitReport = async () => {
    if (reportType && reportText) {
      const time = serverTimestamp();
      await addDoc(collection(db, 'reports'), {
        reporter: auth.currentUser.uid,
        reportedUser: userIdToReport,
        timestamp: time,
        type: reportType,
        description: reportText,
      });
      setReportType('');
      setReportText('');
      handleCloseReport();
      alert('Your report has been submitted and is being reviewed.');
    } else {
      alert('Please fill in all fields to submit a report.');
    }
  };

  const filteredFollowings = searchText
    ? followings.filter(following =>
        (users.find(user => user.id === following.following)?.name ?? 'no name')
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    : followings;

  const filteredFollowers = searchText
    ? followers.filter(follower =>
        (users.find(user => user.id === follower.follower)?.name ?? 'no name')
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
    : followers;
  const handleReport = userId => {
    handleOpenReport(userId);
  };
  const [oz, setOz] = useState(0); // amount of water intake in ounces
  const [waterIntakelog, setWaterIntakelog] = useState([]); // array to intake log entries

  // collects data on water intake
  const addWaterIntake = async () => {
    try {
      await addDoc(collection(db, 'waterIntake'), {
        amount: oz,
        timestamp: serverTimestamp(),
        userId: auth.currentUser.uid,
      });
      setOz(0);
    } catch (error) {
      console.error('error in adding water intake', error);
    }
  };
  const handleSubmitIntake = async () => {
    if (oz > 0) {
      try {
        await addWaterIntake();
        await fetchData();
      } catch (error) {
        console.error('Error in handleSubmitIntake:', error);
      }
    }
  };

  const handleIncrease = () => {
    setOz(prevValue => prevValue + 1);
  };
  const handleDecrease = () => {
    setOz(prevValue => prevValue - 1);
  };
  const handleInput = event => {
    const newValue = parseInt(event.target.value);
    setOz(isNaN(newValue) ? 0 : newValue);
  };

  const formatTimestamp = timestamp => {
    if (timestamp instanceof Date) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };
      return new Intl.DateTimeFormat('en-US', options).format(timestamp);
    } else if (timestamp && timestamp.seconds) {
      const dateObject = new Date(timestamp.seconds * 1000);
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };
      return new Intl.DateTimeFormat('en-US', options).format(dateObject);
    } else {
      // Handle the case when timestamp is null or invalid
      return 'Invalid Date';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <div>
        <Box display="flex" justifyContent="center" style={{ marginTop: '1em' }}>
          <Button onClick={() => setOpenFollowers(true)}>
            <LabelText border={2} borderRadius="16px" style={{ color: '#209cee' }}>
              &nbsp;Followers&nbsp;
            </LabelText>
          </Button>
          <Button onClick={() => setOpenFollowings(true)}>
            <LabelText border={2} borderRadius="16px" style={{ color: '#209cee' }}>
              &nbsp;Following&nbsp;
            </LabelText>
          </Button>
        </Box>
        <FormControl fullWidth>
          <FormLabel>Update Your Bio</FormLabel>
          <TextField sx={{ mr: '22px' }} value={bio} onChange={e => setBio(e.target.value)} placeholder="Your bio..." />
          <Box display="flex" justifyContent="center" style={{ marginTop: '1em' }}>
            <Button
              onClick={handleBioUpdate}
              style={{ color: '#209cee', fontWeight: 'bold', whiteSpace: 'nowrap' }}
              sx={{ fontSize: '1.2rem', p: '1em', width: '150px' }}
            >
              Update Bio
            </Button>
          </Box>
        </FormControl>
        <div>
          <br></br>
          <FormLabel>Record water intake (oz):</FormLabel>
          <Box display="flex" justifyContent="center" style={{ marginTop: '1em' }}>
            <button onClick={handleDecrease} style={{ fontSize: '28px' }}>
              –
            </button>
            <input
              type="number"
              value={oz}
              onChange={handleInput}
              style={{ textAlign: 'center', fontSize: '28px', width: '50%' }}
            />
            <button onClick={handleIncrease} style={{ fontSize: '28px' }}>
              +
            </button>
            <br></br>
            {/*<button onClick={() => addWaterIntake(oz)} style={{ fontSize: '22px' }}>Submit</button>*/}
            <button onClick={handleSubmitIntake} style={{ fontSize: '20px' }}>
              Record
            </button>
          </Box>
          <List sx={{ height: 'calc(100vh - 450px)', overflow: 'auto' }}>
            {waterIntakelog.map((entry, index) => (
              <ListItemText
                primary={`${
                  entry.userId == auth.currentUser.uid
                    ? 'You'
                    : users.find(user => user.id == entry.userId)?.name ?? 'unknown'
                } drank ${entry.amount} oz at ${entry.timestamp?.toDate().toLocaleTimeString('en-US') ?? 'loading'}`}
              />
            ))}
          </List>
        </div>
      </div>
      <Divider orientation="vertical" flexItem />

      {/* Report User Dialog */}
      <Dialog open={openReport} onClose={handleCloseReport}>
        <DialogTitle>Report User</DialogTitle>
        <DialogContent>
          <DialogContentText>Please fill in the following details for your report.</DialogContentText>
          <FormControl fullWidth>
            <InputLabel>Report Type</InputLabel>
            <Select value={reportType} onChange={e => setReportType(e.target.value)}>
              {reportTypes.map((type, index) => (
                <MenuItem value={type} key={index}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="dense"
            label="Report Description"
            type="text"
            value={reportText}
            onChange={e => setReportText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReport}>Cancel</Button>
          <Button onClick={handleSubmitReport}>Submit Report</Button>
        </DialogActions>
      </Dialog>

      {/* The rest of your Dialogs and Dialog components here */}
      <Dialog
        onClose={() => {
          setOpenFollowers(false);
          setSearchText('');
        }}
        open={openFollowers}
      >
        {/* User Profile Dialog */}
        <Dialog open={openProfile} onClose={handleCloseProfile}>
          <DialogTitle>User Profile</DialogTitle>
          <DialogContent>
            {/* Here you should render the user profile information */}
            <UserProfile user={users.find(user => user.id === profileUserId)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseProfile}>Close</Button>
          </DialogActions>
        </Dialog>

        <DialogTitle>Followers</DialogTitle>
        <TextField
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder="Search followers..."
          fullWidth
        />
        <List>
          {filteredFollowers.map(follower => (
            <ListItem key={follower.id}>
              <ListItemText
                primary={
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span>{users.find(user => user.id === follower.follower)?.name}</span>
                    {followings.find(following => following.following === follower.follower) && (
                      <StarIcon sx={{ ml: '10px' }} />
                    )}
                  </div>
                }
                sx={{ width: '160px' }}
              />
              <ListItemIcon sx={{ mr: '-30px', pr: '0px' }}></ListItemIcon>
              <Button
                sx={{ width: '100px' }}
                onClick={() =>
                  followings.find(following => following.following === follower.follower)
                    ? handleUnfollow(followings.find(following => following.following === follower.follower))
                    : handleFollow(follower.follower)
                }
                style={{ color: '#209cee' }}
              >
                {followings.find(following => following.following === follower.follower) ? 'Unfollow' : 'Follow'}
              </Button>
              <Button onClick={() => handleReport(follower.follower)} style={{ color: '#209cee' }}>
                Report
              </Button>
              <Button onClick={() => handleOpenProfile(follower.follower)} style={{ color: '#209cee' }}>
                Profile
              </Button>
            </ListItem>
          ))}
        </List>
      </Dialog>

      <Dialog
        onClose={() => {
          setOpenFollowings(false);
          setSearchText('');
        }}
        open={openFollowings}
      >
        {/* User Profile Dialog */}
        <Dialog open={openProfile} onClose={handleCloseProfile}>
          <DialogTitle>User Profile</DialogTitle>
          <DialogContent>
            {/* Here you should render the user profile information */}
            <DialogContentText>
              <UserProfile user={users.find(user => user.id === profileUserId)} />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseProfile}>Close</Button>
          </DialogActions>
        </Dialog>

        <DialogTitle>Following</DialogTitle>
        <TextField
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder="Search people you follow..."
          fullWidth
        />
        <List>
          {filteredFollowings.map(following => (
            <ListItem key={following.id}>
              <ListItemText
                primary={
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span>{users.find(user => user.id === following.following)?.name}</span>
                    {followers.find(follower => (follower.fallower = following.following)) && (
                      <StarIcon sx={{ ml: '10px' }} />
                    )}
                  </div>
                }
                sx={{ width: '160px' }}
              />
              <ListItemIcon sx={{ mr: '-30px', pr: '0px' }}></ListItemIcon>

              <Button sx={{ width: '100px' }} onClick={() => handleUnfollow(following)} style={{ color: '#209cee' }}>
                Unfollow
              </Button>
              <Button onClick={() => handleReport(following.following)} style={{ color: '#209cee' }}>
                Report
              </Button>
              <Button onClick={() => handleOpenProfile(following.following)} style={{ color: '#209cee' }}>
                Profile
              </Button>
            </ListItem>
          ))}
        </List>
      </Dialog>
      <Box sx={{ height: 'calc(100vh - 120px)', overflow: 'auto' }}>
        <UserProfile user={users.find(user => user.id === auth.currentUser.uid)} />
      </Box>
    </Box>
  );
}
