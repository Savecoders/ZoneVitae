export interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  resource_type: string;
}

export interface CloudinaryDeleteResponse {
  result: string;
}
