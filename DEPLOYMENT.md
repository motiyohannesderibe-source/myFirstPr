# Production Deployment

## Before Deploying

1. Create a Supabase project and run `database/schema/001_init_schema.sql` in the Supabase SQL Editor. Do not run the wrapper under `database/migrations`; its `\ir` command is for `psql`.
2. Create a Render **Web Service** from this repository and select **Docker** as the runtime. Leave Root Directory blank (repository root), set Dockerfile Path to `Dockerfile`, and Docker Context Directory to `.`. Do not use the Static Site form or enter a publish directory; the Dockerfile builds and publishes the API.
3. Configure these Render environment variables:

   | Variable | Value |
   | --- | --- |
   | `ASPNETCORE_ENVIRONMENT` | `Production` |
   | `ConnectionStrings__DefaultConnection` | Supabase PostgreSQL connection string with `SSL Mode=Require` |
   | `JwtSettings__SecretKey` | Random secret with at least 32 bytes |
   | `CorsSettings__AllowedOrigins__0` | Exact Vercel origin, e.g. `https://your-store.vercel.app` |
   | `InitialAdmin__Username` | Initial administrator username |
   | `InitialAdmin__Email` | Initial administrator email |
   | `InitialAdmin__Password` | Strong, unique initial password |

   The API creates the initial admin only if that username does not exist. Remove `InitialAdmin__Password` from Render after the first successful deployment. Render supplies `PORT`; the API listens on it automatically.

4. Configure a persistent disk on Render mounted at `/var/data`, then set `Uploads__Path=/var/data/uploads`. Without a persistent disk, image uploads can be lost when the service restarts or redeploys.
5. Create a Vercel project with the root directory `frontend`, build command `npm run build`, and output directory `dist`. Set `VITE_API_BASE_URL` to the Render service origin, for example `https://your-service.onrender.com`, then redeploy the frontend.
6. Check `https://your-service.onrender.com/health`, then test product loading, admin login, image upload, order placement, and a direct browser refresh on a nested frontend route.

## Supabase Connection

Use the connection string shown by Supabase for your deployment environment. Supabase's direct connection may require IPv6 support; if Render cannot reach it, use the Supabase session pooler details instead. Keep the connection string, JWT secret, and initial admin password only in Render environment variables, never in Vercel or committed files.

## Important

The frontend's `VITE_API_BASE_URL` is public by design; it must contain only the API origin, never database credentials or JWT signing secrets. The checked-in Development settings are for local use only and must not be used as production credentials.