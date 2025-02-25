import { Elysia, t } from 'elysia'
import { CommentService } from '../services/comment.service'
import { CommentRepository } from '../repositories/comment.repository'
import { wsReportsClientsMap } from '@/events/report.events'
import { wsCommentsClientsMap } from '@/events/comment.event'

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
  .ws('/', {
    body: t.Object({
      message: t.String()
    }),
    open(ws) {
      wsReportsClientsMap.set(ws.id, { ws });
    },
    close(ws) {
      wsReportsClientsMap.delete(ws.id);
    },
  })
  .ws('/:id/comments', {
    body: t.Object({
      message: t.String()
    }),
    params: t.Object({
      id: t.String()
    }),
    open(ws) {
      wsCommentsClientsMap.set(ws.id, { ws: ws, reportId: ws.data.params.id });
    },
    close(ws) {
      wsCommentsClientsMap.delete(ws.id);
    },
  });
