import { Hono } from 'hono'

export const app = new Hono<{ Bindings: Env }>()

app.get('/', async (ctx) => {
  const ua = await ctx.env.KV_CLIP.get('user-agent', 'text').catch((err) => {
    throw new Error('failed to get KV_CLIP::user-agent', { cause: err })
  })

  return ctx.text(ua ?? 'NOTHING_USER_AGENT')
})

app.put('/', async (ctx) => {
  const { ua } = await ctx.req.json<Payload>().catch((err) => {
    throw new Error('invalid request payload', { cause: err })
  })

  if (!ua) {
    throw new Error('not found request payload [ua]')
  }

  await ctx.env.KV_CLIP.put('user-agent', ua).catch((err) => {
    throw new Error('failed to put KV_CLIP::user-agent', { cause: err })
  })

  console.log(`succeeded put user-agent: ${ua}`)
  return ctx.json({ ok: true, ua })
})

app.onError((err, ctx) => {
  console.error(err)
  return ctx.json({ reason: err.message }, 500)
})
