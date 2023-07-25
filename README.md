Hosted on [hydrotag.vercel.app](https://hydrotag.vercel.app/)

## Documents

[Initial Presentation](documents/HydroTag%20Initial%20Presentation.pptx)

[Release Plan](documents/HydroTag%20Release%20Plan.pdf)

[Sprint 1 Plan](documents/HydroTag%20Sprint%201%20Plan.pdf)

[Sprint 1 Report](documents/HydroTag%20Sprint%201%20Report.pdf)

[Sprint 2 Plan](documents/HydroTag%20Sprint%202%20Plan.pdf)

[Sprint 2 Report](documents/HydroTag%20Sprint%202%20Report.pdf)

[Sprint 3 Plan](documents/HydroTag%20Sprint%203%20Plan.pdf)

[Sprint 3 Report](documents/HydroTag%20Sprint%203%20Report.pdf)

[Release Summary](documents/HydroTag%20Release%20Summary.pdf)

[Test Plan and Report](documents/Test%20Plan%20and%20Report.pdf)

[Final Presentation](https://docs.google.com/presentation/d/1fvRpmCEcg1aN0IPgXJzBMwng9EW1PTLbd2yWc1fDhcE/edit?usp=sharing)

## Instructions for contributing

- Clone the repository:

`git clone git@github.com:yahya-tamur/hydrotag.git`

- Go into the project directory:

`cd hydrotag`

- Copy the `.env.local` file from discord into the project directory. This
  contains the Google Maps API key. Make sure you don't change the name of
  the file.

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
