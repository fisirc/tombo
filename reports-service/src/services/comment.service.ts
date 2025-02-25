import type { CommentRepository } from '../repositories/comment.repository'
import type { IComment, ICommentRepository, ICommentService } from '../interfaces/comment.interface'
import type { CommentEvents } from '@/events/comment.event'

export class CommentService implements ICommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly commentEvents: CommentEvents,
  ) { }

  async createComment(comment: Omit<IComment, 'id' | 'date' | 'userId'>): Promise<IComment> {
    const createdComment = await this.commentRepository.create(comment);
    this.commentEvents.publishCommentCreated(createdComment);
    return createdComment;
  }

  async getCommentById(id: string): Promise<IComment> {
    const comment = await this.commentRepository.findById(id)
    if (!comment) throw new Error('Comment not found')
    return comment
  }

  async getCommentsByReport(reportId: string): Promise<IComment[]> {
    return this.commentRepository.findAllByReport(reportId)
  }

  async deleteComment(id: string): Promise<void> {
    await this.commentRepository.delete(id)
  }
}
