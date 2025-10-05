Hostinger SFTP Deployment (Frontend)

1) Required GitHub Secrets

- HOSTINGER_HOST: us-bos-web1934.main-hosting.eu
- HOSTINGER_USERNAME: Your hosting account username (e.g. u357959028)
- HOSTINGER_SSH_PRIVATE_KEY: The private key that matches the public key you uploaded to Hostinger
- HOSTINGER_REMOTE_DIR: Remote directory to deploy to (e.g. domains/trustclinicalservices.com/public_html/)
- VITE_API_URL: Your backend API base URL (e.g. https://api.trustclinicalservices.com)

2) Upload Public Key to Hostinger

- Add your SSH public key in Hostinger hPanel → SSH Access → Add new key. The user shared a public key example in chat; ensure the matching private key is set in GitHub secrets.

3) Workflow

- On push to master/main affecting frontend, the workflow builds vite and uploads frontend/dist to HOSTINGER_REMOTE_DIR via SFTP.

4) SPA Routing

- An .htaccess with SPA fallback is included at frontend/public/.htaccess and will be copied to the server so deep links resolve to index.html.

5) Local build check

- From frontend/:
  - npm ci
  - npm run build
  - npx serve dist (optional preview)


