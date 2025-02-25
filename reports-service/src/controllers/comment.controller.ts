import { Elysia, t } from 'elysia'
import { CommentService } from '../services/comment.service'
import { CommentRepository } from '../repositories/comment.repository'
import { CommentEvents } from '@/events/comment.event'

const commentService = new CommentService(new CommentRepository(), new CommentEvents());

export const commentController = new Elysia({ prefix: '/comments' })
  .get('/report/:reportId', async ({ params: { reportId } }) => {
    return await commentService.getCommentsByReport(reportId)
  })
  .post('/',
    async ({ body }) => {
      return await commentService.createComment({
        message: body.message,
        reportId: body.reportId,
      })
    },
    {
      body: t.Object({
        message: t.String(),
        reportId: t.String(),
      })
    }
  )
  .delete('/:id', async ({ params: { id } }) => {
    return await commentService.deleteComment(id)
  });
