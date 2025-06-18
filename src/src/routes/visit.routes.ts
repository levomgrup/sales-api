import express from 'express';
import {
  createVisit,
  updateVisit,
  deleteVisit,
  getVisit,
  getAllVisits,
  getOverdueVisits,
  testAutomaticVisits
} from '../controllers/visitController';

const router = express.Router();

/**
 * @swagger
 * /api/visits:
 *   post:
 *     summary: Yeni ziyaret kaydı oluştur
 *     tags: [Visits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - visitDate
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: Müşteri ID'si
 *               visitDate:
 *                 type: string
 *                 format: date-time
 *                 description: Ziyaret tarihi
 *               notes:
 *                 type: string
 *                 description: Ziyaret notları
 *     responses:
 *       201:
 *         description: Ziyaret kaydı başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visit'
 *       404:
 *         description: Müşteri bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.post('/', createVisit);

/**
 * @swagger
 * /api/visits/{id}:
 *   put:
 *     summary: Ziyaret kaydını güncelle
 *     tags: [Visits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ziyaret ID'si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visitDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [completed, scheduled, cancelled]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ziyaret kaydı başarıyla güncellendi
 *       404:
 *         description: Ziyaret kaydı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.put('/:id', updateVisit);

/**
 * @swagger
 * /api/visits/{id}:
 *   delete:
 *     summary: Ziyaret kaydını sil (soft delete)
 *     tags: [Visits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ziyaret ID'si
 *     responses:
 *       200:
 *         description: Ziyaret kaydı başarıyla silindi
 *       404:
 *         description: Ziyaret kaydı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.delete('/:id', deleteVisit);

/**
 * @swagger
 * /api/visits/{id}:
 *   get:
 *     summary: Tek bir ziyaret kaydını getir
 *     tags: [Visits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ziyaret ID'si
 *     responses:
 *       200:
 *         description: Ziyaret kaydı başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visit'
 *       404:
 *         description: Ziyaret kaydı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.get('/:id', getVisit);

/**
 * @swagger
 * /api/visits:
 *   get:
 *     summary: Tüm ziyaret kayıtlarını getir
 *     tags: [Visits]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [completed, scheduled, cancelled]
 *         description: Ziyaret durumu
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Başlangıç tarihi
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Bitiş tarihi
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *         description: Müşteri ID'si
 *     responses:
 *       200:
 *         description: Ziyaret kayıtları başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Visit'
 *       500:
 *         description: Sunucu hatası
 */
router.get('/', getAllVisits);

/**
 * @swagger
 * /api/visits/overdue:
 *   get:
 *     summary: Ziyaret sıklığını aşan müşterileri getir
 *     tags: [Visits]
 *     responses:
 *       200:
 *         description: Gecikmiş ziyaretler başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Visit'
 *       500:
 *         description: Sunucu hatası
 */
router.get('/overdue', getOverdueVisits);

/**
 * @swagger
 * /api/visits/test-automatic:
 *   post:
 *     summary: Otomatik ziyaret yönetimini manuel olarak test et
 *     tags: [Visits]
 *     responses:
 *       200:
 *         description: Test başarıyla çalıştırıldı
 *       500:
 *         description: Sunucu hatası
 */
router.post('/test-automatic', testAutomaticVisits);

export default router; 