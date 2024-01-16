import '@react-sigma/core/lib/react-sigma.min.css';
import { ControlsContainer, FullScreenControl, SigmaContainer, ZoomControl } from '@react-sigma/core';

import LoadGraphFromMongoDb from './LoadGraphFromMongoDb';

// import HamburgerMenu from './containers/HamburgerMenu/HamburgerMenu';
import QuickAccessBar from '../../../components/containers/QuickAccessBar/GraphEvents';

import { CreateClimateConceptNode } from '../../create-new-node/components';
import { DeleteEdge } from '../../delete-edge';

import { DragAndDrop } from '../../drag-and-drop';
import { LoginIcon } from '../../auth';
import { AddConnection, Snackbar as AddConnectionSnackbar } from '../../add-connection';
import { DetailPages } from '../../detail-pages';
import { ToggleViewEdgeTypes } from '../../toggle-view-of-edge-types';
import ResponsiveLabelSize from './ResponsiveLabelSize';
import DoubleClickStageBehavior from './DoubleClickStageBehavior';
import { Searchbar } from '../../search';
import { ToggleViewOfGroupedNodes } from '../../toggle-view-of-grouped-nodes';
import { SelectTool } from '../../select-tool';
import ShowIsolatedNodesButton from '../../show-isolated-nodes';
import { useEffect, useState } from 'react';
import { eventBus } from '../../../eventBus';
import ErrorDialog from '../../add-connection/components/ErrorDialog';

function DisplayGraph() {  
  //#region Fullscreen handling
  // const [isFullscreen, setIsFullscreen] = useState(false);

  // useEffect(() => {
  //   const handleFullscreenChange = () => {
  //     setIsFullscreen(Boolean(
  //       document.fullscreenElement
  //     ));
  //   };

  //   document.addEventListener('fullscreenchange', handleFullscreenChange);
  //   document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

  //   return () => {
  //     document.removeEventListener('fullscreenchange', handleFullscreenChange);
  //     document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
  //   };
  // }, []);
  //#endregion

  const [showErrorDialog, setShowErrorDialog] = useState(false);

  useEffect(() => {
    eventBus.on('showErrorDialog', () => {
      setShowErrorDialog(true);
    });

    return () => {
      eventBus.off('showErrorDialog');
    };
  }, []);
  
  return (
    <SigmaContainer
      settings={{
        defaultEdgeType: 'arrow',
        labelSize: 2.5,
      }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <ControlsContainer position="top-right">
        <ZoomControl />
        <FullScreenControl />
      </ControlsContainer>

      <LoadGraphFromMongoDb />

      <QuickAccessBar>
        <AddConnection hoveredNode='' hideQab={() => {}} />
      </QuickAccessBar>

      <AddConnectionSnackbar />

      <LoginIcon />

      <ResponsiveLabelSize />
      <DoubleClickStageBehavior />

      <DragAndDrop />

      <ToggleViewEdgeTypes />
      <ToggleViewOfGroupedNodes />
      <DetailPages />

      <SelectTool />

      <CreateClimateConceptNode />
      <DeleteEdge />

      <ControlsContainer position="bottom-right" style={{ border: 'none' }}>
        <Searchbar />
      </ControlsContainer>

      {/* {!isFullscreen && (
        <HamburgerMenu>
          <DownloadGraphAsCsv onClick={() => {}} />
        </HamburgerMenu>
      )} */}

      {/* <GetHelpButton /> */}
      <ErrorDialog open={showErrorDialog} onClose={() => setShowErrorDialog(false)} />
      <ShowIsolatedNodesButton />
    </SigmaContainer>
  );
}

export default DisplayGraph;
