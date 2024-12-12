#!/bin/sh

# Start the cron daemon
crond -f -L /var/log/cron.log &

# Start OpenResty
/usr/local/openresty/bin/openresty -g 'daemon off;'