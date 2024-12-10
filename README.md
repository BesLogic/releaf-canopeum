# Canopeum

![Alt text](canopeum_frontend/public/Canopeum_Logo.jpg?raw=true "Logo")

This project integrates Django backend with React Vite frontend template to create a full-stack web application.

Backlog: <https://github.com/orgs/BesLogic/projects/3/views/1?filterQuery=-status%3ADone>\
Figma: <https://www.figma.com/design/iKVdInwWsIsxBFxeoGNb6h/Philanthropy-Canopeum>

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
- [UV](https://docs.astral.sh/uv/getting-started/installation/#standalone-installer)
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

4. Set up Django backend and Database: (Skip this section for Frontend only)\
   4.1. Add a `canopeum_backend/canopeum_backend/.env` file with the contents:

   ```ini
   SECRET_KEY_DJANGO_CANOPEUM="not_empty"
   MYSQL_PASSWORD_CANOPEUM="CanopeumUser12345!@"
   GOOGLE_API_KEY_CANOPEUM=<your Google Geocoding API key, leave empty if none>
   ```

   4.2. Then run:

   ```shell
   cd canopeum_backend
   docker compose up
   uv sync --locked
   uv run manage.py initialize_database
   uv run manage.py runserver
   ```

5. Set up React frontend:

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

6. Linting/Formatting:

   For Frontend: (Dprint & Eslint)

   ```shell
   cd canopeum_frontend
   npm run lint:fix
   ```

   For Backend: (Ruff, mypy, pyright)

   ```shell
   cd canopeum_backend
   uv run ./scripts/checkers.py
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
│   └── pyproject.toml        # Python dependencies
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

Run `npm run generate-api-client` to generate and replace directly the openapi spec file
(Hint: Don't forget to be in canopeum_frontend folder to run the command)

<!--
In case the command stops working and you need to manually regenerate it (prefer fixing the command though):
1. Open NSwagStudio and close any already open Document (re-openning the same document doesn't clear changes in NSwagStudio)
1. Open [canopeum.nswag](/docs/canopeum.nswag) with NSwagStudio
1. Click "Create a local Copy"
1. Click "Generate Files" (the relative path is already set)
1. Run `npm run lint:fix`

If you save a modification to the `.nswag` file, DO NOT INCLUDE THE LOCAL COPY OF THE SPEC !

![NSwagStudio Documents](/docs/NSwagStudio_Documents.png)
-->

## Deployments

Whenever changes are pushed to the main branch, a build is automatically triggered and a container package pushed to <https://github.com/orgs/BesLogic/packages?repo_name=releaf-canopeum>. An administrator must then navigate to `/#!/1/docker/stacks/releaf-canopeum?id=11&regular=true` on our portainer instance and press "Pull and redeploy".

You can also trigger a manual package build by using the "Run workflow" button at <https://github.com/BesLogic/releaf-canopeum/actions/workflows/canopeum_deploy.yml>. We'd prefer this to be the only action necessary for a deployment, so that any maintainer on GitHub could redeploy, but our automated detection on portainer currently isn't working.
