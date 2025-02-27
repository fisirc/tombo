import { Elysia, t } from 'elysia';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export const authController = new Elysia()
  .get('/auth/google', ({ redirect, cookie: { google_state } }) => {
    const state = authService.generateState();
    const url = authService.getGoogleAuthURL(state);

    google_state.value = state;
    google_state.set({
      secure: false, // set to true in production
      path: '/',
      httpOnly: true,
      maxAge: 60 * 10,
    });

    return redirect(url);
  })
  .post('/device-identity', async (req) => {
    const { deviceId } = req.body;

    try {
      // TODO: get and set the user id
      await authService.saveDeviceIdentity(deviceId, undefined);
      req.set.status = 200;
      return { deviceId };
    } catch (error) {
      req.set.status = 500;
      return { error: 'Failed to save device identity' };
    }
  }, {
    body: t.Object({
      deviceId: t.String(),
    }),
  })
  .get('/auth/google/callback', async ({ query, cookie: { google_state } }) => {
    const { code, state } = query;
    const storedState = google_state.value;

    if (code === null || storedState === null || state !== storedState) {
      throw new Error('Invalid request');
    }

    const { id_token, access_token } = await authService.getTokens(code as string);
    return await authService.getGoogleUser(access_token, id_token);
  });
