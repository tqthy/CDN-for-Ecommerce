#!/bin/sh

# Add a delay of 100ms to outgoing traffic on `eth0`
echo "Applying traffic control settings..."
# tc qdisc add dev eth0 root netem delay 10ms

# Start nginx
echo "Starting nginx..."
/usr/local/nginx/sbin/nginx -g 'daemon off;' 