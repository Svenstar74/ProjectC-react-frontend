import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Button, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import { NewSource, Source } from "src/features/sources";

interface Props {
  onBack: () => void;
  onCreateNode: (sources: { url: string; originalText: string; }[]) => void;
}

function SourceStepperContent({ onBack, onCreateNode }: Props) {
  const [sources, setSources] = useState<{ url: string; originalText: string; }[]>([]);

  return (
    <>
      <DialogContent>
        <DialogContentText>
          Add at least one source to the node.
        </DialogContentText>

        <NewSource onAddSource={(url, originalText) => setSources(current => [...current, { url, originalText }])} />
        {sources.map((source, index) => (
          <Source key={index} id={index.toString()} url={source.url} originalText={source.originalText} onDeleteSource={() => setSources(current => current.filter(src => src.url !== source.url && src.originalText !== source.originalText))} />
        ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={onBack}>Back</Button>
        <LoadingButton disabled={sources.length === 0} onClick={() => onCreateNode(sources)}>Create Node</LoadingButton>
      </DialogActions>
    </>
  );
}

export default SourceStepperContent;
