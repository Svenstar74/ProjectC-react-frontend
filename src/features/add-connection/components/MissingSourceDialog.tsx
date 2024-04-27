import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { ISource } from "business-logic";

import { eventBus } from "../../../eventBus";
import useCreateConnection from "../hooks/useCreateConnection";
import { NewSource, Source } from "../../detail-pages/components/sources";
import { LoadingButton } from "@mui/lab";

function MissingSourceDialog() {
  const { createConnection } = useCreateConnection();

  const [open, setOpen] = useState(false);
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [matchingSources, setMatchingSources] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<ISource[]>([]);

  async function handleCreateConnection() {
    setIsLoading(true);
    await createConnection(sourceId, targetId, 'contributesTo', sources, matchingSources);

    setIsLoading(false);
    setOpen(false);
  }

  useEffect(() => {
    eventBus.on('addMissingSource', (data) => {
      setSourceId(data.startNode);
      setTargetId(data.endNode);
      setMatchingSources(data.matchingSources);
      setOpen(true);
    });
  
    return () => {
      eventBus.off('addMissingSource');
    };
  }, []);

  useEffect(() => {
    setSources([]);
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogTitle>Missing Source...</DialogTitle>

      <DialogContent>
        <DialogContentText marginBottom={5}>
          To create a 'contributes to' connection between two nodes, it
          is necessary for both nodes to have an identical source. Please
          create this source below and it will automatically be added to
          the two nodes and the connection that will be created.
        </DialogContentText>

        <NewSource onAddSource={(url, originalText) => setSources(current => [...current, { url, originalText }])} />
        {sources.map((source, index) => (
          <Source key={index} id={index.toString()} url={source.url} originalText={source.originalText} onDeleteSource={() => setSources(current => current.filter(src => src.url !== source.url && src.originalText !== source.originalText))} />
        ))}

      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <LoadingButton loading={isLoading} onClick={handleCreateConnection} disabled={sources.length === 0 || isLoading}>Create Connection</LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default MissingSourceDialog;
