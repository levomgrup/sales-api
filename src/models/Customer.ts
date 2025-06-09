import mongoose, { Document, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - storeName
 *         - phone
 *         - address
 *         - city
 *         - district
 *         - visitFrequency
 *       properties:
 *         storeName:
 *           type: string
 *           description: Mağaza adı
 *         authorizedPersons:
 *           type: array
 *           items:
 *             type: string
 *           description: Yetkili kişiler
 *         phone:
 *           type: string
 *           description: Telefon numarası
 *         address:
 *           type: string
 *           description: Adres
 *         city:
 *           type: string
 *           description: İl
 *         district:
 *           type: string
 *           description: İlçe
 *         locationLink:
 *           type: string
 *           description: Konum linki
 *         routineName:
 *           type: string
 *           description: Rutin ismi
 *         initialPoints:
 *           type: number
 *           description: Başlangıç puanı
 *         visitFrequency:
 *           type: number
 *           description: "Ziyaret sıklığı (gün cinsinden)"
 *           minimum: 1
 *           default: 30
 *         isActive:
 *           type: boolean
 *           description: Müşteri aktif mi?
 *           default: true
 *       example:
 *         storeName: "ABC Market"
 *         authorizedPersons: ["Ahmet Yılmaz", "Mehmet Demir"]
 *         phone: "0212 555 55 55"
 *         address: "Örnek Mahallesi, Örnek Sokak No:1"
 *         city: "İstanbul"
 *         district: "Kadıköy"
 *         locationLink: "https://maps.google.com/..."
 *         routineName: "Pazartesi Rutini"
 *         initialPoints: 100
 *         visitFrequency: 1
 */

export interface ICustomer extends Document {
  storeName: string;
  authorizedPersons: string[];
  phone: string;
  address: string;
  city: string;
  district: string;
  locationLink?: string;
  routineName: string;
  initialPoints: number;
  visitFrequency: number; // Ziyaret sıklığı (gün cinsinden)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    storeName: {
      type: String,
      required: [true, 'Mağaza adı zorunludur'],
      trim: true,
    },
    authorizedPersons: [{
      type: String,
      trim: true,
    }],
    phone: {
      type: String,
      required: [true, 'Telefon numarası zorunludur'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Adres zorunludur'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'İl zorunludur'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'İlçe zorunludur'],
      trim: true,
    },
    locationLink: {
      type: String,
      trim: true,
    },
    routineName: {
      type: String,
      required: [true, 'Rutin ismi zorunludur'],
      trim: true,
    },
    initialPoints: {
      type: Number,
      required: [true, 'Başlangıç puanı zorunludur'],
      min: [0, 'Başlangıç puanı 0\'dan küçük olamaz'],
    },
    visitFrequency: {
      type: Number,
      required: [true, 'Ziyaret sıklığı zorunludur'],
      min: 1, // En az 1 gün
      default: 30 // Varsayılan olarak 30 gün
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICustomer>('Customer', CustomerSchema); 