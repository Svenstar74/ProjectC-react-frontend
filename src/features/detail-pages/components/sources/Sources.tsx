import { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, List, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import NewSource from './NewSource';
import Source from './Source';
import useApiClient from '../../../../components/hooks/useApiClient';
import { useAppSelector } from '../../../../store/redux/hooks';
import { captureMessage } from '@sentry/react';

interface Props {
  referenceId: string;
}

function Sources({ referenceId }: Props) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const apiClient = useApiClient();

  const [sourceList, setSourceList] = useState([]);
  const [showNewSource, setShowNewSource] = useState(false);

  function addSource(url: string, originalText: string) {
    if (url === '' || originalText === '') {
      return;
    }

    apiClient.addSource(referenceId, url, originalText)
      .then(() => {
        setSourceList((current) => [...current, { url, originalText }]);
      });
        
    setShowNewSource(false);
  }

  function deleteSource(
    climateConceptId: string,
    url: string,
    originalText: string,
  ) {
    apiClient.deleteSource(climateConceptId, url, originalText);

    setSourceList((current) =>
      current.filter(
        (source) => source.url !== url && source.originalText !== originalText
      )
    );
  }

  if (sourceList === undefined) {
    captureMessage('sourceList is undefined for id ' + referenceId);
  }

  useEffect(() => {
    apiClient.getSources(referenceId)
      .then((sources) => setSourceList(sources)
      );
  }, [referenceId]);

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

        <List dense>
          {sourceList !== undefined &&  sourceList.map((source) => (
            <Source
              key={source.url + source.originalText}
              id={referenceId}
              url={source.url}
              originalText={source.originalText}
              onDeleteSource={deleteSource}
            />
          ))}
        </List>
        
      </AccordionDetails>
    </Accordion>
  );
};

export default Sources;
