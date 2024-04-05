import { Fab, Tooltip } from "@mui/material";
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import { useSigma } from "@react-sigma/core";
import { useState } from "react";
import { allSimplePaths } from 'graphology-simple-path';

function ShowIsolatedNodesButton() {
  const sigma = useSigma();
  const [showIsolatedNodes, setShowIsolatedNodes] = useState(false);

  function switchView() {
    const gasEmissionsNodeId = '724883391';

    if (showIsolatedNodes) {
        setShowIsolatedNodes(false);
        sigma.getGraph().forEachEdge((edge) => {
          sigma.getGraph().setEdgeAttribute(edge, 'hidden', false);
        });
        sigma.setSetting('nodeReducer', null);
        return;
    } else {
      sigma.getGraph().forEachEdge((edge) => {
        sigma.getGraph().setEdgeAttribute(edge, 'hidden', true);
      });

      const paths: Map<string, string[][]> = new Map();

      const graph = sigma.getGraph().copy();
      graph.forEachEdge((edge) => {
        const attributes = graph.getEdgeAttributes(edge);
        if (attributes.connectionType === 'isA') {
          graph.dropEdge(edge);
        }
      });

      graph.forEachNode((node) => {
        const pathsToNode = allSimplePaths(graph, gasEmissionsNodeId, node);
        paths.set(node, pathsToNode);
      });

      sigma.setSetting('nodeReducer', (node, data) => {
        if (node === gasEmissionsNodeId) {
          return data;
        }

        const pathsForNode = paths.get(node);

        if (pathsForNode.length === 0) {
          data.size = 5;
          data.color = '#f00';
          return data;
        }

        data.color = '#aaa';
        return data;
      })

      setShowIsolatedNodes(true);
    }
  }

  return (
    <div style={{ position: 'absolute', right: 50, top: 120 }}>
      <Tooltip title="Show isolated nodes">
        <Fab size='small' style={{ background: 'white' }} onClick={switchView}>
          <ScatterPlotIcon />
        </Fab>
      </Tooltip>
    </div>
  );
}

export default ShowIsolatedNodesButton;
