# Capstone Project : Finder

## Description
Finder is a web application designed to help people who have lost their belongings within KMUTT. The solution allows users to search the collected storage for items that match their descriptions.

## Features
- Frontend built with Next.js
- Backend powered by Django Rest Framework
- Integration with Cloudinary for image storage
- Object detection using YOLOv5
- Authentication and authorization with JWT
- Responsive design using MUI (Material-UI)
- State management with React Hook Form
- API handling with Axios

## Installation

### Frontend
1. Clone the repository:
    ```bash
    git clone https://github.com/HelloArtty/CAP.git
    cd CAP/frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the development server:
    ```bash
    npm run dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Backend
1. Clone the repository (if not already done):
    ```bash
    git clone https://github.com/HelloArtty/CAP.git
    cd CAP/Backend
    ```

2. Create a virtual environment and activate it:
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Run the Django development server:
    ```bash
    python manage.py runserver
    ```

## Usage
### Frontend
- Start the development server and open [http://localhost:3000](http://localhost:3000) in your browser.
- Edit `app/page.tsx` to modify the main page. Changes will automatically update in the browser.

### Backend
- Use the Django admin interface at [http://localhost:8000/admin](http://localhost:8000/admin) for managing the backend.
- Access API endpoints via the Django Rest Framework interface at [http://localhost:8000/api](http://localhost:8000/api).

## Technologies Used
- **Frontend:**
  - TypeScript
  - Next.js
  - MUI (Material-UI)
  - Axios
  - React Hook Form
  - TailwindCSS

- **Backend:**
  - Python
  - Django
  - Django Rest Framework
  - PostgreSQL
  - Gunicorn
  - Cloudinary
  - YOLOv5
  - PyTorch
  - JWT
