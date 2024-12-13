#!/bin/sh

# Start OpenResty
/usr/local/openresty/bin/openresty -g 'daemon off;' &

# Start the cron daemon
crond -f -L /var/log/cron.log 
