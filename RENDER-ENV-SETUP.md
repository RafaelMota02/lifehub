# Render Backend Deployment Setup

## Environment Variables for Render

Set the following environment variables in your Render web service dashboard:

```
DATABASE_URL=postgresql://neondb_owner:npg_iW5pILzq6tKN@ep-lucky-firefly-ad8werr3-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=your_super_secure_random_jwt_secret_here_please_generate_a_new_one

NODE_ENV=production
```

## Deployment Steps

1. Go to [render.com](https://render.com) and sign in/create account
2. Click "New +" and select "Web Service"
3. Connect your GitHub account and select the `RafaelMota02/lifehub` repo
4. Configure the following:
   - Name: `lifehub-backend` (or your choice)
   - Runtime: `Node`
   - Root Directory: `server`
   - Install Command: Leave as `npm install`
   - Start Command: Leave as `npm start`
5. Add the environment variables above
6. Deploy!

Once deployed, you'll get a URL like `https://lifehub-backend.onrender.com`. Save this URL - you'll need it for the frontend deployment.
