import { useEffect, useState } from 'react';
import { useRegisterEvents, useSigma } from '@react-sigma/core';
import { Fab, Tooltip } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import { eventBus } from '../../../eventBus';
import useApiClient from '../../../components/hooks/useApiClient';
import { useAppSelector } from '../../../store/redux/hooks';
import useFindMatchingSources from '../hooks/useFindMatchingSources';

interface Props {
  hoveredNode: string | null;
  hideQab: (timeout?: number) => void;
}

function GraphEvents({ hoveredNode, hideQab }: Props) {
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();

  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const apiClient = useApiClient();
  const { findMatchingSources } = useFindMatchingSources(); 

  const [makingConnection, setMakingConnection] = useState(false);
  const [connectionType, setConnectionType] = useState<'contributesTo' | 'isEqualTo' | 'isA'>('contributesTo');
  const [startNode, setStartNode] = useState('');

  function startContributesToConnection() {
    hideQab(0);
    setConnectionType('contributesTo');
    setMakingConnection(true);
    eventBus.emit('makingConnection');
  }

  function startIsAConnection() {
    hideQab(0);
    setConnectionType('isA');
    setMakingConnection(true);
    eventBus.emit('makingConnection');
  }

  function startIsEqualToConnection() {
    hideQab(0);
    setConnectionType('isEqualTo');
    setMakingConnection(true);
    eventBus.emit('makingConnection');
  }

  async function createConnection(endNode: string) {
    let matchingSources: any[] = [];
    if (connectionType === 'contributesTo') {
      matchingSources = await findMatchingSources(startNode, endNode);
      if (matchingSources.length === 0) {
        eventBus.emit('addMissingSource', { startNode, endNode, matchingSources });
        return;
      }
    }

    try {
      const connection = await apiClient.createConnection(startNode, endNode, connectionType);
      if (connectionType === 'contributesTo') {
        matchingSources.forEach((source) => {
          apiClient.addSource(connection.id, source.url, source.originalText);
        });
      }
  
      if (connection) {
        let type = 'arrow';
        if (connectionType === 'isEqualTo') {
          type = 'line';
        }
  
        sigma.getGraph().addEdgeWithKey(connection.id, connection.sourceId, connection.targetId, { size: 2, type, connectionType: connection.type });
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    function onCancelMakingConnection() {
      setMakingConnection(false);
    }

    eventBus.on('cancelMakingConnection', onCancelMakingConnection);

    return () => {
      eventBus.off('cancelMakingConnection', onCancelMakingConnection);
    };
  }, []);

  useEffect(() => {
    registerEvents({
      downNode(e) {
        if (isNaN(+e.node)) return;

        if (makingConnection) {
          createConnection(e.node);
          setMakingConnection(false);
          eventBus.emit('connectionMade');
        }
      },
    });
  }, [sigma, registerEvents, makingConnection]);

  useEffect(() => {
    if (!makingConnection) {
      setStartNode(hoveredNode);
    }
  }, [hoveredNode, makingConnection]);

  if (!isLoggedIn) {
    return null;
  }
  
  return (
    <>
      <Tooltip title='Make contributesTo Connection'>
        <Fab
          color='primary'
          size='small'
          onClick={startContributesToConnection}
          style={{ marginRight: 10 }}
        >
          <ArrowRightAltIcon />
        </Fab>
      </Tooltip>

      <Tooltip title='Make isA Connection'>
        <Fab
          color='primary'
          size='small'
          onClick={startIsAConnection}
          style={{ marginRight: 10 }}
        >
          <ArrowRightAltIcon />
        </Fab>
      </Tooltip>

      <Tooltip title='Make isEqualTo Connection'>
        <Fab
          aria-label='add-equal-connection'
          color='primary'
          size='small'
          onClick={startIsEqualToConnection}
          style={{ marginRight: 10 }}
        >
          <SyncAltIcon />
        </Fab>
      </Tooltip>
    </>
  );
}

export default GraphEvents;
