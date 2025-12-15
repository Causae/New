'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    // Prefer explicit config-based initialization to avoid
    // "Need to provide options (app/no-options)" in environments
    // where no-arg initialization is not supported (CI/build agents).
    let firebaseApp;
    try {
      firebaseApp = initializeApp(firebaseConfig);
    } catch (e) {
      // If explicit config fails, attempt the no-arg initialization
      // (used by Firebase App Hosting). If that also fails, rethrow.
      try {
        firebaseApp = initializeApp();
      } catch (e2) {
        if (process.env.NODE_ENV === "production") {
          console.warn('Firebase initialization failed with both config and automatic initialization.', e2);
        }
        throw e2;
      }
    }

    return getSdks(firebaseApp);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
