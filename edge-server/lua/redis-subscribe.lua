local redis = require "resty.redis"

local _M = {}

function _M.start()
    ngx.timer.at(0, function()
        ngx.log(ngx.INFO, "Starting Redis subscription...")

        local red = redis:new()
        red:set_timeout(60000) -- Set timeout to 60 seconds

        ngx.log(ngx.INFO, "Connecting to Redis...")

        local ok, err = red:connect("redis_channel", 6379)
        if not ok then
            ngx.log(ngx.ERR, "Failed to connect to Redis: ", err)
            return
        end

        ngx.log(ngx.INFO, "Connected to Redis")
        ngx.log(ngx.INFO, "Subscribing to channel: cache-updates")

        local res, err = red:subscribe("cache-updates")
        if not res then
            ngx.log(ngx.ERR, "Failed to subscribe to channel: ", err)
            return
        end

        ngx.log(ngx.INFO, "Subscribed to Redis channel: cache-updates")

        while true do
            local msg, err = red:read_reply() -- Blocking read
            if not msg then
                ngx.log(ngx.ERR, "Failed to read message: ", err)
                -- Optionally reconnect on timeout
                if err == "timeout" then
                    ngx.log(ngx.INFO, "Reconnecting to Redis...")
                    local reconnect_ok, reconnect_err = red:connect("redis_channel", 6379)
                    if not reconnect_ok then
                        ngx.log(ngx.ERR, "Reconnection failed: ", reconnect_err)
                        break
                    end
                else
                    break
                end
            else
                local cjson = require "cjson"
                if type(msg) == "table" then
                    ngx.log(ngx.INFO, "Message received: ", cjson.encode(msg))
                else
                    ngx.log(ngx.INFO, "Message received: ", tostring(msg))
                end
            end
        end
    end)
end

return _M
-- local redis = require "resty.redis"
-- local cjson = require "cjson"

-- local _M = {}

-- function _M.start()
--     -- Create a coroutine for Redis subscription
--     ngx.timer.at(0, function()
--         local red = redis:new()
--         red:set_timeout(5000) -- Set timeout to 5 seconds

--         -- Connect to Redis
--         local ok, err = red:connect("redis_channel", 6379)
--         if not ok then
--             ngx.log(ngx.ERR, "Failed to connect to Redis: ", err)
--             return
--         end

--         ngx.log(ngx.INFO, "Connected to Redis")

--         -- Subscribe to a channel
--         local res, err = red:subscribe("cache-updates")
--         if not res then
--             ngx.log(ngx.ERR, "Failed to subscribe to channel: ", err)
--             return
--         end

--         ngx.log(ngx.INFO, "Subscribed to Redis channel: cache-updates")

--         -- Infinite loop to listen for messages
--         while true do
--             local msg, err = red:read_reply()
--             if not msg then
--                 ngx.log(ngx.ERR, "Failed to read message: ", err)
--                 break
--             end

--             -- Log the message or handle it
--             ngx.log(ngx.INFO, "Message received: ", cjson.encode(msg))

--             -- Example: Fetch and cache a file
--             if msg[1] == "message" then
--                 local file_key = msg[3]
--                 ngx.log(ngx.INFO, "Processing file key: ", file_key)
--                 -- Add custom caching logic here
--             end
--         end
--     end)
-- end

-- return _M