# Shell Script for Deployment Steps

#cd /opt/nucleus/backend/nucleus-backend
npm install --legacy-peer-deps
#git checkout {branch-name}
git reset --hard HEAD
git pull
npm run build
#cd /opt/nucleus/backend
pm2 restart ecosystem.config.js
