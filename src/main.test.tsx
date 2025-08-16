import React, { StrictMode } from 'react'

/**
 * Test framework and libraries:
 * - Using Vitest (vi) as the test runner and assertion library
 * - Using JSDOM as the environment (default in Vitest for browser-like APIs)
 *
 * Rationale:
 * - We mock react-dom/client.createRoot to observe how main.tsx wires up the app.
 * - We also mock App and AuthProvider to avoid unrelated complexity while verifying structure.
 * - We reset modules between tests so that importing main.tsx re-executes its top-level render side-effect.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// We will mock react-dom/client and the modules imported by main.tsx.
// Mocks must be declared before importing the module under test.
const renderMock = vi.fn()
const createRootMock = vi.fn(() => ({ render: renderMock }))

vi.mock('react-dom/client', () => {
  return {
    __esModule: true,
    // In React 18, createRoot is exported from react-dom/client
    createRoot: createRootMock,
  }
})

// Mock the App component to a lightweight sentinel element
vi.mock('./App.tsx', () => {
  const AppMock: React.FC = () => React.createElement('div', { 'data-testid': 'app' })
  return {
    __esModule: true,
    default: AppMock,
  }
})

// Mock the AuthProvider to wrap children in a sentinel element for structure checks
// We export the mock so we can reference its identity in assertions if needed.
const AuthProviderMock: React.FC<React.PropsWithChildren> = ({ children }) =>
  React.createElement('div', { 'data-testid': 'auth-provider' }, children)

vi.mock('./contexts/AuthContext', () => {
  return {
    __esModule: true,
    AuthProvider: AuthProviderMock,
  }
})

beforeEach(() => {
  // Clear previous DOM and mock call history before each test
  document.body.innerHTML = ''
  renderMock.mockClear()
  createRootMock.mockClear()
  vi.resetModules()
})

describe('src/main.tsx bootstrap', () => {
  it('creates a React root using the #root element and renders the App tree once', async () => {
    // Arrange: provide a #root container
    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)

    // Act: import the module under test (which triggers createRoot(...).render(...))
    await import('./main.tsx')

    // Assert: createRoot was called with the right DOM node
    expect(createRootMock).toHaveBeenCalledTimes(1)
    expect(createRootMock).toHaveBeenCalledWith(root)

    // Assert: render called once with a StrictMode-wrapped element
    expect(renderMock).toHaveBeenCalledTimes(1)
    const [renderedElement] = renderMock.mock.calls[0]
    expect(renderedElement).toBeTruthy()
    // Ensure the top-level element is StrictMode
    // Note: type equality works against the imported StrictMode symbol
    // because StrictMode is a special React symbol provided via import { StrictMode } from 'react'.
    // We test using React.createElement identity established in this test file.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element: any = renderedElement
    expect(element.type).toBe(StrictMode)

    // Verify that StrictMode wraps our AuthProvider which in turn wraps App
    const strictChildren = element.props?.children
    // StrictMode should typically have a single child
    const authProviderNode = Array.isArray(strictChildren) ? strictChildren[0] : strictChildren
    expect(authProviderNode).toBeTruthy()
    // Since we mocked AuthProvider to a function component, the element.type equals our mock identity
    expect(authProviderNode.type).toBe(AuthProviderMock)

    // The AuthProvider mock returns a div with data-testid="auth-provider" that contains children,
    // but since we are not actually rendering the tree (we only inspect the element passed to render),
    // we confirm that the child inside AuthProvider corresponds to our mocked App marker.
    const appChild = authProviderNode.props?.children
    // The mocked App is <div data-testid="app" />
    // When created as a child element, it is represented as a ReactElement whose type is 'div' and
    // props include data-testid="app".
    const appElement = Array.isArray(appChild) ? appChild[0] : appChild
    expect(appElement?.type).toBe('div')
    expect(appElement?.props?.['data-testid']).toBe('app')
  })

  it('throws (or surfaces an error) when #root element is missing', async () => {
    // No root element appended
    // Make createRoot throw if called with a falsy container, to emulate real behavior
    createRootMock.mockImplementationOnce((node: Element | null) => {
      if (!node) {
        throw new Error('createRoot called with null container')
      }
      return { render: renderMock }
    })

    // Act + Assert: importing main.tsx should reject
    await expect(import('./main.tsx')).rejects.toThrow(/null container|root/i)

    // Ensure that createRoot was indeed attempted with a null-ish value
    expect(createRootMock).toHaveBeenCalledTimes(1)
    const [arg] = createRootMock.mock.calls[0]
    expect(arg).toBeNull()
    // render should never be invoked in this failure path
    expect(renderMock).not.toHaveBeenCalled()
  })

  it('does not create multiple roots on repeated imports when modules are reset per test', async () => {
    // Arrange: provide a #root container
    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)

    // Act: import twice with module reset between (simulated by beforeEach)
    await import('./main.tsx')
    // Since beforeEach calls vi.resetModules(), a second import in the same test would not re-execute.
    // Instead, we simulate "re-entry" by clearing mocks and re-importing after manual reset.
    renderMock.mockClear()
    createRootMock.mockClear()
    vi.resetModules()
    await import('./main.tsx')

    // Assert: In each fresh module execution, a single root is created and rendered once
    expect(createRootMock).toHaveBeenCalledTimes(1)
    expect(createRootMock).toHaveBeenCalledWith(root)
    expect(renderMock).toHaveBeenCalledTimes(1)
  })
})