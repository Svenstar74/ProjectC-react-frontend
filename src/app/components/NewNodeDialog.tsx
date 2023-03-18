import { FC, useContext, useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, TextField } from '@mui/material';
import { StringRepresentation } from '@svenstar74/business-logic';
import { useApiClient } from '../hooks/useApiClient';
import { AppContext } from '../store/context/AppContext';

interface Props {
  open: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

export const NewNodeDialog: FC<Props> = ({ open, onClose, position }) => {
  const apiClient = useApiClient();
  const { globalSigmaInstance } = useContext(AppContext);

  const [error, setError] = useState('');

  const [currentChangeDirection, setCurrentChangeDirection] = useState('decrease');
  const [currentTypeOf, setCurrentTypeOf] = useState('');
  const [currentBase, setCurrentBase] = useState('');
  const [currentAspectChanging, setCurrentAspectChanging] = useState('');

  const submitDisabled = (): boolean => {
    if (currentChangeDirection === '') {
      return true;
    }

    if (currentBase === '') {
      return true;
    }

    if (currentAspectChanging === '') {
      return true;
    }

    const string = `${currentChangeDirection}_${currentTypeOf}_${currentBase}_${currentAspectChanging}`;
    if (!StringRepresentation.isParsable(string)) {
      return true;
    }

    return false;
  };

  const submitForm = async () => {
    const string = `${currentChangeDirection}_${currentTypeOf}_${currentBase}_${currentAspectChanging}`;
    const stringRepresentation = StringRepresentation.parse(string).toString();
    const nodePosition = globalSigmaInstance!.viewportToGraph(position);
    const result = await apiClient.addNode(
      stringRepresentation,
      nodePosition.x,
      nodePosition.y
    );
    if (result === 200) {
      onClose();
    } else {
      setError('Error while creating the node.');
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add New Node</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ marginBottom: '20px' }}>
            Enter the individual components for the string representation of the
            new node. It will be positioned at the place where you opened the
            menu.
            <br />
            Note: You cannot use underscores '_'
          </DialogContentText>

          {/* Change Direction */}
          <Select
            required
            label="Change Direction"
            fullWidth
            variant="standard"
            defaultValue="decrease"
            onChange={(event) => setCurrentChangeDirection(event.target.value)}
            style={{ marginBottom: '20px' }}
          >
            <MenuItem value="increase">increase</MenuItem>
            <MenuItem value="decrease">decrease</MenuItem>
          </Select>
          <TextField
            autoFocus
            label="Type of"
            fullWidth
            variant="standard"
            helperText="Use commas to seperate multiple values"
            onChange={(event) => setCurrentTypeOf(event.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <TextField
            required
            label="Base"
            fullWidth
            variant="standard"
            onChange={(event) => setCurrentBase(event.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <TextField
            required
            label="Aspect Changing"
            fullWidth
            variant="standard"
            onChange={(event) => setCurrentAspectChanging(event.target.value)}
            style={{ marginBottom: '20px' }}
          />

          {error !== '' && <Alert severity="error">{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button disabled={submitDisabled()} onClick={submitForm}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
