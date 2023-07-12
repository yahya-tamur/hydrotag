/* why I created this : In Next.js, all global CSS imports should be in the pages/_app.js file.
You should create a file pages/_app.js (note the underscore) 
and import your global styles there. 
The pages/_app.js is a custom App component that wraps around all your page components.

not allowed to use app.js because Global CSS cannot be imported from files other than your Custom <App>.
 Due to the Global nature of stylesheets, and to avoid conflicts - Evelyn
*/

// pages/_app.js

import '../styles/globals.css';  // This is your global CSS file

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
