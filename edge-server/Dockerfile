# # Start from a base image with build tools
# FROM alpine:latest

# # Install dependencies
# RUN apk add --no-cache build-base pcre pcre-dev zlib zlib-dev openssl openssl-dev wget unzip && \
#     sudo apk add nginx-module-njs@nginx && \
#     # Download NGINX, VTS module, LuaJIT, and ngx_http_lua_module
#     wget https://nginx.org/download/nginx-1.27.2.tar.gz && \
#     wget https://github.com/vozlt/nginx-module-vts/archive/refs/tags/v0.2.2.zip && \
#     # Extract the downloaded files
#     tar -xzvf nginx-1.27.2.tar.gz && \
#     unzip v0.2.2.zip && \
#     # Build and compile NGINX with VTS and Lua module
#     cd nginx-1.27.2 && \
#     ./configure --add-module=../nginx-module-vts-0.2.2 \
#     make && make install && \
#     # Cleanup
#     cd .. && \
#     rm -rf /var/cache/apk/* nginx-1.27.2* v0.2.2.zip&& \
#     mkdir -p /var/log/nginx

# # Copy the Nginx configuration files
# COPY nginx-edge.conf /usr/local/nginx/conf/nginx.conf
# COPY generic_conf /usr/local/nginx/conf/generic_conf

# # Run Nginx
# CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]


# Start from a base image with build tools
FROM alpine:latest

# Install dependencies
RUN apk add --no-cache build-base pcre pcre-dev zlib zlib-dev openssl openssl-dev wget unzip git libxml2-dev libxslt-dev && \
    # Download NGINX and VTS module
    wget https://nginx.org/download/nginx-1.27.2.tar.gz && \
    wget https://github.com/vozlt/nginx-module-vts/archive/refs/tags/v0.2.2.zip && \
    # Clone the njs repository
    git clone https://github.com/nginx/njs.git && \
    # Extract the downloaded files
    tar -xzvf nginx-1.27.2.tar.gz && \
    unzip v0.2.2.zip && \
    # Build njs
    cd njs && \
    ./configure && make && \
    cd .. && \
    # Build and compile NGINX with VTS and njs module
    cd nginx-1.27.2 && \
    ./configure \
        --add-module=../nginx-module-vts-0.2.2 \
        --add-module=../njs/nginx \
        --with-http_ssl_module \
        --with-http_v2_module \
        --with-pcre \
        --with-http_stub_status_module && \
    make && make install && \
    # Cleanup
    cd .. && \
    rm -rf /var/cache/apk/* nginx-1.27.2* v0.2.2.zip njs && \
    mkdir -p /var/log/nginx

# Copy the NGINX configuration files
COPY nginx-edge.conf /usr/local/nginx/conf/nginx.conf
COPY generic_conf /usr/local/nginx/conf/generic_conf
COPY njs /usr/local/nginx/conf/njs

# Expose HTTP port
EXPOSE 80

# Run NGINX
CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]