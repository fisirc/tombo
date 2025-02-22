export interface CreateReportDTO {
  title: string;
  content: string;
}

export interface Report {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
