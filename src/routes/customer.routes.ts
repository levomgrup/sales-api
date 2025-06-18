import express from 'express';
import {
  getAllCustomers,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} from '../controllers/customer.controller';

const router = express.Router();

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Tüm müşterileri getir
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Müşteri listesi başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 */
router.get('/', getAllCustomers);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Yeni müşteri ekle
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: Müşteri başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz veri
 */
router.post('/', createCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: ID'ye göre müşteri getir
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Müşteri ID
 *     responses:
 *       200:
 *         description: Müşteri başarıyla getirildi
 *       404:
 *         description: Müşteri bulunamadı
 */
router.get('/:id', getCustomerById);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Müşteri bilgilerini güncelle
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Müşteri ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: Müşteri başarıyla güncellendi
 *       404:
 *         description: Müşteri bulunamadı
 */
router.put('/:id', updateCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Müşteriyi sil (soft delete)
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Müşteri ID
 *     responses:
 *       200:
 *         description: Müşteri başarıyla silindi
 *       404:
 *         description: Müşteri bulunamadı
 */
router.delete('/:id', deleteCustomer);

export default router; 