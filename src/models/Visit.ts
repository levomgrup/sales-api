import mongoose, { Schema, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Visit:
 *       type: object
 *       required:
 *         - customerId
 *         - visitDate
 *         - nextVisitDate
 *       properties:
 *         customerId:
 *           type: string
 *           description: Müşteri ID'si
 *         visitDate:
 *           type: string
 *           format: date-time
 *           description: Ziyaret tarihi
 *         nextVisitDate:
 *           type: string
 *           format: date-time
 *           description: Bir sonraki ziyaret tarihi
 *         status:
 *           type: string
 *           enum: [completed, scheduled, cancelled]
 *           description: Ziyaret durumu
 *           default: scheduled
 *         notes:
 *           type: string
 *           description: Ziyaret notları
 *         isActive:
 *           type: boolean
 *           description: Ziyaret kaydı aktif mi?
 *           default: true
 *       example:
 *         customerId: "507f1f77bcf86cd799439011"
 *         visitDate: "2024-03-20T10:00:00Z"
 *         nextVisitDate: "2024-04-20T10:00:00Z"
 *         status: "scheduled"
 *         notes: "Müşteri ile görüşme yapıldı"
 *         isActive: true
 */

export interface IVisit extends Document {
  customerId: mongoose.Types.ObjectId;
  visitDate: Date;
  nextVisitDate: Date;
  status: 'completed' | 'scheduled' | 'cancelled';
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VisitSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  visitDate: {
    type: Date,
    required: true
  },
  nextVisitDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'scheduled', 'cancelled'],
    default: 'scheduled'
  },
  notes: {
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

// Ziyaret tarihine göre indeks
VisitSchema.index({ visitDate: 1 });
// Müşteri ve ziyaret tarihine göre indeks
VisitSchema.index({ customerId: 1, visitDate: 1 });
// Bir sonraki ziyaret tarihine göre indeks
VisitSchema.index({ nextVisitDate: 1 });

export default mongoose.model<IVisit>('Visit', VisitSchema); 