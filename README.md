Run the following commands to get started:

Clone the repository:

```git clone git@github.com:yahya-tamur/hydrotag.git```

Move into the repository directory:

```cd hydrotag```

Make a file called `.env.local` with the following content:

```NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="<api key>"```

I put my API key in the discord -- you can copy that value into `<api key>` above. You shouldn't put commit that into the public repository.
This lets Google track how much we use the Google Maps API and charge us if we use it too much.

Install the required modules:

```npm install```

Start the development server:

```npm run dev```

Now, you should be able to open a web browser, input the url `localhost:3000` , and see the web app.

In order to get started editing the code, look at the `pages/index.js` file. This is a React file using functional components.
You can get started by researching the very basic syntax of React and adding simple stuff to the web page, like some text below the map.

Things you put into the Home component should show up in the web page.
