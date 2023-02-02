import { app } from './fetch'
import { scheduled } from './scheduled'

const worker: ExportedHandler<Env> = {
  fetch: app.fetch,
  scheduled: (_, env, ctx) => ctx.waitUntil(scheduled(env)),
}

export default worker
