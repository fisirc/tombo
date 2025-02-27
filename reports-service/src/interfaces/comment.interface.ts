import { t, type Static } from 'elysia';

export const commentSchema = t.Object({
  id: t.String(),
  message: t.String(),
  createdAt: t.Date(),
  reportId: t.String(),
  userId: t.String(),
});

export const createCommentSchema = t.Omit(commentSchema, ['id']);

export type IComment = Static<typeof commentSchema>;
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
