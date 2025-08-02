# Answer Checker

Answer Checker is a React-based application that allows users to practice multiple-choice questions across various topics. The application provides immediate feedback on answers and saves user progress in local storage.

## Features

- Multiple question sets covering different topics
- Immediate answer validation with detailed explanations
- Progress tracking through questions
- Local storage persistence for user selections
- Responsive design for various screen sizes

## Available Question Sets

The application includes the following question sets:

- Regulations
- Operations
- Loading and Performance
- Airspace
- Weather
- Sample Test

Each question set contains multiple-choice questions with three options (A, B, C).

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd answer-checker-react
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Technical Details

This project is built with:

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Vite](https://vitejs.dev/) - A fast build tool and development server

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deployment

To deploy this application to GitHub Pages, please follow the instructions in [DEPLOYMENT.md](DEPLOYMENT.md).
