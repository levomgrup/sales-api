import { Request, Response } from 'express';
import Customer, { ICustomer } from '../models/Customer';

// Tüm müşterileri getir
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find({ isActive: true });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Yeni müşteri oluştur
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const customer = new Customer(req.body);
    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
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

// ID'ye göre müşteri getir
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, isActive: true });
    if (!customer) {
      return res.status(404).json({ message: 'Müşteri bulunamadı' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Müşteri bilgilerini güncelle
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      req.body,
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ message: 'Müşteri bulunamadı' });
    }
    res.json(customer);
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

// Müşteriyi sil (soft delete)
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { isActive: false },
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ message: 'Müşteri bulunamadı' });
    }
    res.json({ message: 'Müşteri başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}; 