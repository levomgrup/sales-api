import express from 'express';
import {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  assignProductToCustomer,
  removeProductAssignment,
  getCustomerProducts
} from '../controllers/product.controller';

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Tüm ürünleri getir
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Ürün listesi başarıyla getirildi
 */
router.get('/', getAllProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Yeni ürün ekle
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Ürün başarıyla oluşturuldu
 */
router.post('/', createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: ID'ye göre ürün getir
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ürün ID
 *     responses:
 *       200:
 *         description: Ürün başarıyla getirildi
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Ürün bilgilerini güncelle
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ürün ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Ürün başarıyla güncellendi
 */
router.put('/:id', updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Ürünü sil
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ürün ID
 *     responses:
 *       200:
 *         description: Ürün başarıyla silindi
 */
router.delete('/:id', deleteProduct);

/**
 * @swagger
 * /api/products/{id}/assign:
 *   post:
 *     summary: Ürünü müşteriye ata
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ürün ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ürün başarıyla müşteriye atandı
 */
router.post('/:id/assign', assignProductToCustomer);

/**
 * @swagger
 * /api/products/{id}/unassign:
 *   post:
 *     summary: Ürün atamasını kaldır
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ürün ID
 *     responses:
 *       200:
 *         description: Ürün ataması başarıyla kaldırıldı
 */
router.post('/:id/unassign', removeProductAssignment);

/**
 * @swagger
 * /api/customers/{customerId}/products:
 *   get:
 *     summary: Müşterinin ürünlerini getir
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: Müşteri ID
 *     responses:
 *       200:
 *         description: Müşterinin ürünleri başarıyla getirildi
 */
router.get('/customer/:customerId', getCustomerProducts);

export default router; 