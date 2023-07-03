Instructions on getting started:

* Clone the repository:

```git clone git@github.com:yahya-tamur/hydrotag.git```

* Copy the `.env.local` file from discord into the `frontend` directory.

* Copy the `cert.json` file from discord into the `backend` directory.

* Open a terminal, and navigate into the backend directory. Run the
following commands to install the necessary files and start the backend
server on the url `http://localhost:3001`:

```npm install```

```node backend.js```

You should be able to go to `http://localhost:3001/markers` and see the
data for two water fountains.

You only need to run `npm install` if we change dependencies -- you can
usually just run `node backend.js` to start the server.

* Open a new terminal, and navigate into the `frontend` directory. Run the
following commands to install the necessary files and start the frontend
server on the url `http://localhost:3000`:

```npm install```

```npm run dev```

You should be able to go to `http://localhost:3000` and see the app so far.

Similarly, you only need to run `npm install` if we change dependencies.
You can usually just run `npm run dev` to start the server.

In order to get started making changes, I would suggest looking at the front end, specifically
the `frontend/pages/index.js` file. This is a React file using functional components.
You can get started by researching the very basic syntax of React and adding simple stuff to
the web page, like some text above the map.
