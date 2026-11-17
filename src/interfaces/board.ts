export interface Board {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardDetail extends Board {
  elements: any[];
}