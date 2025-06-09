import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Product';

// Tüm ürünleri getir
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Yeni ürün ekle
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ 
        message: 'Validasyon hatası',
        errors: validationErrors 
      });
    }
    res.status(400).json({ 
      message: 'Geçersiz veri',
      error: error.message 
    });
  }
};

// ID'ye göre ürün getir
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Ürün bilgilerini güncelle
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }
    res.json(product);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ 
        message: 'Validasyon hatası',
        errors: validationErrors 
      });
    }
    res.status(400).json({ 
      message: 'Geçersiz veri',
      error: error.message 
    });
  }
};

// Ürünü sil (soft delete)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { isActive: false },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }
    res.json({ message: 'Ürün başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Müşteriye ürün ata
export const assignProductToCustomer = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.body;
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { assignedTo: customerId },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Müşteriden ürün atamasını kaldır
export const removeProductAssignment = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { assignedTo: null },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Müşterinin ürünlerini getir
export const getCustomerProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ 
      assignedTo: req.params.customerId,
      isActive: true 
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}; 