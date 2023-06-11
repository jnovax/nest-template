## BUILD src files
yarn build

## START in pm2: all CPUs
pm2 start dist/main.js -i 0

## START in pm2: 4 CPUs
pm2 start dist/main.js -i 4