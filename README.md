Hosted on [hydrotag.vercel.app](https://hydrotag.vercel.app/)

Instructions for contributing:

- Clone the repository:

`git clone git@github.com:yahya-tamur/hydrotag.git`

- Go into the project directory:

`cd hydrotag`

- Copy the `.env.local` file from discord into the project directory. Make sure
  you don't change the name of the file.

- Run the following commands to install the necessary files and start the app:

`npm install`

`npm run dev`

You should be able to go to `http://localhost:3000` and see the
app.

You only need to run `npm install` if we change dependencies -- you can
usually just run `npm run dev` to start the server.

To run the tests:

`npm run test`

To run an optimized
production version locally, first build:

`npm run build`

Then start the server:

`npm start`

To format:

`npm run format`

Please format before committing any changes!

Pushes to the main branch are tested and deployed automatically.
