export interface IComment {
  id: string
  message: string
  date: Date
  reportId: string
  userId: string
}

export interface ICommentRepository {
  create(comment: Omit<IComment, 'id' | 'date'>): Promise<IComment>
  findById(id: string): Promise<IComment | null>
  findAllByReport(reportId: string): Promise<IComment[]>
  delete(id: string): Promise<void>
}

export interface ICommentService {
  createComment(comment: Omit<IComment, 'id' | 'date'>): Promise<IComment>
  getCommentById(id: string): Promise<IComment>
  getCommentsByReport(reportId: string): Promise<IComment[]>
  deleteComment(id: string): Promise<void>
}
