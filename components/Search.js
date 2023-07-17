import React, { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";
import { app } from '../app';
import { getFirestore, collection, query, where, getDocs, getDoc, addDoc, Timestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebaseConfig";
import Button from '@mui/material/Button';
import { DatasetLinkedRounded } from '@mui/icons-material';

const auth = getAuth(app);
const db = getFirestore(app);

const visual = () => {
    const [searchQuery, setSearchQuery] = useState("") 
    const [users, setUsers] = useState([]) // list of users
    const [filteredUsers, setFilteredUsers] = useState([]); // filtered list of users
    const currentUserID = auth.currentUser.uid
    var fuid = ""
    // Retrieve data from Firestore based on search 
    useEffect(() => {
        const fetchUsersData = async () => {
            const app = initializeApp(firebaseConfig);
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '>=', searchQuery));

            const snapshot = await getDocs(q);
            const usersarray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUsers(usersarray);
        };
        fetchUsersData();
    }, [searchQuery]);
    useEffect(() => {
        const filterUsers = () => {
          const filteredResults = users.filter((user) =>
            user.email.toLowerCase().includes(searchQuery.toString().toLowerCase())
          );
          setFilteredUsers(filteredResults);
        };
        filterUsers();
    }, [users, searchQuery]);
  
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
      };

     return (
        <div>
          <input type="text" placeholder="Search users" onChange={handleSearch} />
          <Button onClick={
            async () => {
              const time = new Date().getTime();
              let ts = new Date(time);
              var userquery = searchQuery
              if (!auth.currentUser?.uid) {
                alert("You must be logged in add a friend!");
              }
              else {
                try {
                  if (filteredUsers.length == 1) { // autocomplete search if the filter has narrowed to one result
                    console.log(filteredUsers[0].email)
                    userquery = filteredUsers[0].email
                  }
                  if(filteredUsers.find(e => e.email === userquery)) { // if the userlist contains the query
                    fuid = users.find(e => e.email === userquery).id // get the user which matches find() that matches userquery
                    if (fuid == auth.currentUser.uid) {
                      alert("Following yourself is not supported.")
                    }
                    else {
                      console.log(currentUserID + " vs " + fuid)
                      const q = query(collection(db, "connections"), where("follower", "==" , currentUserID), where("following", "==", fuid));
                      const docSnap = await getDocs(q)
                      console.log(docSnap)
                      if(!docSnap.empty) {
                        alert("You are already following " + userquery)
                      }
                      else {
                        await addDoc(collection(db, "connections"), { 
                          follower: auth.currentUser.uid,
                          following: fuid,
                          timestamp: ts // timestamp stored in milliseconds, requires conversion for readability
                        });
                        alert("Now following " + searchQuery + " since " + ts)
                      }
                    }
                  }
                  else {
                    alert("The user " + userquery + " does not exist!")
                  }
                }
                catch (e) {
                  console.log(e)
                  alert("Error gathering data")
                }
              }
            }
          }>Follow User</Button>
          <div>
            <h2>Search Results:</h2>
            {filteredUsers.length > 0 ? (
              <ul>
                {filteredUsers.map((user) => (
                  <li key={user.id}>{user.email}</li>
                ))}
              </ul>
            ) : (
              <p>No results</p>
            )}
          </div>
        </div>
      );
};

export default visual;