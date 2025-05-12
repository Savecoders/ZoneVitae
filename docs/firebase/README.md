# ZoneVitae Firebase Integration

This document provides an overview of how ZoneVitae uses Firebase services to power its backend functionality.

## Overview

ZoneVitae leverages Firebase to provide a scalable, real-time capable backend for our community reporting and management platform. Firebase offers several advantages for our application:

- **Firestore Database**: NoSQL database for storing user data, communities, reports, and other app data
- **Authentication**: Secure user authentication with email/password, social logins, and more
- **Storage**: Cloud storage for user uploads like profile pictures, community logos, and report photos

## Project Structure

The Firebase implementation for ZoneVitae includes:

- `firestore-structure.md`: Detailed documentation of our Firestore database structure
- `firebase-setup-guide.md`: Step-by-step guide for setting up Firebase for this project
- `import-script.js`: Script for importing sample data into Firestore
- `reponse.json`: Sample data in JSON format for development/testing

## Getting Started

To set up the Firebase backend for ZoneVitae:

1. Follow the instructions in `firebase-setup-guide.md` to create and configure your Firebase project
2. Review `firestore-structure.md` to understand the data model
3. Use `import-script.js` to populate your Firestore database with sample data

## Data Model

ZoneVitae uses a NoSQL data model in Firestore with the following main collections:

- `usuarios`: User profiles and account information
- `comunidades`: Community information and metadata
- `reports`: User-submitted reports about issues in communities
- `actividades`: Community events and activities
- `tags`: Categories for classifying reports and communities

For the complete data model with relationships and subcollections, refer to `firestore-structure.md`.

## Firebase Services Used

### Firestore

Our primary database for storing and querying application data. The structure is optimized for common queries and real-time updates.

### Authentication

Firebase Authentication handles user registration, login, and access control. We use:

- Email/password authentication
- Account management (password reset, email verification)
- Security rules integration with Firestore

### Storage

Cloud Storage manages binary assets such as:

- User profile pictures
- Community logos and cover images
- Report photos
- Activity cover images

### Security

The application implements security through:

- Firebase Authentication for identity verification
- Firestore security rules for access control
- Client-side validation alongside server-side rules

## Client Integration

The Angular client connects to Firebase through:

- `@angular/fire` library for Angular integration
- Service classes in `/client/src/app/services/` that abstract Firebase operations
- Environment configuration in `/client/src/environments/environment.ts`

## Development Workflow

When working with the Firebase implementation:

1. Use the local emulators for development to avoid costs and rate limits
2. Test security rules thoroughly before deployment
3. Maintain backward compatibility when modifying data structures
4. Use Firebase console for monitoring and debugging

## Deployment

Deployment of Firebase configuration is handled through the Firebase CLI:

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy Firebase configuration (Firestore rules, indexes, etc.)
firebase deploy
```

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Angular Fire Documentation](https://github.com/angular/angularfire)
