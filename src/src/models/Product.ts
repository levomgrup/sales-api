import mongoose, { Schema, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - stock
 *       properties:
 *         name:
 *           type: string
 *           description: Ürün adı
 *         description:
 *           type: string
 *           description: Ürün açıklaması
 *         price:
 *           type: number
 *           description: Ürün fiyatı
 *           minimum: 0
 *         stock:
 *           type: number
 *           description: Stok miktarı
 *           minimum: 0
 *         category:
 *           type: string
 *           description: Ürün kategorisi
 *         isActive:
 *           type: boolean
 *           description: Ürün aktif mi?
 *           default: true
 *       example:
 *         name: "Örnek Ürün"
 *         description: "Bu bir örnek ürün açıklamasıdır"
 *         price: 99.99
 *         stock: 100
 *         category: "Elektronik"
 *         isActive: true
 */

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Ürün adı zorunludur'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Ürün fiyatı zorunludur'],
    min: [0, 'Fiyat 0\'dan küçük olamaz']
  },
  stock: {
    type: Number,
    required: [true, 'Stok miktarı zorunludur'],
    min: [0, 'Stok 0\'dan küçük olamaz']
  },
  category: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema); 