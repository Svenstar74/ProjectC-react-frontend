import { IClimateConceptNode } from "business-logic";
import { IApiResponse } from "../../../services/api-service/IApiResponse";
import { apiService } from "../../../services/api-service/ApiService";

export interface IPostClimateConceptNodeRequest {
  x: number;
  y: number;
  name: string;
  needsReview?: boolean;
  needsCorrection?: boolean;
  isReviewed?: boolean;
  createdBy: string;
}

export interface IPostClimateConceptNodeResponse extends IClimateConceptNode {}


export async function postClimateConceptNode(data: IPostClimateConceptNodeRequest): Promise<IApiResponse<IPostClimateConceptNodeResponse>> {
  const response = await apiService.post<IPostClimateConceptNodeResponse>({
    endpoint: '/climate-concept-nodes',
    data,
  });

  return response;
}
