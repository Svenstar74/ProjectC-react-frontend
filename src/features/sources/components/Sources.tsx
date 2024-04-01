import { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, List, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useAppSelector } from 'src/store/redux/hooks';
import NewSource from './NewSource';
import Source from './Source';
import { useAddSource, useDeleteSource, useFetchSources } from '../hooks';

interface Props {
  referenceId: string;
}

function Sources({ referenceId }: Props) {
  const { isLoggedIn, userName } = useAppSelector((state) => state.auth);

  const { data } = useFetchSources(referenceId);
  const addSourceMutation = useAddSource(referenceId);
  const deleteSourceMutation = useDeleteSource(referenceId);

  const [showNewSource, setShowNewSource] = useState(false);

  function addSource(url: string, originalText: string) {
    if (url === '' || originalText === '') {
      return;
    }

    addSourceMutation.mutate(
      {
        referenceId,
        url,
        originalText,
        createdBy: userName,
      },
    );
        
    setShowNewSource(false);
  }

  function deleteSource(id: string) {
    deleteSourceMutation.mutate(id);
  }

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Sources</Typography>
      </AccordionSummary>
      <AccordionDetails>

        {isLoggedIn &&
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setShowNewSource((prev) => !prev)}
          >
            Add new Source
          </Button>
        }

        {showNewSource && <NewSource onAddSource={addSource} />}

        {data && <List dense>
          {data.map((source) => (
            <Source
              key={source.id}
              id={source.id}
              url={source.url}
              originalText={source.originalText}
              onDeleteSource={deleteSource}
            />
          ))}
        </List>}
        
      </AccordionDetails>
    </Accordion>
  );
};

export default Sources;
