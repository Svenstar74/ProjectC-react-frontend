import { apiService } from "../../../services/api-service/ApiService";
import { IApiResponse } from "../../../services/api-service/IApiResponse";

export interface IMostSimilarNameRequest {
  name: string;
}

export interface IMostSimilarNameResponse {
  exists: boolean;
  similarNames: {
    name: string;
    similarity: number;
  }[];
}

export async function postFindMostSimilarName(data: IMostSimilarNameRequest): Promise<IApiResponse<IMostSimilarNameResponse>> {
  const response = await apiService.post<IMostSimilarNameResponse>({
    endpoint: '/climate-concept-nodes/verify-name',
    data,
  });

  return response;
}
