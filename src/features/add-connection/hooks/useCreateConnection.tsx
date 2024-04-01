import { useSigma } from "@react-sigma/core";

import { TConnectionType } from "business-logic";
import useApiClient from "../../../components/hooks/useApiClient";

function useCreateConnection() {
  const sigma = useSigma();
  const apiClient = useApiClient();

  async function createConnection(
    sourceId: string,
    targetId: string,
    connectionType: TConnectionType,
    sources?: { url: string; originalText: string; }[],
  ): Promise<boolean> {
    const connection = await apiClient.createConnection(
      sourceId, targetId, connectionType, sources
    );

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
