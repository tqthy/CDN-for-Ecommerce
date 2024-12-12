FROM openresty/openresty:1.27.1.1-alpine-apk

# MAKE THE DIRECTORY FOR ERROR LOGS
RUN mkdir -p /logs

# Install cron and other required tools
RUN apk add --no-cache curl bash busybox-suid

# Create a cron job file
COPY crontab /etc/crontabs/root

# Redirect cron logs to a file
RUN mkdir -p /var/log && touch /var/log/cron.log

# Copy the NGINX configuration files
COPY ./nginx-edge.conf /usr/local/openresty/nginx/conf/nginx.conf
COPY ./generic_conf /usr/local/openresty/nginx/conf/generic_conf

# Copy the Lua scripts
COPY ./lua /usr/local/openresty/nginx/conf/lua

# Change the permissions of the Lua scripts
RUN chown nobody:nobody /usr/local/openresty/nginx/conf/lua/redis-subscribe.lua

# Add a script to start both crond and OpenResty
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Run the combined start script
CMD ["/bin/sh", "/start.sh"]