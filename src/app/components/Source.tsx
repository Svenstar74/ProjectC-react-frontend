import { FC, useState } from 'react';
import { IconButton, TextField, Tooltip } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from './Dialogs/ConfirmDialog';

interface Props {
  climateConceptId: string;
  url: string;
  originalText: string;
  onDeleteSource: (
    climateConceptId: string,
    url: string,
    originalText: string
  ) => void;
}

export const Source: FC<Props> = ({
  climateConceptId,
  url,
  originalText,
  onDeleteSource,
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  function confirmDeleteSource() {
    setShowConfirmDialog(false);
    onDeleteSource(climateConceptId, url, originalText)
  }
  
  return (
    <>
      <div
        style={{
          marginBottom: '30px',
          padding: '20px 10px',
          paddingBottom: '50px',
          border: '1px solid lightgray',
          borderRadius: '5px',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          label="Link"
          value={url}
          style={{ verticalAlign: 'middle', marginBottom: '20px' }}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <IconButton onClick={() => window.open(url, '_blank', 'noreferrer')} style={{ marginLeft: '20px' }}>
                <LaunchIcon />
              </IconButton>
            ),
          }}
        />

        <TextField
          fullWidth
          multiline
          variant="outlined"
          label="Original Text"
          value={originalText}
          InputProps={{
            readOnly: true,
          }}
        />

        <Tooltip title="Delete Source" style={{ float: 'right' }}>
          <IconButton onClick={() => setShowConfirmDialog(true)}>
            <DeleteIcon/>
          </IconButton>
        </Tooltip>
      </div>

      <ConfirmDialog
        open={showConfirmDialog}
        onCancel={() => setShowConfirmDialog(false)}
        onConfirm={confirmDeleteSource}
        content={
          <>
            <div>Are you sure you want to delete this source?</div>
            <div>This action cannot be undone.</div>
          </>
        }
        confirmBtnText="Yes"
      />
    </>
  );
};
