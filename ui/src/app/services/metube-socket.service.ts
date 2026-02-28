import { Injectable, inject } from '@angular/core';
import { ApplicationRef } from '@angular/core';
import { Socket } from 'ngx-socket-io';

function generateUUID(): string {
  // Works in both secure (HTTPS) and non-secure (HTTP) contexts
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for HTTP / older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function getOrCreateUserId(): string {
  const key = 'metube_user_id';
  let userId = localStorage.getItem(key);
  if (!userId) {
    userId = generateUUID();
    localStorage.setItem(key, userId);
  }
  return userId;
}

export const USER_ID = getOrCreateUserId();

@Injectable(
  { providedIn: 'root' }
)
export class MeTubeSocket extends Socket {

  constructor() {
    const appRef = inject(ApplicationRef);

    const path =
      document.location.pathname.replace(/share-target/, '') + 'socket.io';
    super({ url: '', options: { path, query: { user_id: USER_ID } } }, appRef);
  }
}
