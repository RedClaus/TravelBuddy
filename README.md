# Travel Buddy

A comprehensive mobile and web application designed to serve as a personal travel assistant. The app utilizes geolocation services, document parsing, and the Perplexity API to provide users with real-time travel information, itinerary management, and contextual assistance throughout their journey.

## Project Overview

Travel Buddy aims to be an intelligent travel companion application that seamlessly manages travel plans, provides timely reminders, offers location-based insights, and responds to user queries through text and voice interfaces.

## Features

- **User Management**: Registration, authentication, profile management
- **Itinerary Management**: Create, view, edit, and share travel plans
- **Document Parsing**: Extract travel information from emails, PDFs, and images
- **Geolocation Services**: Real-time location tracking, proximity alerts, navigation
- **Notification System**: Smart reminders for travel events
- **Perplexity API Integration**: Context-aware information retrieval
- **Voice Interface**: Hands-free operation while traveling
- **Offline Capabilities**: Access to essential information without internet

## Technology Stack

### Frontend

- **Mobile**: React Native for iOS and Android
- **Web**: React.js with Material UI
- **State Management**: Redux with Redux Toolkit
- **Navigation**: React Navigation (mobile), React Router (web)

### Backend

- **Server**: Node.js with Express
- **Database**: MongoDB
- **Caching**: Redis
- **Authentication**: JWT
- **Architecture**: Microservices

### APIs and Integrations

- Perplexity API
- Google Maps API
- Calendar APIs
- Email parsing services
- Weather APIs
- Flight status APIs

## Project Structure

```
TravelBuddy/
├── backend/                  # Backend services
│   ├── services/             # Microservices
│   │   ├── user-service/     # User management
│   │   ├── itinerary-service/# Itinerary management
│   │   ├── geolocation-service/ # Location services
│   │   ├── notification-service/ # Notifications
│   │   ├── perplexity-service/ # Perplexity API integration
│   │   └── document-service/ # Document parsing
│   ├── models/               # Database models
│   ├── controllers/          # Request handlers
│   ├── routes/               # API routes
│   ├── middleware/           # Express middleware
│   ├── utils/                # Utility functions
│   ├── config/               # Backend configuration
│   └── tests/                # Backend tests
│
├── frontend/                 # Frontend applications
│   ├── web/                  # React.js web application
│   │   ├── src/              # Source code
│   │   │   ├── components/   # UI components
│   │   │   ├── pages/        # Page components
│   │   │   ├── hooks/        # Custom React hooks
│   │   │   ├── context/      # React context
│   │   │   ├── services/     # API services
│   │   │   ├── utils/        # Utility functions
│   │   │   ├── assets/       # Static assets
│   │   │   └── styles/       # CSS/SCSS files
│   │   └── public/           # Public assets
│   │
│   ├── mobile/               # React Native mobile app
│   │   ├── src/              # Source code
│   │   │   ├── components/   # UI components
│   │   │   ├── screens/      # Screen components
│   │   │   ├── navigation/   # Navigation configuration
│   │   │   ├── hooks/        # Custom React hooks
│   │   │   ├── context/      # React context
│   │   │   ├── services/     # API services
│   │   │   ├── utils/        # Utility functions
│   │   │   ├── assets/       # Static assets
│   │   │   └── styles/       # Stylesheets
│   │   ├── android/          # Android-specific code
│   │   └── ios/              # iOS-specific code
│   │
│   └── shared/               # Shared code
│       ├── components/       # Shared UI components
│       ├── hooks/            # Shared hooks
│       ├── utils/            # Shared utilities
│       ├── types/            # TypeScript types/interfaces
│       ├── services/         # Shared API services
│       └── assets/           # Shared assets
│
├── docs/                     # Documentation
│   ├── api/                  # API documentation
│   ├── architecture/         # Architecture documentation
│   ├── user-guides/          # User guides
│   ├── technical-guides/     # Technical guides
│   └── diagrams/             # Architecture diagrams
│
├── config/                   # Project configuration
│   ├── development/          # Development environment
│   ├── production/           # Production environment
│   └── testing/              # Testing environment
│
├── scripts/                  # Utility scripts
│   ├── deployment/           # Deployment scripts
│   ├── database/             # Database scripts
│   └── setup/                # Setup scripts
│
├── .gitignore                # Git ignore file
└── README.md                 # Project README
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB
- Redis (optional for caching)
- React Native development environment (for mobile)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration values.

5. Start the server:
   ```
   npm run dev
   ```

### Web Frontend Setup

1. Navigate to the web frontend directory:
   ```
   cd frontend/web
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

### Mobile Frontend Setup

1. Navigate to the mobile frontend directory:
   ```
   cd frontend/mobile
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. For iOS, install CocoaPods dependencies:
   ```
   cd ios && pod install && cd ..
   ```

4. Start the Metro bundler:
   ```
   npm start
   ```

5. Run on Android:
   ```
   npm run android
   ```

   Or iOS:
   ```
   npm run ios
   ```

## Development Phases

### Phase 1 (MVP)
- Core itinerary management
- Basic document parsing
- Essential geolocation features
- Simple query capabilities
- Fundamental notification system

### Phase 2
- Enhanced document intelligence
- Advanced notifications
- Voice interface implementation
- Improved offline capabilities

### Phase 3
- Full Perplexity API integration
- Advanced recommendations
- Social sharing features
- Enterprise features for business travelers

## Contributing

Please read the [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
