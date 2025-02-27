import crypto from 'crypto';
import querystring from 'querystring';

export class AuthService {
  getGoogleAuthURL(state: string) {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      client_id: process.env.GOOGLE_CLIENT_ID,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
      state,
    };

    return `${rootUrl}?${querystring.stringify(options)}`;
  }

  generateState() {
    return crypto.randomBytes(32).toString('hex');
  }

  async getTokens(code: string) {
    try {
      const tokenURL = 'https://oauth2.googleapis.com/token';
      const values = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      };

      const response = await fetch(tokenURL, {
        method: 'POST',
        body: querystring.stringify(values),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return await response.json();
    } catch (error) {
      console.log(error);
      throw new Error('Failed to retrieve tokens');
    }
  }

  async getGoogleUser(access_token: string, id_token: string) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      );

      return await response.json();
    } catch (error) {
      console.log(error);
      throw new Error('Failed to retrieve user information');
    }
  }
}
