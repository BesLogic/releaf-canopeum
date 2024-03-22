# Canopeum

![Alt text](canopeum_frontend/public/Canopeum_Logo.jpg?raw=true "Logo")

This project integrates Django backend with React Vite frontend template to create a full-stack web application.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

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

3. Set up a Python 3.12 virtual environment

   ```shell
   cd canopeum_backend
   python3.12 -m venv .venv
   ```

   or on Windows if "python3.12" is not a recognized command:

   ```powershell
   cd canopeum_backend
   py -3.12 -m venv .venv
   ```

   Then activate the environemnt (you need to do this everytime if your editor isn't configured to do so):

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

4. Set up Django backend and Database: (Skip this section for Frontend only)

   ```shell
   docker compose up
   cd canopeum_backend
   python -m pip install -r requirements-dev.txt
   python manage.py migrate
   python manage.py runserver
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
   npm install -g @mockoon/cli
   cd releaf-canopeum/canopeum_frontend
   mockoon-cli start --data canopeum-mockoon.json
   ```

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
