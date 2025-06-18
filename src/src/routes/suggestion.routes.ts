import express from 'express';
import {
  suggestProductsToCustomer,
  suggestCustomersToProduct,
  getCustomerSuggestions,
  getProductSuggestions,
  updateSuggestionStatus,
  deleteSuggestion
} from '../controllers/suggestion.controller';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Suggestion:
 *       type: object
 *       properties:
 *         direction:
 *           type: string
 *           enum: [customer_to_product, product_to_customer]
 *           description: Öneri yönü
 *         sourceId:
 *           type: string
 *           description: Öneri kaynağı ID'si
 *         sourceType:
 *           type: string
 *           enum: [Customer, Product]
 *           description: Öneri kaynağı tipi
 *         targetId:
 *           type: string
 *           description: Öneri hedefi ID'si
 *         targetType:
 *           type: string
 *           enum: [Customer, Product]
 *           description: Öneri hedefi tipi
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *           description: Öneri durumu
 *         respondedAt:
 *           type: string
 *           format: date-time
 *           description: Yanıt tarihi
 *         responseNote:
 *           type: string
 *           description: Yanıt notu
 *         suggestedAt:
 *           type: string
 *           format: date-time
 *           description: Öneri tarihi
 *         isActive:
 *           type: boolean
 *           description: Öneri aktif mi?
 */

/**
 * @swagger
 * /api/suggestions/customer/{customerId}/products:
 *   post:
 *     summary: Müşteriye ürün önerisi oluştur
 *     tags: [Suggestions]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: Müşteri ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productIds
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Önerilecek ürün ID'leri
 *               note:
 *                 type: string
 *                 description: Öneri notu (opsiyonel)
 *     responses:
 *       201:
 *         description: Öneri başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Suggestion'
 *       400:
 *         description: Geçersiz veri
 *       404:
 *         description: Müşteri veya ürün bulunamadı
 */
router.post('/customer/:customerId/products', suggestProductsToCustomer);

/**
 * @swagger
 * /api/suggestions/product/{productId}/customers:
 *   post:
 *     summary: Ürüne müşteri önerisi oluştur
 *     tags: [Suggestions]
 *     parameters:
 *       - in: path
 *         name: productId
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
 *             required:
 *               - customerIds
 *             properties:
 *               customerIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Önerilecek müşteri ID'leri
 *               note:
 *                 type: string
 *                 description: Öneri notu (opsiyonel)
 *     responses:
 *       201:
 *         description: Öneri başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Suggestion'
 *       400:
 *         description: Geçersiz veri
 *       404:
 *         description: Ürün veya müşteri bulunamadı
 */
router.post('/product/:productId/customers', suggestCustomersToProduct);

/**
 * @swagger
 * /api/suggestions/customer/{customerId}:
 *   get:
 *     summary: Müşterinin önerilerini getir
 *     tags: [Suggestions]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: Müşteri ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *         description: Öneri durumu
 *     responses:
 *       200:
 *         description: Müşterinin önerileri başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Suggestion'
 *       404:
 *         description: Öneri bulunamadı
 */
router.get('/customer/:customerId', getCustomerSuggestions);

/**
 * @swagger
 * /api/suggestions/product/{productId}:
 *   get:
 *     summary: Ürünün önerilerini getir
 *     tags: [Suggestions]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: Ürün ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *         description: Öneri durumu
 *     responses:
 *       200:
 *         description: Ürünün önerileri başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Suggestion'
 *       404:
 *         description: Öneri bulunamadı
 */
router.get('/product/:productId', getProductSuggestions);

/**
 * @swagger
 * /api/suggestions/{suggestionId}/status:
 *   put:
 *     summary: Öneri durumunu güncelle
 *     tags: [Suggestions]
 *     parameters:
 *       - in: path
 *         name: suggestionId
 *         schema:
 *           type: string
 *         required: true
 *         description: Öneri ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected]
 *                 description: Yeni öneri durumu
 *               responseNote:
 *                 type: string
 *                 description: Yanıt notu
 *     responses:
 *       200:
 *         description: Öneri durumu başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Suggestion'
 *       400:
 *         description: Geçersiz durum veya öneri zaten yanıtlanmış
 *       404:
 *         description: Öneri bulunamadı
 */
router.put('/:suggestionId/status', updateSuggestionStatus);

/**
 * @swagger
 * /api/suggestions/{suggestionId}:
 *   delete:
 *     summary: Öneriyi sil
 *     tags: [Suggestions]
 *     parameters:
 *       - in: path
 *         name: suggestionId
 *         schema:
 *           type: string
 *         required: true
 *         description: Öneri ID
 *     responses:
 *       200:
 *         description: Öneri başarıyla silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Öneri başarıyla silindi
 *       404:
 *         description: Öneri bulunamadı
 */
router.delete('/:suggestionId', deleteSuggestion);

export default router; 