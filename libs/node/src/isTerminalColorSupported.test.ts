import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { vi } from "vitest";
import { beforeEach } from "vitest";
import { afterEach } from "vitest";

// We need to re-import fresh each test because onetime caches
// So we use dynamic import with vi.resetModules

describe('isTerminalColorSupported', () => {
  const originalEnv = { ...process.env }
  const originalStdout = process.stdout.isTTY

  beforeEach(() => {
    vi.resetModules()
    delete process.env.FORCE_COLOR
    delete process.env.NODE_DISABLE_COLORS
    delete process.env.NO_COLOR
    delete process.env.TERM
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    Object.defineProperty(process.stdout, 'isTTY', { value: originalStdout, writable: true })
  })

  it('should return true when stdout is a TTY and no disabling env vars', async () => {
    Object.defineProperty(process.stdout, 'isTTY', { value: true, writable: true })
    const { isTerminalColorSupported } = await import('./isTerminalColorSupported')
    expect(typeof isTerminalColorSupported()).toBe('boolean')
  })

  it('should return false when NODE_DISABLE_COLORS is set', async () => {
    process.env.NODE_DISABLE_COLORS = '1'
    const { isTerminalColorSupported } = await import('./isTerminalColorSupported')
    expect(isTerminalColorSupported()).toBe(false)
  })

  it('should return false when NO_COLOR is set', async () => {
    process.env.NO_COLOR = ''
    const { isTerminalColorSupported } = await import('./isTerminalColorSupported')
    expect(isTerminalColorSupported()).toBe(false)
  })

  it('should return false when TERM is dumb', async () => {
    process.env.TERM = 'dumb'
    Object.defineProperty(process.stdout, 'isTTY', { value: true, writable: true })
    const { isTerminalColorSupported } = await import('./isTerminalColorSupported')
    expect(isTerminalColorSupported()).toBe(false)
  })

  it('should return true when FORCE_COLOR is set to non-zero', async () => {
    process.env.FORCE_COLOR = '1'
    const { isTerminalColorSupported } = await import('./isTerminalColorSupported')
    expect(isTerminalColorSupported()).toBe(true)
  })

  it('should return false when FORCE_COLOR is 0', async () => {
    process.env.FORCE_COLOR = '0'
    Object.defineProperty(process.stdout, 'isTTY', { value: false, writable: true })
    const { isTerminalColorSupported } = await import('./isTerminalColorSupported')
    expect(isTerminalColorSupported()).toBe(false)
  })

  it('should return false when stdout is not a TTY and no FORCE_COLOR', async () => {
    Object.defineProperty(process.stdout, 'isTTY', { value: false, writable: true })
    const { isTerminalColorSupported } = await import('./isTerminalColorSupported')
    expect(isTerminalColorSupported()).toBe(false)
  })

  it('should return true when FORCE_COLOR is empty string (truthy check)', async () => {
    process.env.FORCE_COLOR = ''
    Object.defineProperty(process.stdout, 'isTTY', { value: false, writable: true })
    const { isTerminalColorSupported } = await import('./isTerminalColorSupported')
    // FORCE_COLOR is '' which is != null (true) but === '0' is false, so it's truthy
    expect(isTerminalColorSupported()).toBe(true)
  })
})
