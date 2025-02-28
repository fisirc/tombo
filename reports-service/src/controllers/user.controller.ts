import { Elysia, t } from 'elysia'
import { CommentService } from '../services/comment.service'
import { CommentRepository } from '../repositories/comment.repository'
import { CommentEvents } from '@/events/comment.event'
import { UserRepository } from '@/repositories/user.repository';
import { UserService } from '@/services/user.service';

const userService = new UserService(new UserRepository());

export const userController = new Elysia({ prefix: '/user' })
  .get('/', async () => {
    return await userService.getAllUsers()
  })
  .get('/:userId', async ({ params: { userId: userId } }) => {
    return await userService.getUser(userId)
  })
  .get('/google/:googleId', async ({ params: { googleId: googleId } }) => {
    return await userService.getUserByGoogleId(googleId)
  })
  .post('/',
    async ({ body }) => {
      return await userService.createUser({
        googleId: body.googleId,
        email: body.email,
        name: body.name,
        avatar: body.avatar,
        phone: body.phone
      })
    },
    {
      body: t.Object({
        googleId: t.String(),
        email: t.String(),
        name: t.String(),
        avatar: t.String(),
        phone: t.String()
      })
    }
  )
