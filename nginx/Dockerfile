FROM nginx

RUN apt-get update
RUN apt-get install -y certbot python-certbot-nginx ca-certificates

RUN rm /etc/nginx/conf.d/*
