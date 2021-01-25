import { useState } from 'react';
import { YearPicker } from 'react-dropdown-date';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog({ open, close, add }) {
  const [st_year, setSt_year] = useState('----');
  const [end_year, setEnd_year] = useState('----');
  const [insti, setInsti] = useState('');

  const handleClose = () => {
    close(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Educational Instance</DialogTitle>
        <DialogContent>
          <DialogContentText>Where did you study and from when to when?</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            label="Institute"
            type="name"
            value={insti}
            fullWidth
            onChange={(val) => setInsti(val.target.value)}
          />
          from{' '}
          <YearPicker
            defaultValue={'----'}
            start={1970} // default is 1900
            end={2020} // default is current year
            reverse // default is ASCENDING
            required={true} // default is false
            value={st_year}
            onChange={(year) => {
              setSt_year(year);
            }}
          />{' '}
          to{' '}
          <YearPicker
            defaultValue={'----'}
            start={1970} // default is 1900
            end={2020} // default is current year
            reverse // default is ASCENDING
            value={end_year}
            onChange={(year) => {
              setEnd_year(year);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              add({ institute: insti, start_year: st_year, end_year: end_year });
              handleClose();
            }}
            color="secondary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
