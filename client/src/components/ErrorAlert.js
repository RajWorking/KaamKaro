import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog({ handleClose, msg }) {
  return (
    <div>
      <Dialog
        open={Boolean(msg)}
        onClose={() => handleClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'You have encountered an ERROR!'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{msg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose() } color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
