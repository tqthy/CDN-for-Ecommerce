math.randomseed(os.time())
local random = math.random

local popular_percentage = 80
local popular_items_quantity = 3
local max_total_items = 15

-- trying to model the long tail
request = function()
  local is_popular = random(1, 100) <= popular_percentage
  local item = ""

  if is_popular then
    item = "file" .. random(1, popular_items_quantity)
  else
    item = "file" .. random(popular_items_quantity + 1, popular_items_quantity + max_total_items)
  end

  return wrk.format(nil, "/api/file/download/" .. item .. ".jpeg")
end