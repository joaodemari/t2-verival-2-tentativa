export interface AuthenticatedRequest {
  user: {
    sub: number;
    email: string;
  };
}
