import { FastifyInstance } from 'fastify'
import {
  createCategory,
  listCategories,
  updateCategory,
} from './categories-controller'
import {
  createProduct,
  updateProduct,
  getProduct,
  listProducts,
  toggleProductAvailability,
} from './products-controller'
import { uploadProductImage } from './upload-product-image-controller'
import { uploadCategoryImage } from './upload-category-image-controller'
import { requireRole } from '../../middleware/auth'
import { Role } from '../../../generated/prisma'

export async function catalogRoutes(app: FastifyInstance) {
  // ─── Categorias ───────────────────────────────────────────────────────────
  app.get('/categories', listCategories) // Público (requer logado, mas não precisa role)
  app.post(
    '/categories',
    { preHandler: [requireRole(Role.ADMIN, Role.OPERATOR)] },
    createCategory,
  )
  app.put(
    '/categories/:id',
    { preHandler: [requireRole(Role.ADMIN, Role.OPERATOR)] },
    updateCategory,
  )
  app.patch(
    '/categories/:id/image',
    { preHandler: [requireRole(Role.ADMIN, Role.OPERATOR)] },
    uploadCategoryImage,
  )

  // ─── Produtos ─────────────────────────────────────────────────────────────
  app.get('/products', listProducts) // Público
  app.get('/products/:id', getProduct) // Público

  app.post(
    '/products',
    { preHandler: [requireRole(Role.ADMIN, Role.OPERATOR)] },
    createProduct,
  )
  app.put(
    '/products/:id',
    { preHandler: [requireRole(Role.ADMIN, Role.OPERATOR)] },
    updateProduct,
  )
  app.patch(
    '/products/:id/availability',
    { preHandler: [requireRole(Role.ADMIN, Role.OPERATOR)] },
    toggleProductAvailability,
  )
  app.patch(
    '/products/:id/image',
    { preHandler: [requireRole(Role.ADMIN, Role.OPERATOR)] },
    uploadProductImage,
  )

  // (O patch para /products/:id/stock viria depois num controle de estoque)
}
