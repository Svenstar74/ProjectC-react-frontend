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
import { ConnectedClimateConceptSearch } from '../../search';
import { ToggleViewOfGroupedNodes } from '../../toggle-view-of-grouped-nodes';
import { SelectTool } from '../../select-tool';
import ShowIsolatedNodesButton from '../../show-isolated-nodes';
import MissingSourceDialog from '../../add-connection/components/MissingSourceDialog';
import { TestButton } from 'src/features/admin';

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
  
  return (
    <SigmaContainer
      settings={{
        defaultEdgeType: 'arrow',
        labelSize: 2.5,
      }}
      style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
    >
      <TestButton />

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
        <ConnectedClimateConceptSearch />
      </ControlsContainer>

      {/* {!isFullscreen && (
        <HamburgerMenu>
          <DownloadGraphAsCsv onClick={() => {}} />
        </HamburgerMenu>
      )} */}

      {/* <GetHelpButton /> */}
      <MissingSourceDialog />
      <ShowIsolatedNodesButton />
    </SigmaContainer>
  );
}

export default DisplayGraph;
