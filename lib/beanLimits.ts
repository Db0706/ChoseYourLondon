// Shared by the browser tracker and /api/beans so "Spilt by you" only ever counts beans the server accepts.
export const MAX_PER_REQUEST = 150;     // beans in one batch
export const BEANS_PER_MINUTE = 1000;   // per person (~200 clicks a minute is already a lot)
