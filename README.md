# USTP CI/CD Final - Tetris Game

[![CI](https://github.com/dh241823/ustp-cicd-final/actions/workflows/ci.yml/badge.svg?event=push)](https://github.com/dh241823/ustp-cicd-final/actions/workflows/ci.yml?query=event%3Apush)
[![Deploy to GitHub Pages](https://github.com/dh241823/ustp-cicd-final/actions/workflows/deploy.yml/badge.svg)](https://github.com/dh241823/ustp-cicd-final/actions/workflows/deploy.yml)
[![Release](https://img.shields.io/github/v/release/dh241823/ustp-cicd-final)](https://github.com/dh241823/ustp-cicd-final/releases)
[![Spellcheck](https://github.com/dh241823/ustp-cicd-final/actions/workflows/spellcheck.yml/badge.svg)](https://github.com/dh241823/ustp-cicd-final/actions/workflows/spellcheck.yml)


A Tetris game web application built with React and TypeScript, featuring a complete CI/CD pipeline with GitHub Actions.

## 🌐 Live Demo

Visit the application at: [https://dh241823.github.io/ustp-cicd-final/](https://dh241823.github.io/ustp-cicd-final/)

## 🚀 Developer Instructions

### Prerequisites

- Node.js (version 20 or higher)
- npm or yarn package manager

### Building the Application Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/dh241823/ustp-cicd-final.git
   cd ustp-cicd-final
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Build the application:
   ```bash
   npm run build
   ```

   The built application will be available in the `dist/` directory.

### Running the Application Locally

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Testing the Application

Run unit tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

Run tests with UI:
```bash
npm run test:ui
```

### Additional Commands

- **Lint**: `npm run lint` - Check code quality
- **Preview**: `npm run preview` - Preview the production build locally