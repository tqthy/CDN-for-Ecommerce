FROM openresty/openresty:1.27.1.1-alpine-apk

# MAKE THE DIRECTORY FOR ERROR LOGS
RUN mkdir -p /logs

# Copy the NGINX configuration files
COPY ./nginx-edge.conf /usr/local/openresty/nginx/conf/nginx.conf
COPY ./generic_conf /usr/local/openresty/nginx/conf/generic_conf

# Copy the Lua scripts
COPY ./lua /usr/local/openresty/nginx/conf/lua

# Change the permissions of the Lua scripts
RUN chown nobody:nobody /usr/local/openresty/nginx/conf/lua/redis-subscribe.lua

# RUN the nginx server
CMD ["/usr/local/openresty/bin/openresty", "-g", "daemon off;"]
