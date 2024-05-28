FROM nginx:1.15
WORKDIR /app
EXPOSE 3000

COPY ./dist .

COPY nginx.conf /etc/nginx/conf.d/nginx.conf

COPY ./dist /usr/share/nginx/html
