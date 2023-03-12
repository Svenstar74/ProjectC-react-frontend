import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, TextField } from "@mui/material";
import { StringRepresentation } from "@svenstar74/business-logic";
import { useContext, useState } from "react";
import { useApiClient } from "../hooks/useApiClient";
import { AppContext } from "../store/context/AppContext";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { hideNewNodeDialog } from "../store/uiSlice";
import classes from './NewNodeDialog.module.css';

export const NewNodeDialog = ({ open }: { open: boolean }) => {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();
  const appContext = useContext(AppContext);
  

  const contextMenuPosition = useAppSelector(state => state.ui.contextMenuPosition);

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
    
    try {
      StringRepresentation.parse(`${currentChangeDirection}_${currentTypeOf}_${currentBase}_${currentAspectChanging}`)
    } catch (error) {
      console.log(error)
      return true;
    }
    
    return false;
  }
  
  const submitForm = async () => {
    const string = StringRepresentation.parse(`${currentChangeDirection}_${currentTypeOf}_${currentBase}_${currentAspectChanging}`).toString();
    const nodePosition = appContext.globalSigmaInstance!.viewportToGraph({x: contextMenuPosition[0], y: contextMenuPosition[1]});
    const result = await apiClient.addNode(string,nodePosition.x, nodePosition.y);
    if (result === 200) {
      dispatch(hideNewNodeDialog());
    } else {
      setError('Error while creating the node.')
    }
  }
  
  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Add New Node</DialogTitle>
        <DialogContent>
          <DialogContentText style={{marginBottom: '20px'}}>
            Enter the individual components for the string representation of the new node. It will be positioned at the place where you opened the menu.
            <br />
            Note: You cannot use underscores '_'
          </DialogContentText>
          <Select
            required
            className={classes.inputField}
            label="Change Direction"
            margin="dense"
            fullWidth
            variant="standard"
            defaultValue='decrease'
            onChange={(event) => setCurrentChangeDirection(event.target.value)}
          >
            <MenuItem value='increase'>increase</MenuItem>
            <MenuItem value='decrease'>decrease</MenuItem>
          </Select>
          <TextField
            className={classes.inputField}
            autoFocus
            label="Type of"
            margin="dense"
            fullWidth
            variant="standard"
            helperText="Use commas to seperate multiple values"
            onChange={(event) => setCurrentTypeOf(event.target.value)}
          />
          <TextField
            required
            className={classes.inputField}
            label="Base"
            margin="dense"
            fullWidth
            variant="standard"
            onChange={(event) => setCurrentBase(event.target.value)}
          />
          <TextField
            required
            className={classes.inputField}
            label="Aspect Changing"
            margin="dense"
            fullWidth
            variant="standard"
            onChange={(event) => setCurrentAspectChanging(event.target.value)}
          />

          {error !== '' && <Alert severity='error'>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(hideNewNodeDialog())}>Cancel</Button>
          <Button disabled={submitDisabled()} onClick={submitForm}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}