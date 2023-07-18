import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, collection, getDocs, onSnapshot, where, query, doc, serverTimestamp, addDoc, deleteDoc } from 'firebase/firestore';
import { app } from '../app';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import StarIcon from '@mui/icons-material/Star';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

const auth = getAuth(app);
const db = getFirestore(app);

export default function Profile() {
    const [bio, setBio] = useState("");
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);
    const [users, setUsers] = useState([]);
    const [openFollowings, setOpenFollowings] = useState(false);
    const [openFollowers, setOpenFollowers] = useState(false);
    const [searchText, setSearchText] = useState("");
    const router = useRouter();

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
    };

    const handleUnfollow = async (connectionId) => {
        await deleteDoc(doc(db, "connections", connectionId));
    };

    const handleBioUpdate = async () => {
        await updateProfile(auth.currentUser, { displayName: bio });
    }

    const goToProfile = (userId) => {
        router.push(`/profile/${userId}`);
    }

    const filteredFollowings = searchText
        ? followings.filter((following) =>
            users.find(user => user.id === following.following)?.email.toLowerCase().includes(searchText.toLowerCase())
        )
        : followings;

    const filteredFollowers = searchText
        ? followers.filter((followerId) =>
            users.find(user => user.id === followerId)?.email.toLowerCase().includes(searchText.toLowerCase())
        )
        : followers;

    return (
        <div>
            <Avatar sx={{ bgcolor: 'blue' }} >{auth.currentUser?.email[0].toUpperCase()}</Avatar>
            <p> placeholder icon</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormControl>
                    <FormLabel>Bio</FormLabel>
                    <TextField value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Your bio..." />
                    <Button onClick={handleBioUpdate}>Update Bio</Button>
                </FormControl>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="h6" style={{ cursor: 'pointer' }} onClick={() => setOpenFollowers(true)}>
                            Followers: <span style={{ color: '#209cee' }}>{followers.length}</span>
                        </Typography>
                        <Typography variant="h6" style={{ marginLeft: '1em', cursor: 'pointer' }} onClick={() => setOpenFollowings(true)}>
                            Following: <span style={{ color: '#209cee' }}>{followings.length}</span>
                        </Typography>
                    </div>
                    <Dialog onClose={() => setOpenFollowings(false)} open={openFollowings}>
                        <DialogTitle>Followings</DialogTitle>
                        <TextField
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Search followings..."
                            fullWidth
                        />
                        <List>
                            {filteredFollowings.map((following) => (
                                <ListItem key={following.id}>
                                    <Typography>{users.find(user => user.id === following.following)?.email}</Typography>
                                    {followers.includes(following.following) && <StarIcon />}
                                    <Button onClick={() => goToProfile(following.following)} style={{ color: '#209cee' }}>Profile</Button>
                                    <Button onClick={() => handleUnfollow(following.id)} style={{ color: '#209cee' }}>Unfollow</Button>
                                </ListItem>
                            ))}

                        </List>
                    </Dialog>
                    <Dialog onClose={() => setOpenFollowers(false)} open={openFollowers}>
                        <DialogTitle>Followers</DialogTitle>
                        <TextField
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Search followers..."
                            fullWidth
                        />
                        <List>
                            {filteredFollowers.map((followerId) => (
                                <ListItem key={followerId}>
                                    <Typography>{users.find(user => user.id === followerId)?.email}</Typography>
                                    {followings.find(following => following.following === followerId) && <StarIcon />}
                                    <Button onClick={() => goToProfile(followerId)} style={{ color: '#209cee' }}>Profile</Button>
                                </ListItem>
                            ))}

                        </List>
                    </Dialog>
                </div>
            </div>
            <div style={{ marginTop: '2em' }}>
                <Typography variant="h5">Will be adding user badges and water streak here !!!</Typography>
            </div>
        </div>
    )
}
