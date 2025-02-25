import { Elysia, t } from 'elysia'
import { CommentService } from '../services/comment.service'
import { CommentRepository } from '../repositories/comment.repository'

const commentRepository = new CommentRepository()
const commentService = new CommentService(commentRepository)

export const commentController = new Elysia({ prefix: '/comments' })
  .get('/report/:reportId', async ({ params: { reportId } }) => {
    return await commentService.getCommentsByReport(reportId)
  })

  .post('/',
    async ({ body }) => {
      return await commentService.createComment({
        ...body,
      })
    },
    {
      body: t.Object({
        message: t.String(),
        reportId: t.String(),
        userId: t.String()
      })
    }
  )

  .delete('/:id', async ({ params: { id } }) => {
    return await commentService.deleteComment(id)
  })
