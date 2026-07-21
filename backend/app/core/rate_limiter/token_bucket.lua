local bucket_key = KEYS[1]

local token_cost = tonumber(ARGV[1])
local bucket_size = tonumber(ARGV[2])
local refill_rate = tonumber(ARGV[3])
local refill_interval = tonumber(ARGV[4])
local current_time = tonumber(ARGV[5])
local token_count = bucket_size
local last_refill_time = current_time

local raw_bucket_state = redis.call("GET", bucket_key)
if raw_bucket_state then
    local bucket_state = cjson.decode(raw_bucket_state)

    token_count = bucket_state["tokens"]
    last_refill_time = bucket_state["last_refill_time"]
end

local elapsed_time = current_time - last_refill_time
if elapsed_time >= refill_interval then
    local num_refills = math.floor(tonumber(elapsed_time / refill_interval))

    token_count = math.min(bucket_size, token_count + num_refills * refill_rate)
    current_time = last_refill_time + num_refills * refill_interval
end

local is_allowed = false
if token_count >= token_cost then
    is_allowed = true
    token_count = token_count - token_cost
end

local ttl = math.ceil((bucket_size / refill_rate)) * refill_rate

redis.call("SET", bucket_key, cjson.encode({
    tokens = token_count,
    bucket_size = bucket_size,
    refill_rate = refill_rate,
    refill_interval = refill_interval,
    last_refill_time = current_time,
}), "EX", ttl)


return {
    is_allowed,
    bucket_size,
    token_count,
    current_time + refill_interval
}



