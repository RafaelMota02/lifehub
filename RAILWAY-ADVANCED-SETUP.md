# Advanced Railway Backend Setup

## New Improved CORS Configuration

The backend now uses environment-variable based CORS that's more flexible for production deployments.

## Required Environment Variables for Railway

In your Railway project → Variables section, set these:

```
DATABASE_URL=postgresql://neondb_owner:npg_iW5pILzq6tKN@ep-lucky-firefly-ad8werr3-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=your_super_secure_jwt_secret_generate_random_string

NODE_ENV=production

# NEW: Dynamic frontend URL (easily change without redeployment)
FRONTEND_URL=https://lifehub-hkpm952nj-dwayceprdc-7227s-projects.vercel.app
```

## How the New CORS Works

- **Dynamic**: Uses `FRONTEND_URL` env var so you can change frontend URLs without redeployment
- **Flexible**: Allows requests with no origin (like Postman testing)
- **Explicit Errors**: Shows detailed CORS error messages for debugging
- **Health Check**: GET `/health` for Railway monitoring

## Testing Your Backend

Test health endpoint:
```bash
curl https://lifehub-production.up.railway.app/health
```

Test API with CORS:
```bash
curl -X POST https://lifehub-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Origin: https://lifehub-hkpm952nj-dwayceprdc-7227s-projects.vercel.app" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'
```

The response should NOT show CORS errors and should include proper headers.

## Redeploy Instructions

These new changes will auto-deploy to Railway. Add `FRONTEND_URL` environment variable and redeploy if needed.
