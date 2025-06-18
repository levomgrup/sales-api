import express from 'express';
import customerRoutes from './customer.routes';
import productRoutes from './product.routes';
import visitRoutes from './visit.routes';
import suggestionRoutes from './suggestion.routes';

const router = express.Router();

// Tüm route'ları birleştir
router.use('/customers', customerRoutes);
router.use('/products', productRoutes);
router.use('/visits', visitRoutes);
router.use('/suggestions', suggestionRoutes);

export default router; 