local redis = require "resty.redis"
local lock = require "resty.lock"
local cjson = require "cjson"

local _M = {}

local function redis_subscription()
    ngx.log(ngx.INFO, "Starting Redis subscription...")

    -- Acquire a lock to ensure only one worker runs the subscription
    local task_lock = lock:new("cdn_tasks")
    local elapsed, err = task_lock:lock("redis_subscription_lock")
    if not elapsed then
        ngx.log(ngx.ERR, "Failed to acquire Redis subscription lock: ", err)
        return
    end

    local red = redis:new()
    red:set_timeout(60000) -- Set timeout to 60 seconds

    ngx.log(ngx.INFO, "Connecting to Redis...")
    local ok, err = red:connect("redis_channel", 6379)
    if not ok then
        ngx.log(ngx.ERR, "Failed to connect to Redis: ", err)
        task_lock:unlock()
        ngx.timer.at(5, redis_subscription) -- Retry after 5 seconds
        return
    end

    ngx.log(ngx.INFO, "Connected to Redis")
    local res, err = red:subscribe("cache-updates")
    if not res then
        ngx.log(ngx.ERR, "Failed to subscribe to channel: ", err)
        task_lock:unlock()
        ngx.timer.at(5, redis_subscription) -- Retry after 5 seconds
        return
    end

    ngx.log(ngx.INFO, "Subscribed to Redis channel: cache-updates")

    while true do
        local msg, err = red:read_reply() -- Blocking read
        if not msg then
            ngx.log(ngx.ERR, "Failed to read message: ", err)
            if err == "timeout" then
                ngx.log(ngx.INFO, "Timeout waiting for message; continuing to wait...")
            else
                break -- Exit the loop on critical errors
            end
        else
            if type(msg) == "table" and msg[1] == "message" then
                local success, parsed_msg = pcall(cjson.decode, msg[3])
                if success and parsed_msg then
                    local cdn_tasks = ngx.shared.cdn_tasks
                    local task = cjson.encode({
                        bucket = parsed_msg.bucketName,
                        key = parsed_msg.objectKey
                    })
                    cdn_tasks:lpush("tasks", task)
                    ngx.log(ngx.INFO, "Task enqueued: ", task)
                else
                    ngx.log(ngx.ERR, "Failed to parse message: ", tostring(msg[3]))
                end
            else
                ngx.log(ngx.ERR, "Unexpected message format: ", tostring(msg))
            end
        end
    end

    task_lock:unlock()
    ngx.log(ngx.INFO, "Redis subscription lock released.")

    -- Re-schedule the timer for another attempt
    ngx.timer.at(5, redis_subscription)
end

function _M.start()
    ngx.timer.at(0, redis_subscription) -- Start immediately
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