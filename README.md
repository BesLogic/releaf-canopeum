# Canopeum

![Alt text](canopeum_frontend/public/Canopeum_Logo.jpg?raw=true "Logo")

This project integrates Django backend with React frontend to create a full-stack web application.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Python (3.x recommended)
- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:

```bash
git clone <repository_url>
cd releaf-canopeum

2. Set up Django backend:

```bash
cd canopeum_backend
python -m venv env
source env/scripts/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

3. Set up React frontend:

```bash
cd canopeum_frontend
npm install
npm start

### Folder Architecture

```bash
project_name/
│
├── backend/                   # Django backend
│   ├── myproject/             # Django project directory
│   │   ├── myapp/            # Django app directory
│   │   │   ├── migrations/   # Database migrations
│   │   │   ├── models.py     # Django models
│   │   │   ├── views.py      # Django views
│   │   │   └── ...           # Other Django app files
│   │   ├── myproject/         # Django project settings
│   │   ├── manage.py         # Django management script
│   │   └── ...               # Other Django project files
│   └── requirements.txt      # Python dependencies
│
├── frontend/                  # React frontend
│   ├── public/                # Public assets
│   │   ├── index.html         # HTML entry point
│   │   └── ...                # Other public files
│   ├── src/                   # Source code
│   │   ├── components/        # React components
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
│   │   ├── App.js             # Main React component
│   │   ├── index.js           # React entry point
│   │   └── ...                # Other React source files
│   ├── package.json           # npm package configuration
│   ├── package-lock.json      # npm package lock
│   └── ...                    # Other React frontend files
│
└── README.md                  # Project documentation
