# Canopeum

![Alt text](canopeum_frontend/public/Canopeum_Logo.jpg?raw=true "Logo")

This project integrates Django backend with React Vite frontend template to create a full-stack web application.

## Getting Started

This project has been configured to run in VsCode dev container with all
necessary tools to run the front-end and backend from within the environment or
follow these instructions to get the project up and running on your local machine
without dev container.

Note: If you choose to develop from within the dev container, you still need to
have your mysql database available accessible from your app. We've pre-configured
the dev container to try reaching the default mysql database container created
with the docker-compose.yml from this repository.

### Prerequisites

For frontend:

- [Node.js](https://nodejs.org/en/download) (includes npm)
- [Mockoon](https://mockoon.com/download/#download-section)

For backend

- [Python 3.12](https://www.python.org/downloads/)
- [Docker](https://www.docker.com/get-started/)

### Installation

1. Fork the project:\
   ![Fork](/docs/Fork.png)

2. Clone the repository:\
   From your fork, copy the repo's URL\
   ![Clone](/docs/Clone.png)

   ```shell
   git clone <the_url_you_copied>
   cd releaf-canopeum
   ```

3. Install recommended Editor Extensions (for VSCode):\
   When you first open the project in VSCode, you'll get a notification like this.\
   ![Recommended Popup](/docs/Recommended_Popup.png)

   If you've already dismissed this notification, you can search for `@recommended` in your Extensions tab.
   Install everything under "**WORKSPACE RECOMMENDATIONS**", you can ignore "other recommendations":\
   ![Recommended Extensions](/docs/Recommended_Extensions.png)

4. Set up a Python 3.12 virtual environment

   ```shell
   cd canopeum_backend
   python3.12 -m venv .venv
   ```

   or on Windows if "python3.12" is not a recognized command:

   ```powershell
   cd canopeum_backend
   py -3.12 -m venv .venv
   ```

   Then activate the environment (you need to do this everytime if your editor isn't configured to do so):

   ```shell
   source .venv/scripts/activate
   ```

   and on Windows:

   ```powershell
   .venv/scripts/activate
   ```

   In VSCode (Windows):
   `CTRL+Shift+P` (Open Command Palette) > `Python: Select Interpreter`
   ![VSCode_select_venv](/docs/VSCode_select_venv.png)

5. Set up Django backend and Database: (Skip this section for Frontend only)

   ```shell
   cd canopeum_backend
   docker compose up
   python -m pip install -r requirements-dev.txt
   python manage.py initialize_database
   python manage.py runserver
   ```

6. Set up React frontend:

   ```shell
   cd canopeum_frontend
   npm install
   npm run dev
   ```

   Run mock data (For Frontend only)

   ```shell
   # In another CLI
   cd canopeum_frontend
   npm run mockoon
   ```

7. Linting/Formatting:

   For Frontend: (Dprint & Eslint)

   ```shell
   cd canopeum_frontend
   npm run lint:fix
   ```

   For Backend: (Ruff, mypy, pyright)

   ```shell
   cd canopeum_backend
   python ./scripts/checkers.py
   ```

   For both: (autofixers)

   ```shell
   pre-commit run --all
   ```

### Quickly running the application locally

We've made a `start-local-env.ps1` helper script to ease starting up the application. Feel free to use and improve it.
TODO: Setup Python debugging of running application to debug backend started by script.

### Folder Architecture

```ini
project_name/
│
├── backend/                  # Django backend
│   ├── myproject/            # Django project directory
│   │   ├── myapp/            # Django app directory
│   │   │   ├── migrations/   # Database migrations
│   │   │   ├── models.py     # Django models
│   │   │   ├── views.py      # Django views
│   │   │   └── ...           # Other Django app files
│   │   ├── myproject/        # Django project settings
│   │   ├── manage.py         # Django management script
│   │   └── ...               # Other Django project files
│   └── requirements.txt      # Python dependencies
│   └── docker-compose.yml    # File configuration container MySQL
│
├── frontend/                 # React frontend
│   ├── public/               # Public assets
│   │   ├── index.html        # HTML entry point
│   │   └── ...               # Other public files
│   ├── src/                  # Source code
│   │   ├── assets/           # React components
│   │   │   ├── icons/        # Custom icon bank
│   │   │   └── styles/       # Stylesheets / Bootstrap override / Theme variables
│   │   ├── components/       # React components
│   │   │   ├── Component1.js # Sample React component
│   │   │   └── ...           # Other React components
│   │   ├── pages/            # Pages
│   │   │   ├── Page1.js      # Sample page
│   │   │   └── ...           # Other pages
│   │   ├── hooks/            # Hooks
│   │   │   ├── useFetch.js   # Sample hook fetch
│   │   │   └── ...           # Other hooks
│   │   ├── services/         # Services
│   │   │   ├── api.js        # Sample service api
│   │   │   └── ...           # Other services
│   │   ├── App.js            # Main React component
│   │   ├── main.tsx         # React entry point
│   │   └── ...               # Other React source files
│   ├── package.json          # npm package configuration
│   ├── package-lock.json     # npm package lock
│   └── ...                   # Other React frontend files
│
└── README.md                 # Project documentation
```

## Regenerating the API spec with NSwagStudio

1. Open NSwagStudio and close any already open Document (re-openning the same document doesn't clear changes in NSwagStudio)
1. Open [canopeum.nswag](/docs/canopeum.nswag) with NSwagStudio
1. Click "Create a local Copy"
1. Click "Generate Files" (the relative path is already set)
1. Run `npm run lint:fix`

If you save a modification to the `.nswag` file, DO NOT INCLUDE THE LOCAL COPY OF THE SPEC !

![NSwagStudio Documents](/docs/NSwagStudio_Documents.png)
