import { useState } from 'react';
import { Edit, Delete } from '@mui/icons-material';

import { IconToolbarContainer, IconToolbarItem } from 'src/shared';
import UpdateCommentForm from './UpdateCommentForm';

interface Props {
  referenceId: string;
  id: string;
  text: string;
  createdBy: string;
  createdAt: Date;
  userIsAuthorized: boolean;
  onDelete: (id: string) => void;
}

function SingleComment({ referenceId, id, text, createdBy, createdAt, userIsAuthorized, onDelete }: Props) {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);

  const showToolbar = userIsAuthorized && hovered && !editing;
  const paragraphs = text.split('\n');

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative' }}
    >
      <div>
        <span style={{ fontWeight: 'bold', fontSize: 12 }}>{createdBy} &ensp;</span>
        <span style={{ fontSize: 12 }}>{createdAt ? new Date(createdAt).toLocaleString() : 'Now'}</span>
      </div>

      {editing && <UpdateCommentForm referenceId={referenceId} id={id} initialText={text} onFinish={() => setEditing(false)} />}

      {!editing && paragraphs.map((paragraph, i) => paragraph !== '' ? <p key={i} style={{ margin: 0 }}>{paragraph}</p> : <p></p>)}

      <IconToolbarContainer style={{ opacity: showToolbar ? 1 : 0, visibility: showToolbar ? 'visible' : 'hidden' }}>
        <IconToolbarItem
          icon={<Edit />}
          tooltip='Edit Comment'
          onClick={() => setEditing(true)}
          style={{ marginRight: 10 }}
        />
        <IconToolbarItem
          icon={<Delete />}
          tooltip='Delete Comment'
          onClick={() => onDelete(id)}
        />
      </IconToolbarContainer>
    </div>
  );
}

export default SingleComment;
