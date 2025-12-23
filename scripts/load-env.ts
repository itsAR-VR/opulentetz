import { config } from "dotenv"

// Load local overrides first, then shared defaults.
config({ path: ".env.local" })
config({ path: ".env" })

