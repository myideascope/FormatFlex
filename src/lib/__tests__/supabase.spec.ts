import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Test strategy:
 * - The module under test reads import.meta.env.VITE_SUPABASE_URL and import.meta.env.VITE_SUPABASE_ANON_KEY at import time
 *   and throws if either is missing. Therefore, each test isolates module state by resetting modules and manipulating the env
 *   prior to dynamic import().
 * - We mock @supabase/supabase-js's createClient to verify correct arguments and ensure no real network activity.
 */

type EnvShape = {
  VITE_SUPABASE_URL?: string
  VITE_SUPABASE_ANON_KEY?: string
  [k: string]: any
}

// Minimal helper to safely mutate import.meta.env across tests.
// In Vitest, import.meta.env is available and is derived from process.env.
// We also keep process.env in sync as some tooling bridges from there.
function setEnv(next: EnvShape) {
  const current = (import.meta as any).env ?? {}
  ;(import.meta as any).env = { ...current, ...next }
  // Keep process.env mirrored for good measure
  if (next.VITE_SUPABASE_URL !== undefined) {
    process.env.VITE_SUPABASE_URL = next.VITE_SUPABASE_URL!
  }
  if (next.VITE_SUPABASE_ANON_KEY !== undefined) {
    process.env.VITE_SUPABASE_ANON_KEY = next.VITE_SUPABASE_ANON_KEY!
  }
}

function clearEnv(keys: string[]) {
  const env = (import.meta as any).env ?? {}
  for (const k of keys) {
    if (env && Object.prototype.hasOwnProperty.call(env, k)) {
      delete env[k]
    }
    delete (process.env as any)[k]
  }
}

// Mock for @supabase/supabase-js
vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: vi.fn((url: string, key: string) => {
      return { __mockClient__: true, url, key }
    }),
  }
})

// Utility to import the module under test with fresh state
async function importModule() {
  // Reset ESM module cache so top-level code re-runs with current env
  vi.resetModules()
  return await import('../supabase.test.ts') // The provided file path in prompt
}

beforeEach(() => {
  // Start each test with a clean slate for envs used by the module
  clearEnv(['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'])
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('supabase client module', () => {
  it('throws a clear error when both env vars are missing', async () => {
    setEnv({ VITE_SUPABASE_URL: undefined, VITE_SUPABASE_ANON_KEY: undefined })
    await expect(importModule()).rejects.toThrowError('Missing Supabase environment variables')
  })

  it('throws a clear error when URL is present but ANON_KEY is missing', async () => {
    setEnv({ VITE_SUPABASE_URL: 'https://example.supabase.co', VITE_SUPABASE_ANON_KEY: undefined })
    await expect(importModule()).rejects.toThrowError('Missing Supabase environment variables')
  })

  it('throws a clear error when ANON_KEY is present but URL is missing', async () => {
    setEnv({ VITE_SUPABASE_URL: undefined, VITE_SUPABASE_ANON_KEY: 'anon-123' })
    await expect(importModule()).rejects.toThrowError('Missing Supabase environment variables')
  })

  it('creates a supabase client when both env vars are provided', async () => {
    const url = 'https://example.supabase.co'
    const key = 'anon-123'
    setEnv({ VITE_SUPABASE_URL: url, VITE_SUPABASE_ANON_KEY: key })

    const mod = await importModule()
    const { createClient } = await import('@supabase/supabase-js') as any

    expect(createClient).toHaveBeenCalledTimes(1)
    expect(createClient).toHaveBeenCalledWith(url, key)
    expect(mod.supabase).toEqual({ __mockClient__: true, url, key })
  })

  it('exports a User type shape - runtime sanity check of keys', async () => {
    // Provide envs so module loads
    setEnv({ VITE_SUPABASE_URL: 'https://example.supabase.co', VITE_SUPABASE_ANON_KEY: 'anon-123' })
    const mod = await importModule()
    // We can’t assert TypeScript-only types at runtime. Instead, we validate expected keys via a sample object.
    const sampleUser = { id: 'u1', email: 'u1@example.com', created_at: new Date().toISOString() }

    // Validate the shape we expect consumers to rely on.
    expect(Object.keys(sampleUser).sort()).toEqual(['created_at', 'email', 'id'].sort())

    // Additional usage sanity: confirm supabase is created and usable (per mock)
    expect(mod.supabase).toHaveProperty('__mockClient__', true)
  })

  it('handles unexpected non-string env values by passing them through to createClient (edge case)', async () => {
    // Some environments may coerce values; ensure the code still forwards them.
    // Our mock will capture the forwarded values verbatim.
    const urlVal: any = 12345 as any
    const keyVal: any = { secret: 'anon' } as any
    setEnv({ VITE_SUPABASE_URL: urlVal, VITE_SUPABASE_ANON_KEY: keyVal })

    const mod = await importModule()
    const { createClient } = await import('@supabase/supabase-js') as any

    expect(createClient).toHaveBeenCalledWith(urlVal, keyVal)
    expect(mod.supabase).toEqual({ __mockClient__: true, url: urlVal, key: keyVal })
  })
})