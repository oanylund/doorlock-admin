import StatusActions from '../actions/StatusActions';
import NotificationActions from '../actions/NotificationActions';
import io from 'socket.io-client';
import { baseUrl } from 'config';

const authSocket = io(baseUrl + ':8080/auth');
authSocket.io.reconnectionAttempts(5);

let _isAuthenticated = false;

const LockController = {
  _setAuthentication(state) {
    _isAuthenticated = !!state;
  },
  _newLogUpdate(log) {
    StatusActions.logData(log);
  },
  _newLockStatus(status) {
    StatusActions.lockStatusUpdate(status);
  },
  _checkAuth() {
    return _isAuthenticated;
  },
  authenticate() {
    authSocket.emit('authenticate', { token: localStorage.token });
  },
  forceOpen() {
    if( this._checkAuth() ) {
      authSocket.emit('forceOpen');
    }
  },
  forceClose() {
    if( this._checkAuth() ) {
      authSocket.emit('forceClose');
    }
  },
}


authSocket.on('connect', () => {
  // Confirmation of authentication event from server
  authSocket.on('authenticated', () => {
    LockController._setAuthentication(true);

    authSocket.on('logTail', (log) => {
      LockController._newLogUpdate(log);
    });
    authSocket.on('lockStatus', (status) => {
      LockController._newLockStatus(status);
    });

  });

  // Initial authentication attempt if localStorage is present
  if ( localStorage.token ) {
    authSocket.emit('authenticate', { token: localStorage.token });
  }

  // Socket error handling
  authSocket.on('unauthorized', (err) => {
    if (err.data.type == 'UnauthorizedError' || err.data.code == 'invalid_token') {
      LockController._setAuthentication(false);
      console.log('Authentication of socket failed. Try to refresh page');
      // Token will be verified by router and should redirect
    }
  });
});

authSocket.on('connect_error', () => {
  NotificationActions.warning({
    title: 'Tilkoblingsfeil dørlås',
    message: 'Fikk ikke kontakt med dørlåsserver. Prøver på nytt..',
    autoDismiss: 2
  });
});

authSocket.on('reconnect_failed', () => {
  NotificationActions.error({
    title: 'Tilkoblingsfeil dørlås',
    message: 'Får ikke kontakt med dørlåsserver',
    autoDismiss: 0
  });
});

export default LockController;
