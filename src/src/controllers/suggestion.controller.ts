import { Request, Response } from 'express';
import Suggestion, { ISuggestion } from '../models/Suggestion';
import Product from '../models/Product';
import Customer from '../models/Customer';
import mongoose from 'mongoose';

// Müşteriye ürün önerisi oluştur
export const suggestProductsToCustomer = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const { productIds, note } = req.body as { productIds: string[]; note?: string };

    // Müşteri kontrolü
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Müşteri bulunamadı' });
    }

    // Ürünlerin varlığını kontrol et
    const products = await Product.find({ _id: { $in: productIds } });
    if (products.length !== productIds.length) {
      return res.status(404).json({ message: 'Bazı ürünler bulunamadı' });
    }

    // Her ürün için çift yönlü öneri oluştur
    const suggestions = productIds.flatMap(productId => [
      // Üründen müşteriye öneri
      new Suggestion({
        direction: 'product_to_customer',
        sourceId: new mongoose.Types.ObjectId(productId),
        sourceType: 'Product',
        targetId: new mongoose.Types.ObjectId(customerId),
        targetType: 'Customer',
        status: 'pending',
        suggestionNote: note
      }),
      // Müşteriden ürüne öneri
      new Suggestion({
        direction: 'customer_to_product',
        sourceId: new mongoose.Types.ObjectId(customerId),
        sourceType: 'Customer',
        targetId: new mongoose.Types.ObjectId(productId),
        targetType: 'Product',
        status: 'pending',
        suggestionNote: note
      })
    ]);

    await Suggestion.insertMany(suggestions);

    // Populate ile detaylı bilgileri getir
    const populatedSuggestions = await Suggestion.find({
      $or: [
        { sourceId: customerId, sourceType: 'Customer' },
        { targetId: customerId, targetType: 'Customer' }
      ],
      isActive: true
    })
    .populate('sourceId', 'name price description storeName phone')
    .populate('targetId', 'name price description storeName phone');

    res.status(201).json(populatedSuggestions);
  } catch (error: any) {
    res.status(400).json({
      message: 'Geçersiz veri',
      error: error.message
    });
  }
};

// Ürüne müşteri önerisi oluştur
export const suggestCustomersToProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { customerIds, note } = req.body as { customerIds: string[]; note?: string };

    // Ürün kontrolü
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    // Müşterilerin varlığını kontrol et
    const customers = await Customer.find({ _id: { $in: customerIds } });
    if (customers.length !== customerIds.length) {
      return res.status(404).json({ message: 'Bazı müşteriler bulunamadı' });
    }

    // Her müşteri için çift yönlü öneri oluştur
    const suggestions = customerIds.flatMap(customerId => [
      // Müşteriden ürüne öneri
      new Suggestion({
        direction: 'customer_to_product',
        sourceId: new mongoose.Types.ObjectId(customerId),
        sourceType: 'Customer',
        targetId: new mongoose.Types.ObjectId(productId),
        targetType: 'Product',
        status: 'pending',
        suggestionNote: note
      }),
      // Üründen müşteriye öneri
      new Suggestion({
        direction: 'product_to_customer',
        sourceId: new mongoose.Types.ObjectId(productId),
        sourceType: 'Product',
        targetId: new mongoose.Types.ObjectId(customerId),
        targetType: 'Customer',
        status: 'pending',
        suggestionNote: note
      })
    ]);

    await Suggestion.insertMany(suggestions);

    // Populate ile detaylı bilgileri getir
    const populatedSuggestions = await Suggestion.find({
      $or: [
        { sourceId: productId, sourceType: 'Product' },
        { targetId: productId, targetType: 'Product' }
      ],
      isActive: true
    })
    .populate('sourceId', 'name price description storeName phone')
    .populate('targetId', 'name price description storeName phone');

    res.status(201).json(populatedSuggestions);
  } catch (error: any) {
    res.status(400).json({
      message: 'Geçersiz veri',
      error: error.message
    });
  }
};

// Müşterinin önerilerini getir
export const getCustomerSuggestions = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const { status } = req.query as { status?: string };

    const query: any = {
      $or: [
        { sourceId: customerId, sourceType: 'Customer' },
        { targetId: customerId, targetType: 'Customer' }
      ],
      isActive: true
    };

    if (status) {
      query.status = status;
    }

    const suggestions = await Suggestion.find(query)
      .populate('sourceId', 'name price description storeName phone')
      .populate('targetId', 'name price description storeName phone');

    if (!suggestions.length) {
      return res.status(404).json({ message: 'Öneri bulunamadı' });
    }

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Ürünün önerilerini getir
export const getProductSuggestions = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { status } = req.query as { status?: string };

    const query: any = {
      $or: [
        { sourceId: productId, sourceType: 'Product' },
        { targetId: productId, targetType: 'Product' }
      ],
      isActive: true
    };

    if (status) {
      query.status = status;
    }

    const suggestions = await Suggestion.find(query)
      .populate('sourceId', 'name price description storeName phone')
      .populate('targetId', 'name price description storeName phone');

    if (!suggestions.length) {
      return res.status(404).json({ message: 'Öneri bulunamadı' });
    }

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Öneri durumunu güncelle
export const updateSuggestionStatus = async (req: Request, res: Response) => {
  try {
    const { suggestionId } = req.params;
    const { status, responseNote } = req.body as { status: string; responseNote?: string };
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        message: 'Geçersiz durum. Sadece "accepted" veya "rejected" olabilir.'
      });
    }

    const suggestion = await Suggestion.findOne({
      _id: suggestionId,
      isActive: true
    });

    if (!suggestion) {
      return res.status(404).json({ message: 'Öneri bulunamadı' });
    }

    if (suggestion.status !== 'pending') {
      return res.status(400).json({ message: 'Bu öneri zaten yanıtlanmış' });
    }

    // Çift yönlü öneriyi güncelle
    await Suggestion.updateMany(
      {
        $or: [
          {
            sourceId: suggestion.sourceId,
            sourceType: suggestion.sourceType,
            targetId: suggestion.targetId,
            targetType: suggestion.targetType
          },
          {
            sourceId: suggestion.targetId,
            sourceType: suggestion.targetType,
            targetId: suggestion.sourceId,
            targetType: suggestion.sourceType
          }
        ],
        isActive: true
      },
      {
        status: status as 'accepted' | 'rejected',
        respondedAt: new Date(),
        responseNote
      }
    );

    const updatedSuggestions = await Suggestion.find({
      $or: [
        {
          sourceId: suggestion.sourceId,
          sourceType: suggestion.sourceType,
          targetId: suggestion.targetId,
          targetType: suggestion.targetType
        },
        {
          sourceId: suggestion.targetId,
          sourceType: suggestion.targetType,
          targetId: suggestion.sourceId,
          targetType: suggestion.sourceType
        }
      ],
      isActive: true
    })
    .populate('sourceId', 'name price description storeName phone')
    .populate('targetId', 'name price description storeName phone');

    res.json(updatedSuggestions);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Öneriyi sil (soft delete)
export const deleteSuggestion = async (req: Request, res: Response) => {
  try {
    const { suggestionId } = req.params;
    
    const suggestion = await Suggestion.findOne({
      _id: suggestionId,
      isActive: true
    });

    if (!suggestion) {
      return res.status(404).json({ message: 'Öneri bulunamadı' });
    }

    // Çift yönlü öneriyi sil
    await Suggestion.updateMany(
      {
        $or: [
          {
            sourceId: suggestion.sourceId,
            sourceType: suggestion.sourceType,
            targetId: suggestion.targetId,
            targetType: suggestion.targetType
          },
          {
            sourceId: suggestion.targetId,
            sourceType: suggestion.targetType,
            targetId: suggestion.sourceId,
            targetType: suggestion.sourceType
          }
        ],
        isActive: true
      },
      { isActive: false }
    );
    
    res.json({ message: 'Öneri başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}; 