import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Collapse, FormControl, IconButton, InputLabel, ListItemText, Menu, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSigma } from '@react-sigma/core';

import EditStringRepresentationDialog from './EditStringRepresentationDialog';
import { Sources } from './sources';
import ConfirmDialog from '../../../components/dialogs/ConfirmDialog';
import ReviewCorrectionChips from './ReviewCorrectionChips';
import useApiClient from '../../../components/hooks/useApiClient';
import { IClimateConceptNode, IConnection } from 'business-logic';
import { useAppSelector } from '../../../store/redux/hooks';
import { CommentAccordion } from '../../comments';
import NodeTitle from './NodeTitle';

interface Props {
  edgeId: string;
}

function EdgeDetails({ edgeId }: Props) {
  const { isLoggedIn, userName } = useAppSelector((state) => state.auth);
  const apiClient = useApiClient();
  const sigma = useSigma();

  const [expanded, setExpanded] = useState(true);
  const [openEditDialogSource, setOpenEditDialogSource] = useState(false);
  const [openEditDialogTarget, setOpenEditDialogTarget] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  function onDeleteEdge() {
    apiClient.deleteConnection(edgeId)
      .then(() => {
        sigma.getGraph().dropEdge(edgeId);
      }
    );

    setShowConfirmationModal(false);
  }

  function onRenameSourceNode(newName: string) {
    setOpenEditDialogSource(false);
    sigma.getGraph().setNodeAttribute(source.id, 'label', newName);
    setSource((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        name: newName,
      };
    });
  }

  function onRenameTargetNode(newName: string) {
    setOpenEditDialogTarget(false);
    sigma.getGraph().setNodeAttribute(target.id, 'label', newName);
    setTarget((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        name: newName,
      };
    });
  }

  // For the menu that can be opened with the three dots in the upper right corner
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  //#region Connection type
  const [connectionType, setConnectionType] = useState<'contributesTo' | 'isEqualTo' | 'isA'>();

  function changeConnectionType(event: SelectChangeEvent) {
    const value = event.target.value as 'contributesTo' | 'isEqualTo' | 'isA';
    
    apiClient.updateConnectionType(edgeId, value).then(() => {
      if (value === 'contributesTo') {
        sigma.getGraph().setEdgeAttribute(edgeId, 'type', 'arrow')
      } else if (value === 'isEqualTo') {
        sigma.getGraph().setEdgeAttribute(edgeId, 'type', 'line')
      } else if (value === 'isA') {
        sigma.getGraph().setEdgeAttribute(edgeId, 'type', 'arrow')
      }
      sigma.getGraph().setEdgeAttribute(edgeId, 'connectionType', value);
      
      sigma.refresh();
      
      setConnectionType(value);
    });
  }
  //#endregion

  //#region Get the date for the source and target of the edge
  const [connection, setConnection] = useState<IConnection>();
  const [source, setSource] = useState<IClimateConceptNode>();
  const [target, setTarget] = useState<IClimateConceptNode>();

  useEffect(() => {
    apiClient.getConnection(edgeId).then((connection) => {
      setConnection(connection);
      setConnectionType(connection.type);

      apiClient.getClimateConceptNode(connection.sourceId).then((source) => {
          setSource(source);
        });
        
      apiClient.getClimateConceptNode(connection.targetId).then((target) => {
        setTarget(target);
      });
    });
  }, [edgeId]);
  //#endregion

  // Remove the highlight from the nodes when the component is unmounted
  useEffect(() => {
    return () => {
      if (source) {
        sigma.getGraph().setNodeAttribute(source.id, 'highlighted', false);
      }

      if (target) {
        sigma.getGraph().setNodeAttribute(target.id, 'highlighted', false);
      }
    }
  }, [sigma, source, target]);

  if (!source || !target) {
    return null;
  }

  return (
    <>
      <Card
        style={{ overflowY: expanded ? 'scroll' : 'hidden' }}
        sx={{ width: '500px', maxHeight: '100vh' }}
      >
        <CardHeader
          action={
            <>
              <IconButton
                onClick={(event) => setAnchorEl(event.currentTarget)}
                style={{ top: '-4px' }}
              >
                <MoreVertIcon />
              </IconButton>

              <Menu
                open={menuOpen}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    setExpanded((prev) => !prev);
                  }}
                >
                  <ListItemText>{expanded ? 'Hide Details' : 'Show Details'}</ListItemText>
                </MenuItem>

                {isLoggedIn &&
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      setOpenEditDialogSource(true);
                    }}
                  >
                    Edit String Representation (Cause)
                  </MenuItem>
                }

                {isLoggedIn &&
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      setOpenEditDialogTarget(true);
                    }}
                  >
                    Edit String Representation (Effect)
                  </MenuItem>
                }

                {isLoggedIn &&
                  <MenuItem onClick={() => setShowConfirmationModal(true) }>
                    Delete Edge
                  </MenuItem>
                }
              </Menu>
            </>
          }
          title={
            <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr' }}>
              <div>
                <b>{connectionType === 'contributesTo' ? 'Cause' : 'Parent'}</b>
              </div>
              <NodeTitle title={source.name} />
              <div>
                <b>{connectionType === 'contributesTo' ? 'Effect' : 'Child'}</b>
              </div>
              <NodeTitle title={target.name} />
            </div>
          }
          titleTypographyProps={{ variant: 'body1' }}
          subheader={
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <div>Cause ID: {source.id} &ensp;</div>
              <div>Effect ID: {target.id}</div>
              <div>{`Created by ${connection.createdBy} on ${new Date(connection.createdAt).toLocaleString()}`}</div>
            </div>
          }
          subheaderTypographyProps={{ variant: 'body2' }}
        />
        <Collapse in={expanded} timeout='auto' unmountOnExit>
          <CardContent>

            <div style={{ display: 'block', marginBottom: 25 }}>
              <FormControl fullWidth disabled>
                <InputLabel id="connection-type-label">Connection Type</InputLabel>
                <Select
                  size="small"
                  labelId="connection-type-label"
                  value={connectionType}
                  label="Connection Type"
                  onChange={changeConnectionType}
                  disabled={!isLoggedIn}
                >
                  <MenuItem value="contributesTo">contributesTo</MenuItem>
                  <MenuItem value="isA">isA</MenuItem>
                  <MenuItem value="isEqualTo">isEqualTo</MenuItem>
                </Select>
              </FormControl>
            </div>

            <ReviewCorrectionChips endpoint='/connections' object={connection} type='connection' />

            <CommentAccordion referenceId={edgeId} userIsAuthorized={isLoggedIn} userName={userName} />

            <Sources referenceId={edgeId} />
              
          </CardContent>
        </Collapse>
      </Card>

      <EditStringRepresentationDialog
        open={openEditDialogSource}
        onClose={onRenameSourceNode}
        climateConceptId={source.id}
        current={source.name}
      />

      <EditStringRepresentationDialog
        open={openEditDialogTarget}
        onClose={onRenameTargetNode}
        climateConceptId={target.id}
        current={target.name}
      />

      <ConfirmDialog
        open={showConfirmationModal}
        onConfirm={onDeleteEdge}
        onCancel={() => setShowConfirmationModal(false)}
        title="Delete Edge"
        content="Are you sure you want to delete this edge? This action cannot be undone."
      />
    </>
  );
}

export default EdgeDetails;
