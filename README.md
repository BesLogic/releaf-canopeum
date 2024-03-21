# Canopeum

![Alt text](canopeum_frontend/public/Canopeum_Logo.jpg?raw=true "Logo")

This project integrates Django backend with React Vite frontend template to create a full-stack web application.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

For frontend
- Node.js
- npm (Node Package Manager)
- Mockoon
For backend
- Python (3.x recommended)
- Docker


### Installation

1. Clone the repository:

```bash
git clone git@github.com:BesLogic/releaf-canopeum.git
cd releaf-canopeum
```

2. Set up Django backend and Database: (Skip this section for Frontend only)

```bash
docker compose up
cd canopeum_backend
python -m venv .venv
source .venv/scripts/activate
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

3. Set up React frontend:

```bash
cd canopeum_frontend
npm install
npm run dev
```

Run mock data (For Frontend only)

```bash
# In another CLI
npm install -g @mockoon/cli
cd releaf-canopeum/canopeum_frontend
mockoon-cli start --data canopeum-mockoon.json
```

### Folder Architecture

```bash
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
