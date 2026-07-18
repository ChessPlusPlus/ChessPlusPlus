local bucket_key = KEYS[1]

local token_cost = tonumber(ARGV[1])
local bucket_size = tonumber(ARGV[2])
local refill_rate = tonumber(ARGV[3])
local refill_interval = tonumber(ARGV[4])
local current_time = tonumber(ARGV[5])

local raw_bucket_state = redis.call("GET", bucket_key)
if raw_bucket_state == false then
    redis.call("SET", bucket_key, cjson.encode({
        tokens = bucket_size,
        bucket_size = bucket_size,
        refill_rate = refill_rate,
        refill_interval = refill_interval,
        last_refill_time = current_time,
    }))
end

local current_bucket_state = cjson.decode(redis.call("GET", bucket_key))
local token_count = current_bucket_state["tokens"]

local last_refill_time = current_bucket_state["last_refill_time"]
local elapsed_time = current_time - last_refill_time

if elapsed_time >= refill_interval then
    local num_refills = math.floor(tonumber(elapsed_time / refill_interval))

    token_count = math.min(bucket_size, token_count + num_refills * refill_rate)
    current_time = last_refill_time + num_refills * refill_interval

    redis.call("SET", bucket_key, cjson.encode({
        tokens = token_count,
        bucket_size = bucket_size,
        refill_rate = refill_rate,
        refill_interval = refill_interval,
        last_refill_time = current_time,
    }))
end

if token_count >= token_cost then
    local remaining_tokens = token_count - token_cost

    redis.call("SET", bucket_key, cjson.encode({
        tokens = remaining_tokens,
        bucket_size = bucket_size,
        refill_rate = refill_rate,
        refill_interval = refill_interval,
        last_refill_time = current_time,
    }))

    return {
        true,
        bucket_size,
        remaining_tokens,
        current_time + refill_interval,
    }
else
    return {
        false,
        bucket_size,
        token_count,
        current_time + refill_interval
    }
end






