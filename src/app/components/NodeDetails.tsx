import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Chip, Collapse, Menu, MenuItem, IconButton, ListItemText } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { AggregatedNodeModel } from '@svenstar74/business-logic';
import { useApiClient } from '../hooks/useApiClient';
import { useAppSelector } from '../store/redux/hooks';
import { EditStringRepresentationDialog } from './Dialogs/EditStringRepresentationDialog';
import { Sources } from './Sources';

export const NodeDetails = () => {
  const apiClient = useApiClient();

  // For the menu that can be opened with the three dots in the upper right corner
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [openEditDialog, setOpenEditDialog] = useState(false);

  // If the full card is shown or not
  const [expanded, setExpanded] = useState(false);

  // Information about the current node
  const selectedNode = useAppSelector((state) => state.graph.selectedNode);
  const [aggregatedNode, setAggregatedNode] = useState<AggregatedNodeModel | null>(null);

  // For the chip labels
  const [needsReview, setNeedsReview] = useState(false);
  const [needsCorrection, setNeedsCorrection] = useState(false);

  const handleReviewChipClicked = () => {
    if (aggregatedNode === null) {
      return;
    }

    apiClient.updateNodeLabel(aggregatedNode.climateConcept.id, 'NeedsReview', !needsReview);
    setNeedsReview((prev) => !prev);
  };

  const handleCorrectionChipClicked = () => {
    if (aggregatedNode === null) {
      return;
    }

    apiClient.updateNodeLabel(aggregatedNode.climateConcept.id, 'NeedsCorrection', !needsCorrection);
    setNeedsCorrection((prev) => !prev);
  };

  // Fetch the node details from the backend, everytime the selectedNode changes
  useEffect(() => {
    if (selectedNode) {
      apiClient.getNode(selectedNode.node).then((result) => {
        setAggregatedNode(result);
        if (result) {
          setNeedsReview(result.needsReview);
          setNeedsCorrection(result.needsCorrection);
        }
      });
    }
    // eslint-disable-next-line
  }, [selectedNode]);

  if (selectedNode === null || aggregatedNode === null) {
    return null;
  }

  return (
    <>
      <Card
        style={{ overflowY: expanded ? 'scroll' : 'hidden' }}
        sx={{ width: '500px', maxHeight: '100vh' }}
      >
        <CardHeader
          style={{ overflow: 'auto' }}
          action={
            <>
              <IconButton
                onClick={(event) => setAnchorEl(event.currentTarget)}
                style={{ top: '-4px' }}
              >
                <MoreVertIcon />
              </IconButton>

              <Menu
                open={open}
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
                  <ListItemText>
                    {expanded ? 'Hide Details' : 'Show Details'}
                  </ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    setOpenEditDialog(true);
                  }}
                >
                  Edit String Representation
                </MenuItem>
              </Menu>
            </>
          }
          title={selectedNode.label}
          titleTypographyProps={{ variant: 'body1' }}
          subheader={`ID ${selectedNode.node}`}
          subheaderTypographyProps={{ variant: 'body2' }}
        />

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            
            <Chip
              label="Needs Review"
              size="small"
              onClick={handleReviewChipClicked}
              style={{
                marginBottom: '25px',
                marginRight: '10px',
                background: needsReview ? '#006080' : '#eee',
                color: needsReview ? 'white' : 'black',
              }}
            />

            <Chip
              label="Needs Correction"
              size="small"
              onClick={handleCorrectionChipClicked}
              style={{
                marginBottom: '25px',
                background: needsCorrection ? '#801a00' : '#eee',
                color: needsCorrection ? 'white' : 'black',
              }}
            />

            <Sources climateConceptId={aggregatedNode.climateConcept.id} sources={aggregatedNode.climateConcept.sources} />

            {/* {/* <Accordion style={{marginTop: "20px"}}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>Connections</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle1">Is effect for</Typography>
            {aggregatedNode.climateConcept.incomingConnections.map(connection => <li>{connection}</li> )}

              
          </AccordionDetails>
        </Accordion> */}

            {/* <Accordion style={{marginTop: "20px"}}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography>Comments</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
              malesuada lacus ex, sit amet blandit leo lobortis eget.
            </Typography>
          </AccordionDetails>
        </Accordion> */}

            {/* <Accordion style={{marginTop: "20px"}}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>History</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
              malesuada lacus ex, sit amet blandit leo lobortis eget.
            </Typography>
          </AccordionDetails>
        </Accordion> */}
          </CardContent>
        </Collapse>
      </Card>

      <EditStringRepresentationDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        climateConceptId={aggregatedNode.climateConcept.id}
        current={aggregatedNode.climateConcept.stringRepresentation}
        id={2}
      />
    </>
  );
};
