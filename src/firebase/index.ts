'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

function getValidatedConfig() {
  const { apiKey, appId, projectId, authDomain } = firebaseConfig as {
    apiKey?: string;
    appId?: string;
    projectId?: string;
    authDomain?: string;
  };

  if (!apiKey || !appId || !projectId || !authDomain) {
    throw new Error('Firebase configuration is missing required fields (apiKey, appId, projectId, authDomain).');
  }

  return firebaseConfig;
}

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  const existingApp = getApps()[0];
  if (existingApp) {
    return getSdks(existingApp);
  }

  // Always initialize with an explicit config to avoid app/no-options in CI/build environments.
  const firebaseApp = initializeApp(getValidatedConfig());
  return getSdks(firebaseApp);
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
