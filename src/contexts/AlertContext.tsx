import React, { useState, useCallback } from 'react';
import { Snackbar, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';

enum Severity {
  error = 'error',
  warning = 'warning',
  info = 'info',
  success = 'success',
}

type SeverityType = 'error' | 'warning' | 'info' | 'success';

interface RaiseAlertProps {
  message: string;
  severity?: SeverityType;
}

interface State extends RaiseAlertProps {
  open: boolean;
  duration?: number;
}

export type AlertContextState = (p: RaiseAlertProps) => void;

const defaultState: AlertContextState = () => undefined;

const AlertContext = React.createContext<AlertContextState>(defaultState);

export function AlertProvider({ children }: React.PropsWithChildren): React.ReactElement {
  const [state, setState] = useState<State>({ open: false, message: '' });

  const handleClose = useCallback(() => {
    setState((curr) => ({ ...curr, open: false }));
  }, []);

  const raiseAlert: (p: RaiseAlertProps) => void = useCallback(
    ({ message, severity = Severity.info }: RaiseAlertProps) => {
      // Always make sure snackbar is closed before opening a new alert
      handleClose();

      setTimeout(() => {
        let duration;
        if (severity === Severity.error) {
          duration = 10000;
        } else if (severity === Severity.warning) {
          duration = 7000;
        } else if (severity == Severity.info) {
          duration = 5000;
        } else if (severity == Severity.success) {
          duration = 3000;
        }

        setState({ open: true, message, severity, duration });
      }, 200);
    },
    [handleClose]
  );

  return (
    <AlertContext.Provider value={raiseAlert}>
      <Snackbar
        open={state.open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={state.duration}
        onClose={handleClose}
        action={
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        }
      >
        <MuiAlert onClose={handleClose} severity={state.severity} sx={{ width: '100%' }}>
          {state.message}
        </MuiAlert>
      </Snackbar>
      {children}
    </AlertContext.Provider>
  );
}

export default AlertContext;
