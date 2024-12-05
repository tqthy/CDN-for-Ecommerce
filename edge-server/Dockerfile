# Start from a base image with build tools
FROM alpine:latest

# Install dependencies
RUN apk add --no-cache build-base pcre pcre-dev zlib zlib-dev openssl openssl-dev wget unzip && \
    # Download NGINX, VTS module, LuaJIT, and ngx_http_lua_module
    wget https://nginx.org/download/nginx-1.27.2.tar.gz && \
    wget https://github.com/vozlt/nginx-module-vts/archive/refs/tags/v0.2.2.zip && \
    wget https://github.com/openresty/lua-nginx-module/archive/refs/tags/v0.10.27.tar.gz && \
    wget https://github.com/openresty/luajit2/archive/refs/tags/v2.1-20241113.tar.gz && \
    # Extract the downloaded files
    tar -xzvf nginx-1.27.2.tar.gz && \
    unzip v0.2.2.zip && \
    ls && \
    tar -xzvf v0.10.27.tar.gz && \
    tar -xzvf v2.1-20241113.tar.gz && \
    # Build LuaJIT
    cd luajit2-2.1-20241113 && \
    make && make install && \
    export LUAJIT_LIB=/usr/local/lib && \
    export LUAJIT_INC=/usr/local/include/luajit-2.1 && \
    cd .. && \
    # Build and compile NGINX with VTS and Lua module
    cd nginx-1.27.2 && \
    ./configure --add-module=../nginx-module-vts-0.2.2 \
                --add-module=../lua-nginx-module-0.10.27 \
                --with-ld-opt="-Wl,-rpath,/usr/local/lib" && \
    make && make install && \
    # Cleanup
    cd .. && \
    rm -rf /var/cache/apk/* nginx-1.27.2* v0.2.2.zip v0.10.27* luajit2-2.1-20241113 v2.1-20241113.tar.gz && \
    mkdir -p /var/log/nginx

# Copy the Nginx configuration files
COPY nginx-edge.conf /usr/local/nginx/conf/nginx.conf
COPY generic_conf /usr/local/nginx/conf/generic_conf

# Run Nginx
CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]