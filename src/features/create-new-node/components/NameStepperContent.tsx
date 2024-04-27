import { useEffect, useState } from "react";
import { Alert, Button, Collapse, DialogActions, DialogContent, DialogContentText, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useFindSimilarName } from "../hooks";
import { useCenterNode } from "../../center-node";

interface Props {
  onClose: () => void;
  onNameChosen: (name: string) => void;
}

function NameStepperContent({ onClose, onNameChosen }: Props) {
  const { centerNodeByName } = useCenterNode();
  const { findSimilarName, isPending, data } = useFindSimilarName();

  const [nameValidated, setNameValidated] = useState(false);

  const [changeDirection, setChangeDirection] = useState('decrease');
  const [typeOf, setTypeOf] = useState('');
  const [base, setBase] = useState('');
  const [aspectChanging, setAspectChanging] = useState('');

  function verifyName() {
    findSimilarName({
      name: `${changeDirection}_${typeOf}_${base}_${aspectChanging}`,
    },
    {
      onSuccess: () => setNameValidated(true)
    });
  }

  function showNodeHandler() {
    onClose();
    centerNodeByName(data.data.similarNames[0].name);
  }

  useEffect(() => {
    setChangeDirection('decrease');
    setTypeOf('');
    setBase('');
    setAspectChanging('');
  }, [open]);

  return (
    <>
      <DialogContent>
        <DialogContentText style={{ marginBottom: 20 }}>
          Enter the individual components for the string representation of the new node. It will be
          positioned at the place where you opened the menu.
          <br />
          <Typography variant='caption'>Note: You cannot use underscores '_'</Typography>
        </DialogContentText>

        {/* Change Direction */}
        <FormControl required fullWidth variant='standard' style={{ marginBottom: 20 }}>
          <InputLabel id='change-direction-label'>Change Direction</InputLabel>
          <Select
            labelId='change-direction-label'
            defaultValue='decrease'
            onChange={(event) => setChangeDirection(event.target.value)}
            value={changeDirection}
          >
            <MenuItem value='increase'>increase</MenuItem>
            <MenuItem value='decrease'>decrease</MenuItem>
          </Select>
        </FormControl>

        {/* Type Of */}
        <TextField
          autoFocus
          fullWidth
          variant='standard'
          label='Type of'
          helperText='Use commas to seperate multiple values'
          onChange={(event) => setTypeOf(event.target.value)}
          value={typeOf}
          style={{ marginBottom: '20px' }}
        />

        {/* Base */}
        <TextField
          required
          fullWidth
          variant='standard'
          label='Base'
          onChange={(event) => setBase(event.target.value)}
          value={base}
          style={{ marginBottom: '20px' }}
        />

        {/* Aspect Changing */}
        <TextField
          required
          fullWidth
          variant='standard'
          label='Aspect Changing'
          onChange={(event) => setAspectChanging(event.target.value)}
          value={aspectChanging}
        />

        <Collapse in={data ? data.data.exists : false}>
          <Alert
            severity='error'
            style={{ marginTop: 20 }}
            action={
              <Button color='inherit' size='small' onClick={showNodeHandler}>
                Show Node
              </Button>
            }
          >
            A node with this name already exists
          </Alert>
        </Collapse>

        <Collapse in={data ? !data.data.exists && data.data.similarNames[0].similarity > 0.7 : false}>
          <Alert
            severity='info'
            style={{ marginTop: 20 }}
            action={
              <Button color='inherit' size='small' onClick={showNodeHandler}>
                Show Node
              </Button>
            }
          >
            A node with a very similar name exists: <br />
            Name: {data?.data.similarNames[0].name} <br />
            {/* Similarity: {data?.data.similarName.similarity * 100}% <br /> */}
          </Alert>
        </Collapse>
      </DialogContent>

      <DialogActions>
        <LoadingButton disabled={base === '' || aspectChanging === ''} loading={isPending} onClick={verifyName}>Verify Name</LoadingButton>
        {nameValidated && data && !data.data.exists && <Button onClick={() => onNameChosen(`${changeDirection}_${typeOf}_${base}_${aspectChanging}`)}>Next</Button>}
      </DialogActions>
    </>
  );
}

export default NameStepperContent;
