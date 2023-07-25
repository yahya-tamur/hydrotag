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

[Final Presentation (link)](https://docs.google.com/presentation/d/1fvRpmCEcg1aN0IPgXJzBMwng9EW1PTLbd2yWc1fDhcE/edit?usp=sharing)

[Trello (Scrum Board)](https://trello.com/invite/b/YJktSPsr/ATTIed1937f5f39dad7d34302b3ee6421a5e4F55839B/hydrotag)

[Figma (UI Design)](https://www.figma.com/file/3ibFTSa1U5C3JDH8n9vAc3/HYDRO-TAG?type=design&mode=design&t=4ndNEYZ649YrSxIz-1)

[Notion](https://www.notion.so/CSE-115A-c0c99151f30647e4ba8712cf163f4581?pvs=4)

We used Prettier to format the code in lieu of a style guide.

## Instructions for contributing

- Clone the repository:

`git clone git@github.com:yahya-tamur/hydrotag.git`

- Go into the project directory:

`cd hydrotag`

- Copy the `.env.local` file from Discord into the project directory. This
  contains the Google Maps API key. Make sure you don't change the name of
  the file.

  The code does work without this step, but you will see an alert that says
  Google Maps didn't load correctly, and labels saying "For development
  purposes only" on the map.

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
