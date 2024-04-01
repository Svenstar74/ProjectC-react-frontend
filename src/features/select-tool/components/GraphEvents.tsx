import { useEffect, useState } from 'react';
import { Fab, Tooltip } from '@mui/material';
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import { useRegisterEvents, useSigma } from '@react-sigma/core';

import { ConnectionUseCases, IClimateConceptNode, INode, NodeUseCases } from 'business-logic';
import { useAppSelector } from '../../../store/redux/hooks';
import useApiClient from '../../../components/hooks/useApiClient';

function GraphEvents() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const groupedView = useAppSelector((state) => state.graph.groupedView);
  
  const apiClient = useApiClient();
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();

  const [isUsingSelectTool, setIsUsingSelectTool] = useState(false);

  const canvas = sigma.getCanvases().mouse;
  const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

  let selectedNodes: INode[] = [];

  let dragActive = false;
  let dragStart = { x: 0, y: 0 };

  let selectionActive = false;

  let selectionStartViewX = 0;
  let selectionStartViewY = 0;

  let selectionEndViewX = 0;
  let selectionEndViewY = 0;

  let selectionStartGraphX = 0;
  let selectionStartGraphY = 0;

  useEffect(() => {
    registerEvents({
      enterNode() {
        if (!isUsingSelectTool) {
          return;
        }
        
        canvas.style.cursor = 'grab';
      },
      leaveNode() {
        if (!isUsingSelectTool) {
          return;
        }
        
        if (!dragActive) {
          canvas.style.cursor = 'default';
        }
      },
      downNode(e) {
        if (!isUsingSelectTool) {
          return;
        }

        if (e.event.original.button === 0) {
          dragActive = true;
          dragStart = sigma.viewportToGraph(e.event);
        }
      },
      mousedown(event) {
        if (!isUsingSelectTool) {
          return;
        }

        if (!dragActive && event.original.button === 0) {
          selectionActive = true;

          sigma.getGraph().forEachNode((node) => {
            sigma.getGraph().setNodeAttribute(node, 'highlighted', false);
          });

          selectionStartViewX = event.original.x;
          selectionStartViewY = event.original.y;

          const graphCoordinates = sigma.viewportToGraph(event);
          selectionStartGraphX = graphCoordinates.x;
          selectionStartGraphY = graphCoordinates.y;
        }
      },
      mouseup(event) {
        if (!isUsingSelectTool) {
          return;
        }

        if (dragActive) {
          sigma.getGraph().forEachNode((node) => {
            sigma.getGraph().setNodeAttribute(node, 'highlighted', false);
          });
        }

        if (dragActive) {
          const coords = sigma.viewportToGraph(event);
          const dx = coords.x - dragStart.x;
          const dy =  coords.y - dragStart.y;

          selectedNodes.forEach((node) => {
            const attributes = sigma.getGraph().getNodeAttributes(node.id);

            if (attributes.size === 5) {
              const connections = sigma.getGraph().edges().map(edgeId => {
                return {
                  id: edgeId,
                  sourceId: sigma.getGraph().source(edgeId),
                  targetId: sigma.getGraph().target(edgeId),
                  type: sigma.getGraph().getEdgeAttribute(edgeId, 'connectionType'),
                  createdAt: '',
                  createdBy: '',
                  sources: [],
                  needsCorrection: false,
                  needsReview: false,
                  isReviewed: false,
                };
              });

              const foundNodeId = sigma.getGraph().findNode(node => {
                const nodeAttributes = sigma.getGraph().getNodeAttributes(node);
                return nodeAttributes.x === attributes.x && nodeAttributes.y === attributes.y;
              })

              const groupedNodes = ConnectionUseCases.getAllSummaryNodesWithConnections(connections).groupedNodes;
              const foundGroup = groupedNodes.find(group => group.some(obj => obj.id === foundNodeId));

              if (foundGroup) {
                foundGroup.forEach((node) => {
                  if (node.id === foundNodeId) {
                    return;
                  }
                  
                  const startX = sigma.getGraph().getNodeAttribute(node.id, 'x');
                  const startY = sigma.getGraph().getNodeAttribute(node.id, 'y');

                  sigma.getGraph().setNodeAttribute(node.id, 'x', startX + dx);
                  sigma.getGraph().setNodeAttribute(node.id, 'y', startY + dy);
                  
                  apiClient.updateClimateConceptNodePosition(node.id, startX + dx, startY + dy);
                });
              }
            } else {
              apiClient.updateClimateConceptNodePosition(
                node.id,
                attributes.x,
                attributes.y
              );
            }
          });
        }

        if (event.original.button === 0) {
          selectionActive = false;
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);

          const listOfNodes: IClimateConceptNode[] = [];
          sigma.getGraph().forEachNode((node) => {
            const attributes = sigma.getGraph().getNodeAttributes(node);
            listOfNodes.push({
              x: attributes.x,
              y: attributes.y,
              id: node,
              name: attributes.label,

              // TODO: Irrelevant for the selection, just set to false.
              // Could refactor the selection tool to take a different list.
              needsReview: false,
              needsCorrection: false,
              isReviewed: false,
              createdAt: '',
              createdBy: '',
            });
          });

          if (!dragActive) {
            const graphCoordinates = sigma.viewportToGraph(event);

            selectedNodes = NodeUseCases.rectangularSelection(
              [selectionStartGraphX, selectionStartGraphY],
              [graphCoordinates.x, graphCoordinates.y],
              listOfNodes
            );
            selectedNodes.forEach((node) => {
              sigma.getGraph().setNodeAttribute(node.id, 'highlighted', true);
            });
          }

          dragActive = false;
        }
      },
      mousemove(e) {
        if (!isUsingSelectTool) {
          return;
        }

        // Don't move with mouse click
        e.preventSigmaDefault();

        if (!dragActive && selectionActive) {
          selectionEndViewX = e.original.x;
          selectionEndViewY = e.original.y;

          const start = {
            x: Math.min(selectionStartViewX, selectionEndViewX),
            y: Math.min(selectionStartViewY, selectionEndViewY),
          };
          const end = {
            x: Math.max(selectionStartViewX, selectionEndViewX),
            y: Math.max(selectionStartViewY, selectionEndViewY),
          };

          const width = end.x - start.x;
          const height = end.y - start.y;

          canvasContext.clearRect(0, 0, canvas.width, canvas.height);
          canvasContext.strokeRect(start.x, start.y, width, height);
        }

        if (dragActive) {
          const coords = sigma.viewportToGraph(e);

          const deltaX = coords.x - dragStart.x;
          const deltaY = coords.y - dragStart.y;

          selectedNodes.forEach((node) => {
            sigma.getGraph().setNodeAttribute(node.id, 'x', node.x + deltaX);
            sigma.getGraph().setNodeAttribute(node.id, 'y', node.y + deltaY);
          });
        }
      },
    });
    // eslint-disable-next-line
  }, [registerEvents, sigma, isUsingSelectTool]);

  useEffect(() => {
    if (groupedView) {
      setIsUsingSelectTool(false);
      dragActive = false;
      selectionActive = false;
      selectedNodes = [];
      sigma.getGraph().forEachNode((node) => {
        sigma.getGraph().setNodeAttribute(node, 'highlighted', false);
      });
    }
  }, [groupedView]);

  if (!isLoggedIn) {
    return null;
  }
  
  return (
    <div style={{ position: 'absolute', right: 10, top: 200 }}>
      <Tooltip title='Rectangular Selection'>
        <Fab
          size='small'
          style={{
            background: isUsingSelectTool ? 'lightgrey' : 'white',
            border: isUsingSelectTool ? '1px solid black' : 'none'
          }}
          onClick={() => setIsUsingSelectTool((prev) => !prev)}
        >
          <HighlightAltIcon />
        </Fab>
      </Tooltip>
    </div>
  );
}

export default GraphEvents;
