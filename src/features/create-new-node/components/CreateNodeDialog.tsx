import { useEffect, useState } from 'react';
import { useSigma } from '@react-sigma/core';
import { Dialog, DialogTitle, Stepper, Step, StepLabel, IconButton, DialogContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import NameStepperContent from './NameStepperContent';
import SourceStepperContent from './SourceStepperContent';
import { useCreateNode } from '../hooks';
import { useAppSelector } from '../../../store/redux/hooks';
import { addSource } from 'src/features/sources/api';

interface Props {
  open: boolean;
  clickPosition: { x: number; y: number };
  onClose: () => void;
}

function CreateNodeDialog({ open, clickPosition, onClose }: Props) {
  const sigma = useSigma();
  const userName = useAppSelector((state) => state.auth.userName);

  const { createNode } = useCreateNode();

  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState('');

  function nameChosenHandler(name: string) {
    setName(name);
    setActiveStep(1);
  }

  async function createNodeHandler(sources: { url: string; originalText: string }[]) {
    const nodePosition = sigma.viewportToGraph(clickPosition)

    const { data } = await createNode({
      x: nodePosition.x,
      y: nodePosition.y,
      name,
      createdBy: userName,
    })

    sources.forEach(async (source) => {
      addSource(data.id, source.url, source.originalText, userName);
    });

    onClose();
  }

  useEffect(() => {
    setActiveStep(0);
    setName('');
  }, [open])

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Create Node</DialogTitle>
      <IconButton onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Stepper activeStep={activeStep}>
          <Step>
            <StepLabel>Choose a name</StepLabel>
          </Step>
          <Step>
            <StepLabel>Add sources</StepLabel>
          </Step>
        </Stepper>
      </DialogContent>

      {activeStep === 0 && <NameStepperContent onClose={onClose} onNameChosen={nameChosenHandler} />}
      {activeStep === 1 && <SourceStepperContent onBack={() => setActiveStep(0)} onCreateNode={createNodeHandler} />}
    </Dialog>
  );
}

export default CreateNodeDialog;
