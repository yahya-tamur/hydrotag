import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <Link href='/'>Home</Link>
            <Link href='/Settings'>Settings</Link>
            <Link href='/MyFriends'>My Friends</Link>
            <Link href='/AchieveBadges'>Achievements/Badges</Link>
            <Link href='/WaterPinStreaks'>Water Pin Streaks</Link>
            <Link href='/MyReviews'>My Reviews</Link>
            <Link href='/FriendsReviews'>Friends' Reviews</Link>
        </div>
    );
};

export default Sidebar;
