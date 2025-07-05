# S21 Help - School 21 Dashboard

A Vue 3 application for School 21 students to view their profile, projects, calendar events, and campus information.

## Features

- **Authentication**: Login with School 21 credentials
- **Profile Management**: View personal information, points, and current workstation
- **Projects Dashboard**: Track project status and progress
- **Event Calendar**: View upcoming events and activities
- **Campus Information**: Real-time cluster availability across campuses
- **Offline Support**: Data persistence with IndexedDB
- **Auto-login**: Optional credential saving for convenience

## Tech Stack

- **Framework**: Vue 3 with Composition API
- **TypeScript**: Full type safety
- **Routing**: Vue Router 4
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Storage**: IndexedDB for offline data
- **Build Tool**: Vite

## Project Structure

```
src/
├── api/                    # API layer
│   ├── api.ts             # Main API client
│   └── getToken.ts        # Authentication API
├── assets/                # Static assets
│   ├── main.css          # Global styles
│   └── noavatar.png      # Default avatar
├── components/            # Reusable components
│   ├── BackButton.vue    # Navigation helper
│   ├── CampusInfo.vue    # Campus cluster display
│   ├── NavigationBar.vue # Bottom navigation
│   └── UserProfile.vue   # Profile component
├── router/               # Vue Router configuration
│   └── index.ts         # Routes and guards
├── stores/              # Pinia stores
│   ├── authStore.ts     # Authentication state
│   └── idb.ts           # IndexedDB utilities
├── views/               # Page components
│   ├── CalendarView.vue # Events calendar
│   ├── HomeView.vue     # Dashboard/campuses
│   ├── LoginView.vue    # Authentication
│   ├── ProfileView.vue  # User profile
│   └── ProjectView.vue  # Projects overview
├── App.vue              # Root component
└── main.ts              # Application entry point
```

## API Integration

The application integrates with School 21's educational API:

- **Authentication**: Keycloak-based OAuth2 authentication
- **User Data**: Profile information, points, workstation
- **Projects**: Status tracking and progress monitoring
- **Events**: Calendar events and activities
- **Campus**: Real-time cluster availability

### API Endpoints

- `POST /auth/realms/EduPowerKeycloak/protocol/openid-connect/token` - Authentication
- `GET /api/v1/participants/{username}` - User profile
- `GET /api/v1/participants/{username}/projects` - User projects
- `GET /api/v1/events` - Calendar events
- `GET /api/v1/campuses` - Campus list
- `GET /api/v1/campuses/{id}/clusters` - Campus clusters

## Setup and Installation

### Prerequisites

- Node.js 18+ and npm
- Modern web browser with IndexedDB support

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd s21_help

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript type checking
npm run lint         # ESLint code linting
npm run test:unit    # Run unit tests
```

## Usage Guide

### Authentication

1. Navigate to the login page
2. Enter your School 21 credentials
3. Optionally enable "Save Password" for auto-login
4. Click "Login" to authenticate

### Navigation

The application uses bottom navigation with four main sections:

- **Home**: Campus overview and cluster availability
- **Profile**: Personal information and statistics
- **Calendar**: Upcoming events and activities
- **Projects**: Project status and progress

### Features Overview

#### Home Page
- View all available campuses
- Select campus to view cluster availability
- Real-time capacity information

#### Profile Page
- Personal information display
- Points and coins tracking
- Current workstation information
- Logout functionality

#### Projects Page
- Project status tracking
- Progress percentage display
- Filtered by relevant statuses
- Color-coded status indicators

#### Calendar Page
- Event listings for next 30 days
- Detailed event information
- Location and timing details

## Configuration

### Environment Variables

The application uses CORS proxy for API requests. Update `getToken.ts` if needed:

```typescript
const CORS_PROXY = 'https://corsproxy.io/?'
```

### Tailwind CSS Theme

Custom color scheme defined in `main.css`:

```css
@theme {
  --color-lightgray-500: #2E363D;
  --color-lightgray-900: #171A1C;
  --color-lightgray-300: #A3ABBA;
  --color-greenforbuttons-500: #44EB99;
  --color-darkgreen-800: #1d2633;
  --color-justwhite-500: #FFF;
}
```

## Data Storage

### IndexedDB Schema

- **Database**: `DB21`
- **Store**: `keyval`
- **Keys**:
  - `user`: Authentication tokens
  - `username`: Current username
  - `savedLogin`: Saved login (optional)
  - `savedPassword`: Saved password (optional)

### Data Persistence

- User authentication state
- Username storage
- Optional credential saving
- Automatic data cleanup on logout

## Security Considerations

- Tokens are stored securely in IndexedDB
- Optional password saving (marked as unsafe)
- Automatic token refresh and logout
- CORS proxy for API access

## Browser Compatibility

- Modern browsers with ES6+ support
- IndexedDB API support required
- Fetch API support required

## Development

### Code Style

- TypeScript for type safety
- Vue 3 Composition API
- ESLint for code quality
- Pinia for state management

### Component Structure

- Single File Components (.vue)
- Composition API with `<script setup>`
- TypeScript interfaces for props
- Scoped CSS styling

### State Management

- Pinia stores for global state
- Reactive data with Vue 3 reactivity
- Computed properties for derived state
- Async actions for API calls

## Troubleshooting

### Common Issues

1. **Authentication fails**: Check credentials and network connectivity
2. **API errors**: Verify token validity and API endpoint availability
3. **Data not loading**: Check IndexedDB storage and clear if needed
4. **Navigation issues**: Ensure proper route configuration
```**Могут быть проблемы при отправке запросов с российских IP**```
### Debug Mode

Enable console logging to debug API calls and state changes:

```javascript
console.log('API Request:', request, authToken)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
