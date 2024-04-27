import { useSigma } from "@react-sigma/core";

import { ISource, TConnectionType } from "business-logic";
import useApiClient from "../../../components/hooks/useApiClient";

function useCreateConnection() {
  const sigma = useSigma();
  const apiClient = useApiClient();

  async function createConnection(
    sourceId: string,
    targetId: string,
    connectionType: TConnectionType,
    sources?: ISource[],
    matchingSources?: any[]
  ): Promise<boolean> {
    const connection = await apiClient.createConnection(sourceId, targetId, connectionType);

    // Add sources
    if (sources) {
      sources.forEach((source) => {
        apiClient.addSource(connection.id, source.url, source.originalText);

        try {
          apiClient.addSource(sourceId, source.url, source.originalText);
        } catch (e) {}

        try {
          apiClient.addSource(targetId, source.url, source.originalText);
        } catch (e) {}
      });
    }

    if (connection) {
      let type = 'arrow';
      if (connectionType === 'isEqualTo') {
        type = 'line';
      }

      sigma.getGraph().addEdgeWithKey(connection.id, connection.sourceId, connection.targetId, { size: 2, type, connectionType: connection.type });
      return true;
    }

    return false;
  }

  return { createConnection };
}

export default useCreateConnection;
