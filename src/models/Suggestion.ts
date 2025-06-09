import mongoose, { Schema, Document } from 'mongoose';

export interface ISuggestion extends Document {
  direction: 'customer_to_product' | 'product_to_customer';
  sourceId: mongoose.Types.ObjectId;
  sourceType: 'Customer' | 'Product';
  targetId: mongoose.Types.ObjectId;
  targetType: 'Customer' | 'Product';
  status: 'pending' | 'accepted' | 'rejected';
  respondedAt?: Date;
  responseNote?: string;
  suggestionNote?: string;
  suggestedAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SuggestionSchema = new Schema({
  direction: {
    type: String,
    enum: ['customer_to_product', 'product_to_customer'],
    required: true
  },
  sourceId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'sourceType'
  },
  sourceType: {
    type: String,
    enum: ['Customer', 'Product'],
    required: true
  },
  targetId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType'
  },
  targetType: {
    type: String,
    enum: ['Customer', 'Product'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  respondedAt: Date,
  responseNote: String,
  suggestionNote: String,
  suggestedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Performans için indeksler
SuggestionSchema.index({ sourceId: 1, targetId: 1, isActive: 1 });
SuggestionSchema.index({ direction: 1, isActive: 1 });
SuggestionSchema.index({ suggestedAt: -1 });

export default mongoose.model<ISuggestion>('Suggestion', SuggestionSchema); 