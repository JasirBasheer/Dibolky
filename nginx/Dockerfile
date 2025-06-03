FROM nginx:alpine
COPY conf.d/nginx.conf /etc/nginx/conf.d/default.conf
RUN adduser -D nginxuser && chown -R nginxuser:nginxuser /usr/share/nginx/html
USER nginxuser
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]