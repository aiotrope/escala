import { postgres } from '../deps.js';

// empty to cathch env from default docker postgres config
const sql = postgres({});

export { sql };
