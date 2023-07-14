import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
//import { useCollectionData } from 'react-firebase-hooks/firestore';
import app from '../app';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [results, setResults] = useState([])

    const usersRef = collection(getFirestore(), 'users');
    const q = query(usersRef, where('email', '==', searchQuery));
    const [users] = useCollectionData(query, { idField: 'id' });


    // Retrieve data from Firestore based on search 
    useEffect(() => {
        const fetchData = async () => {
            const db = getFirestore(app);
            const q = query(collection(db, "myCollection"), where("user", "==", searchQuery));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => doc.data());
            setData(data);
        };
        fetchData();
    }, [searchQuery]);

    // search function
    function s(e) {
        e.preventDefault()
        setQuery(e.target.value)
    }

    return ( 
        <div>
            <form onSubmit={s}>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button type="submit">Search</button>
            </form>
            {users && users.map((user) => (
                <div key={user.id}>
                    <p>Email: {user.email}</p>
                    <p>name: {user.username}</p>
                </div>
            ))}
        </div>
    );
};

export default Search;