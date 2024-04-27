import { ISource, TConnectionType } from "business-logic";
import { useAppSelector } from "../../store/redux/hooks";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function useApiClient() {
  const userName = useAppSelector(state => state.auth.userName);

  async function getAllClimateConceptNodes() {
    const response = await fetch(BASE_URL + '/climate-concept-nodes');
    const data = await response.json();
    return data.data.nodes;
  }

  async function getClimateConceptNode(id: string) {
    const response = await fetch(BASE_URL + `/climate-concept-nodes/${id}`);
    const data = await response.json();
    return data.data.node;
  }

  async function getAllConnections() {
    const response = await fetch(BASE_URL + '/connections');
    const data = await response.json();
    return data.data.connections;
  }

  async function getConnection(id: string) {
    const response = await fetch(BASE_URL + `/connections/${id}`);
    const data = await response.json();
    return data.data.connection;
  }

  async function createClimateConceptNode(name: string, x: number, y: number) {
    const response = await fetch(BASE_URL + '/climate-concept-nodes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, x, y, createdBy: userName }),
    });

    const data = await response.json();
    return data.data;
  }

  async function updateClimateConceptNodePosition(id: string, x: number, y: number) {
    await fetch(BASE_URL + `/climate-concept-nodes/${id}/position`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ x, y }),
    });
  }

  async function updateClimateConceptName(id: string, name: string) {
    await fetch(BASE_URL + `/climate-concept-nodes/${id}/name`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
  }

  async function deleteClimateConceptNode(id: string) {
    await fetch(BASE_URL + `/climate-concept-nodes/${id}`, {
      method: 'DELETE',
    });
  }

  async function createConnection(sourceId: string, targetId: string, type: TConnectionType, sources?: ISource[]) {
    const response = await fetch(BASE_URL + '/connections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sourceId, targetId, type, createdBy: userName, sources }),
    });

    const data = await response.json();
    return data.data;
  }

  async function updateConnectionType(id: string, type: TConnectionType) {
    await fetch(BASE_URL + `/connections/${id}/type`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type }),
    });
  }

  async function deleteConnection(id: string) {
    await fetch(BASE_URL + `/connections/${id}`, {
      method: 'DELETE',
    });
  }

  async function addSource(id: string, url: string, originalText: string, endpoint: '/climate-concept-nodes' | '/connections') {
    await fetch(BASE_URL + `${endpoint}/${id}/sources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, originalText }),
    });
  }

  async function deleteSource(id: string, url: string, originalText: string, endpoint: '/climate-concept-nodes' | '/connections') {
    await fetch(BASE_URL + `${endpoint}/${id}/sources`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, originalText }),
    });
  }

  async function updateNeedsReviewLabel(id: string, newValue: boolean, endpoint: '/climate-concept-nodes' | '/connections') {
    await fetch(BASE_URL + `${endpoint}/${id}/needs-review`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ needsReview: newValue }),
    });
  }

  async function updateNeedsCorrectionLabel(id: string, newValue: boolean, endpoint: '/climate-concept-nodes' | '/connections') {
    await fetch(BASE_URL + `${endpoint}/${id}/needs-correction`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ needsCorrection: newValue }),
    });
  }

  async function updateIsReviewedLabel(id: string, newValue: boolean, endpoint: '/climate-concept-nodes' | '/connections') {
    await fetch(BASE_URL + `${endpoint}/${id}/is-reviewed`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isReviewed: newValue }),
    });
  }

  return {
    getAllClimateConceptNodes,
    getClimateConceptNode,
    getAllConnections,
    getConnection,

    createClimateConceptNode,
    updateClimateConceptNodePosition,
    updateClimateConceptName,
    deleteClimateConceptNode,

    createConnection,
    updateConnectionType,
    deleteConnection,

    addSource,
    deleteSource,
    updateNeedsReviewLabel,
    updateNeedsCorrectionLabel,
    updateIsReviewedLabel,
  };
}

export default useApiClient;
