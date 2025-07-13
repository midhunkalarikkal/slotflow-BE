import { Redis } from "@upstash/redis";
import { redisConfig } from "../../config/env";

export const redis = new Redis({
    url: redisConfig.redisUrl,
    token: redisConfig.redisToken,
})