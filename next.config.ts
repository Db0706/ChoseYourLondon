import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {};

// BotID: Vercel's invisible bot check, used to protect the bean counter.
export default withBotId(nextConfig);
