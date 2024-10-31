# Start from a base image with build tools
FROM alpine:latest

RUN apk add --no-cache build-base pcre pcre-dev zlib zlib-dev openssl openssl-dev wget unzip && \
    wget https://nginx.org/download/nginx-1.27.2.tar.gz && \
    wget https://github.com/vozlt/nginx-module-vts/archive/refs/tags/v0.2.2.zip && \
    tar -xzvf nginx-1.27.2.tar.gz && \
    unzip v0.2.2.zip && \
    cd nginx-1.27.2 && \
    ./configure --add-module=../nginx-module-vts-0.2.2 && \
    make && make install && \
    rm -rf /var/cache/apk/* nginx-1.27.2* v0.2.2.zip && \
    mkdir -p /var/log/nginx

# Copy the Nginx configuration files
COPY nginx-loadbalancer.conf /usr/local/nginx/conf/nginx.conf
COPY generic_conf /usr/local/nginx/conf/generic_conf

# Run Nginx
CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]