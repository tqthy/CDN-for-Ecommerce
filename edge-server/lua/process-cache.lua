local process_cache = {}
process_cache.start = function ()
  local cdn_tasks = ngx.shared.cdn_tasks
  local task = cdn_tasks:rpop("tasks")
  
  while task do
      local cjson = require "cjson"
      local success, data = pcall(cjson.decode, task)
      ngx.log(ngx.INFO, "Task is available");
      if success then
        ngx.log(ngx.INFO, "Task data: ", cjson.encode(data))
          if data.bucket and data.key then
              local url = "/download/" .. data.bucket .. "/" .. data.key
              ngx.log(ngx.INFO, "Processing cache for: ", url)
  
              local res = ngx.location.capture(url, { method = ngx.HTTP_GET })
              if res.status == ngx.HTTP_OK then
                  ngx.log(ngx.INFO, "File cached successfully: ", data.key)
              else
                  ngx.log(ngx.ERR, "Failed to cache file: ", data.key)
              end
          end
          if data.key and not data.bucket then
            local url = "/purge/" .. data.key
            ngx.log(ngx.INFO, "Processing purge for: ", url)

            local res = ngx.location.capture(url, {
              method = ngx.HTTP_POST,
            })
            if res.status == ngx.HTTP_OK then
                ngx.log(ngx.INFO, "File purged successfully: ", data.key)
            else
                ngx.log(ngx.ERR, "Failed to purge file: ", data.key)
                ngx.log(ngx.ERR, "Status: ", res.status)
                ngx.log(ngx.ERR, "Body: ", res.body)
            end
          end
      else
          ngx.log(ngx.ERR, "Failed to parse task data: ", task)
      end
  
      task = cdn_tasks:rpop("tasks") -- Fetch next task
  end
  
  ngx.say("Cache tasks processed")
end

return process_cache
