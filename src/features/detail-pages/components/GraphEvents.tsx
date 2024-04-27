import { useEffect, useState } from 'react';
import { useRegisterEvents, useSigma } from '@react-sigma/core';

import { ValidatableUseCases } from 'business-logic';

import ClimateConceptNodeDetails from './ClimateConceptNodeDetails';
import EdgeDetails from './EdgeDetails';
import useApiClient from '../../../components/hooks/useApiClient';

function Container() {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, maxWidth: 550 }}>
      <GraphEvents />
    </div>
  );
}

function GraphEvents() { 
  const apiClient = useApiClient();
  
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();

  const [selectedType, setSelectedType] = useState<null | 'node' | 'connection'>();
  const [selectedId, setSelectedId] = useState<string>();  

  sigma.setSetting('enableEdgeClickEvents', true);
  
  useEffect(() => {
    function onDeleteNode(e: any) {
      setSelectedType(null);
    }

    function onDeleteEdge(e: any) {
      setSelectedType(null);
    }

    sigma.getGraph().on('nodeDropped', onDeleteNode);
    sigma.getGraph().on('edgeDropped', onDeleteEdge);

    return () => {
      sigma.getGraph().off('nodeDropped', onDeleteNode);
      sigma.getGraph().off('edgeDropped', onDeleteEdge);
    }
  }, []);
  
  useEffect(() => {
    registerEvents({
      clickEdge(e) {       
        if (selectedType === 'node' && selectedId) {
          sigma.getGraph().setNodeAttribute(selectedId, 'highlighted', false);
        } else if (selectedType === 'connection' && selectedId) {
          apiClient.getConnection(selectedId)
            .then((connection) => {
              const color = ValidatableUseCases.getColor(connection, 'connection');
              sigma.getGraph().setEdgeAttribute(selectedId, 'color', color);
            })
        }
        
        setSelectedType('connection');
        setSelectedId(e.edge);

        sigma.getGraph().setEdgeAttribute(e.edge, 'color', '#000');
      },
      downNode(e) {
        // if (isNaN(+e.node)) return;
        
        if (selectedType === 'node' && selectedId) {
          sigma.getGraph().setNodeAttribute(selectedId, 'highlighted', false);
        } else if (selectedType === 'connection' && selectedId) {
          apiClient.getConnection(selectedId)
            .then((connection) => {
              const color =ValidatableUseCases.getColor(connection, 'connection');
              sigma.getGraph().setEdgeAttribute(selectedId, 'color', color);
            })
        }
        
        setSelectedType('node');
        setSelectedId(e.node);
        
        sigma.getGraph().setNodeAttribute(e.node, 'highlighted', true);
      },
      
    });
  }, [sigma, registerEvents, selectedType, selectedId]);

  if (selectedType === 'node') {
    return <ClimateConceptNodeDetails climateConceptId={selectedId} />;
  }

  if (selectedType === 'connection') {
    return <EdgeDetails edgeId={selectedId} />;
  }

  return null;
}

export default Container;
