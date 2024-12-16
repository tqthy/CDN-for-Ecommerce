FROM alpine:latest


RUN apk update && \
    apk add --no-cache \
    iproute2 && \
    rm -rf /var/cache/apk/*

RUN tc --version || echo "tc command installed successfully"

CMD ["sh"]