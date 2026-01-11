# build
FROM node:alpine as builder
WORKDIR /app
COPY package.json ./

RUN npm install
COPY . .

RUN npm run build

# deploy
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf


COPY --from=builder /app/dist/*/browser/ /usr/share/nginx/html/


EXPOSE 80

