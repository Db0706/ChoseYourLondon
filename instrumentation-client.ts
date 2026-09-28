import { initBotId } from 'botid/client/core';

// Invisible bot check (Vercel BotID) on bean submissions: requests from scripts,
// headless browsers and direct API calls are ignored by /api/beans.
initBotId({ protect: [{ path: '/api/beans', method: 'POST' }] });
