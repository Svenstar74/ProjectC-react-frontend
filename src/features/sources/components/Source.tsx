import { useState } from 'react';
import { IconButton, TextField, Tooltip } from '@mui/material';
import { ContentCopy, Delete, Launch } from '@mui/icons-material';

import { useToastMessage } from 'src/shared';
import ConfirmDialog from 'src/components/dialogs/ConfirmDialog';
import { useAppSelector } from 'src/store/redux/hooks';

interface Props {
  id: string;
  url: string;
  originalText: string;
  onDeleteSource: (id: string) => void;
}

function Source({ id, url, originalText, onDeleteSource }: Props) {
  const { showToast } = useToastMessage();

  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  function confirmDeleteSource() {
    setShowConfirmDialog(false);
    onDeleteSource(id)
  }

  function copySource() {
    navigator.clipboard.writeText(JSON.stringify({ url, originalText }));
    showToast('Source copied to clipboard');
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
                <Launch />
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

        {isLoggedIn &&
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
            <Tooltip title="Delete Source">
              <span>
                <IconButton onClick={() => setShowConfirmDialog(true)}>
                  <Delete />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Copy Source">
              <span>
                <IconButton onClick={copySource}>
                  <ContentCopy />
                </IconButton>
              </span>
            </Tooltip>
          </div>
        }
      </div>

      <ConfirmDialog
        open={showConfirmDialog}
        onCancel={() => setShowConfirmDialog(false)}
        onConfirm={confirmDeleteSource}
        content={
          <>
            <span>Are you sure you want to delete this source?</span><br/>
            <span>This action cannot be undone.</span>
          </>
        }
        confirmBtnText="Yes"
      />
    </>
  );
};

export default Source;
