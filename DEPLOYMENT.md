# Deployment Guide for Cover Letter Generator

This guide will help you deploy the Cover Letter Generator application to Vercel (frontend) and Heroku (backend).

## Prerequisites

- GitHub account
- Vercel account (sign up at vercel.com)
- Heroku account (sign up at heroku.com)
- Heroku CLI installed locally

## Step 1: Deploy the Backend to Heroku

1. **Login to Heroku**:
   ```bash
   heroku login
   ```

2. **Create a new Heroku app**:
   ```bash
   heroku create my-cl-generator-api
   ```
   Replace `my-cl-generator-api` with your preferred app name.

3. **Add the Python buildpack**:
   ```bash
   heroku buildpacks:set heroku/python --app my-cl-generator-api
   ```

4. **Set environment variables**:
   ```bash
   heroku config:set PORT=5000 --app my-cl-generator-api
   heroku config:set DEBUG=False --app my-cl-generator-api
   ```

5. **Deploy the backend**:
   There are two ways to deploy the backend:

   **Option A: Deploy from a subdirectory**:
   ```bash
   git subtree push --prefix backend heroku main
   ```

   **Option B: Create a separate repository for the backend**:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend commit"
   heroku git:remote -a my-cl-generator-api
   git push heroku main
   ```

6. **Verify the deployment**:
   ```bash
   heroku open --app my-cl-generator-api
   ```
   Add `/api/health` to the URL to check if the API is running.

## Step 2: Deploy the Frontend to Vercel

1. **Push your code to GitHub** (if you haven't already):
   ```bash
   git push origin main
   ```

2. **Import your repository to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will automatically detect that it's a Next.js project

3. **Configure environment variables**:
   - Add the following environment variables in the Vercel dashboard:
     - `MONGODB_URI`: Your MongoDB connection string
     - `MONGODB_DB`: Your MongoDB database name (e.g., `cover-letter-generator`)
     - `NEXTAUTH_SECRET`: A secure random string for authentication
     - `NEXT_PUBLIC_API_URL`: Your Heroku backend URL (e.g., `https://my-cl-generator-api.herokuapp.com`)
     - `NEXT_PUBLIC_USE_ML_BACKEND`: Set to `true`

4. **Deploy**:
   - Click "Deploy" and wait for the process to complete
   - Your application will be live at a Vercel URL (e.g., `https://my-cl-generator.vercel.app`)

## Step 3: Update CORS Settings on Backend

After deploying both frontend and backend, you need to update the CORS settings on the backend to allow requests from your Vercel domain:

1. **Set the ALLOWED_ORIGINS environment variable on Heroku**:
   ```bash
   heroku config:set ALLOWED_ORIGINS=https://my-cl-generator.vercel.app --app my-cl-generator-api
   ```
   Replace `my-cl-generator.vercel.app` with your actual Vercel domain.

2. **Restart the Heroku app**:
   ```bash
   heroku restart --app my-cl-generator-api
   ```

## Alternative: Deploy the Backend to Render.com

If you encounter issues with Heroku requiring payment verification, you can use Render.com as an alternative:

1. **Create a Render.com account**:
   - Go to [render.com](https://render.com/) and sign up for a free account

2. **Deploy from GitHub**:
   - In the Render dashboard, click "New" and select "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your Cover Letter Generator
   - Configure the service:
     - Name: `my-cl-generator-api`
     - Environment: `Python`
     - Build Command: `pip install -r backend/requirements.txt && python -m spacy download en_core_web_sm`
     - Start Command: `cd backend && python app.py`
   - Add the following environment variables:
     - `PORT`: `5000`
     - `DEBUG`: `False`
     - `ALLOWED_ORIGINS`: `https://my-cl-generator-macjacker.vercel.app,https://my-cl-generator.vercel.app`

3. **Deploy the service**:
   - Click "Create Web Service"
   - Wait for the deployment to complete

4. **Update the frontend**:
   - After deployment, Render will provide a URL for your service (e.g., `https://my-cl-generator-api.onrender.com`)
   - Update the `NEXT_PUBLIC_API_URL` in your Vercel deployment to point to this URL

## Troubleshooting

### MongoDB Connection Issues

- Ensure your MongoDB Atlas IP whitelist includes `0.0.0.0/0` to allow connections from anywhere
- Check that your MongoDB URI is correctly formatted and includes the database name

### CORS Issues

- If you encounter CORS errors, ensure the `ALLOWED_ORIGINS` environment variable on Heroku includes your Vercel domain
- Check that the CORS configuration in `app.py` is correctly set up

### Vercel Build Errors

- If you encounter build errors related to MongoDB, ensure the `MONGODB_URI` environment variable is correctly set
- Check the Vercel build logs for specific error messages

### Heroku Deployment Issues

- If you encounter issues with the Heroku deployment, check the logs:
  ```bash
  heroku logs --tail --app my-cl-generator-api
  ```
- Ensure all required dependencies are listed in `requirements.txt`

## Continuous Deployment

Both Vercel and Heroku support continuous deployment from GitHub. Once set up, any changes pushed to your GitHub repository will automatically trigger a new deployment.

## Custom Domain (Optional)

You can set up custom domains for both your Vercel and Heroku deployments:

- **Vercel**: Go to the project settings > Domains to add a custom domain
- **Heroku**: Use the `heroku domains:add` command or the Heroku dashboard 