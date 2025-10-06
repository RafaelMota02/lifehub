# Vercel Frontend Deployment Setup

## Prerequisites
Before deploying the frontend, you need to deploy the backend to Render and get its URL.

## Environment Variables for Vercel

Once your Render backend is deployed (see RENDER-ENV-SETUP.md), set this environment variable in Vercel:

```
VITE_API_BASE_URL=https://your-render-backend-url-here.onrender.com
```

Replace `your-render-backend-url-here` with your actual Render web service URL.

## Deployment Steps

1. Go to [vercel.com](https://vercel.com) and sign in/create account
2. Click "Import Project"
3. Connect your GitHub account and select the `RafaelMota02/lifehub` repo
4. Configure the project:
   - Framework Preset: `Vite`
   - Root Directory: `client`
5. Set the environment variable above
6. Deploy!

Your LifeHub frontend will be live on Vercel! The deployment should complete quickly, and you'll get a URL like `https://lifehub.vercel.app`.

## Next Steps
- Copy your Vercel frontend URL
- Update your backend's CORS settings to allow requests from this Vercel URL (I'll help you with this after your backend is deployed)
