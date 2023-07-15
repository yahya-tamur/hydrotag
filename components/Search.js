import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebaseConfig";

const visual = () => {
    const [searchQuery, setSearchQuery] = useState("") 
    const [users, setUsers] = useState([]) // list of users
    const [filteredUsers, setFilteredUsers] = useState([]); // filtered list of users

    // Retrieve data from Firestore based on search 
    useEffect(() => {
        const fetchUsersData = async () => {
            const app = initializeApp(firebaseConfig);
            const db = getFirestore(app);
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
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
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