import { FC, useState } from 'react';
import { IconButton, TextField, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface Props {
  onAddSource: (url: string, originalText: string) => void;
}

export const NewSource: FC<Props> = ({ onAddSource }) => {
  const [url, setUrl] = useState('');
  const [originalText, setOriginalText] = useState('');

  function addSource() {
    setUrl('');
    setOriginalText('');

    onAddSource(url, originalText);
  }

  return (
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
        style={{ verticalAlign: 'middle', marginBottom: '20px' }}
        onChange={(event) => setUrl(event.target.value)}
      />

      <TextField
        fullWidth
        multiline
        variant="outlined"
        label="Original Text"
        onChange={(event) => setOriginalText(event.target.value)}
      />

      <Tooltip title="Add Source" style={{ float: 'right' }}>
        <span>
          <IconButton disabled={url === '' || originalText === ''}>
            <AddIcon onClick={addSource} />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
};