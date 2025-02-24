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
    async ({ body, user }) => {
      if (!user) throw new Error('Unauthorized')
      return await commentService.createComment({ ...body, userId: user.id })
    },
    {
      body: t.Object({
        message: t.String(),
        reportId: t.String()
      })
    }
  )

  .delete('/:id', async ({ params: { id }, user }) => {
    if (!user) throw new Error('Unauthorized')
    const comment = await commentService.getCommentById(id)
    if (comment.userId !== user.id) throw new Error('Forbidden')
    return await commentService.deleteComment(id)
  })
