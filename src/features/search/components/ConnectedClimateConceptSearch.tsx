import { useEffect, useState } from "react";
import { useSigma } from "@react-sigma/core";

import useApiClient from "src/components/hooks/useApiClient";
import { useCenterNode } from "src/features/center-node";
import ClimateConceptSearch from "./ClimateConceptSearch";

function ConnectedClimateConceptSearch() {
  const sigma = useSigma();
  const apiClient = useApiClient();
  const { centerNodeByName } = useCenterNode();

  const [options, setOptions] = useState<{ id: string, name: string }[]>([]);

  function highlightNodes(nodeIds: string[]) {
    sigma.getGraph().forEachNode(node => {
      sigma.getGraph().setNodeAttribute(node, 'highlighted', false);
    });

    nodeIds.forEach(nodeId => {
      sigma.getGraph().setNodeAttribute(nodeId, 'highlighted', true);
    });
  }

  // Fetch all climate concept nodes on component mount
  useEffect(() => {
    apiClient.getAllClimateConceptNodes().then(allNodes => {
      const options = allNodes.map(node => ({ name: node.name, id: node.id }));
      setOptions(options);
    });
  }, []);

  function handleSelect(value: { name: string; id: string }) {
    centerNodeByName(value.name);
    highlightNodes([value.id]);
  }

  function handleChange(filteredOptions: { name: string; id: string }[]) {
    const nodeIds = filteredOptions.map(option => option.id);
    highlightNodes(nodeIds);
  }

  return (
    <ClimateConceptSearch
      options={options}
      onSelect={handleSelect}
      onChange={handleChange}
    />
  );
}

export default ConnectedClimateConceptSearch;
