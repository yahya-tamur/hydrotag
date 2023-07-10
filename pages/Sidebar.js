import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <Link href='/'>Home</Link>
            <Link href='/settings'>Settings</Link>
            <Link href='/my-friends'>My Friends</Link>
            <Link href='/achievements'>Achievements/Badges</Link>
            <Link href='/water-pin-streaks'>Water Pin Streaks</Link>
            <Link href='/my-reviews'>My Reviews</Link>
            <Link href='/friends-reviews'>Friends' Reviews</Link>
        </div>
    );
};

export default Sidebar;
