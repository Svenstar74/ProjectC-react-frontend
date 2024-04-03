import { useSigma } from "@react-sigma/core";

import useApiClient from "src/components/hooks/useApiClient";
import { useCenterNode } from "src/features/center-node";
import ClimateConceptSearch from "./ClimateConceptSearch";
import { useEffect, useState } from "react";

function ConnectedClimateConceptSearch() {
  const sigma = useSigma();
  const apiClient = useApiClient();
  const { centerNodeByName } = useCenterNode();

  const [allOptions, setAllOptions] = useState<{ name: string; id: string }[]>([]);

  function highlightNodes(nodeIds: string[]) {
    sigma.getGraph().forEachNode(node => {
      sigma.getGraph().setNodeAttribute(node, 'highlighted', false);
    });

    nodeIds.forEach(nodeId => {
      sigma.getGraph().setNodeAttribute(nodeId, 'highlighted', true);
    });
  }

  function handleSelect(value: { name: string; id: string }) {
    centerNodeByName(value.name);
    highlightNodes([value.id]);
  }

  function handleChange(value: { id: string, name: string }[]) {
    highlightNodes(value.map(option => option.id));
  }

  // Fetch all climate concept nodes on component mount
  useEffect(() => {
    apiClient.getAllClimateConceptNodes().then(allNodes => {
      const options = allNodes.map(node => ({ name: node.name, id: node.id }));
      setAllOptions(options);
    });
  }, []);

  return (
    <ClimateConceptSearch
      options={allOptions}
      onSelect={handleSelect}
      onChange={handleChange}
    />
  );
}

export default ConnectedClimateConceptSearch;
