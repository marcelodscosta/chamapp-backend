/**
 * Rotas que não exigem autenticação (JWT).
 * O globalAuthMiddleware ignora estas rotas.
 */
export const PUBLIC_ROUTES: Array<{ method: string; path: RegExp | string }> = [
  { method: 'POST', path: '/auth/login' },
  { method: 'POST', path: '/auth/register' },
  { method: 'POST', path: '/auth/forgot-password' },
  { method: 'POST', path: '/auth/reset-password' },
  { method: 'GET', path: '/products' },
  { method: 'GET', path: /^\/products\/[^/]+$/ }, // GET /products/:id
  { method: 'GET', path: '/categories' },
  { method: 'GET', path: /^\/addresses\/cep\/.+$/ }, // GET /addresses/cep/:cep
  { method: 'GET', path: '/store-settings' },
  { method: 'GET', path: '/loyalty/tiers' },
  { method: 'GET', path: '/health' },
]
