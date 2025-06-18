import { Request, Response } from 'express';
import Visit, { IVisit } from '../models/Visit';
import Customer from '../models/Customer';

// Yeni ziyaret kaydı oluştur
export const createVisit = async (req: Request, res: Response) => {
  try {
    const { customerId, visitDate, notes } = req.body;

    // Müşteriyi kontrol et
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Müşteri bulunamadı' });
    }

    // Bir sonraki ziyaret tarihini hesapla
    const nextVisitDate = new Date(visitDate);
    nextVisitDate.setDate(nextVisitDate.getDate() + customer.visitFrequency);

    const visit = new Visit({
      customerId,
      visitDate,
      nextVisitDate,
      notes,
      status: 'scheduled'
    });

    await visit.save();
    res.status(201).json(visit);
  } catch (error) {
    res.status(500).json({ message: 'Ziyaret kaydı oluşturulurken bir hata oluştu', error });
  }
};

// Ziyaret kaydını güncelle
export const updateVisit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { visitDate, status, notes } = req.body;

    const visit = await Visit.findById(id);
    if (!visit) {
      return res.status(404).json({ message: 'Ziyaret kaydı bulunamadı' });
    }

    // Eğer ziyaret tarihi değiştiyse, bir sonraki ziyaret tarihini güncelle
    if (visitDate && visitDate !== visit.visitDate) {
      const customer = await Customer.findById(visit.customerId);
      if (customer) {
        const nextVisitDate = new Date(visitDate);
        nextVisitDate.setDate(nextVisitDate.getDate() + customer.visitFrequency);
        visit.nextVisitDate = nextVisitDate;
      }
    }

    visit.visitDate = visitDate || visit.visitDate;
    visit.status = status || visit.status;
    visit.notes = notes || visit.notes;

    await visit.save();
    res.json(visit);
  } catch (error) {
    res.status(500).json({ message: 'Ziyaret kaydı güncellenirken bir hata oluştu', error });
  }
};

// Ziyaret kaydını sil (soft delete)
export const deleteVisit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const visit = await Visit.findById(id);
    
    if (!visit) {
      return res.status(404).json({ message: 'Ziyaret kaydı bulunamadı' });
    }

    visit.isActive = false;
    await visit.save();
    
    res.json({ message: 'Ziyaret kaydı başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Ziyaret kaydı silinirken bir hata oluştu', error });
  }
};

// Ziyaret kaydını getir
export const getVisit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const visit = await Visit.findById(id).populate('customerId');
    
    if (!visit) {
      return res.status(404).json({ message: 'Ziyaret kaydı bulunamadı' });
    }

    res.json(visit);
  } catch (error) {
    res.status(500).json({ message: 'Ziyaret kaydı getirilirken bir hata oluştu', error });
  }
};

// Tüm ziyaret kayıtlarını getir
export const getAllVisits = async (req: Request, res: Response) => {
  try {
    const { status, startDate, endDate, customerId } = req.query;
    
    const query: any = { isActive: true };
    
    if (status) query.status = status;
    if (customerId) query.customerId = customerId;
    if (startDate && endDate) {
      query.visitDate = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const visits = await Visit.find(query)
      .populate('customerId')
      .sort({ visitDate: -1 });

    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: 'Ziyaret kayıtları getirilirken bir hata oluştu', error });
  }
};

// Ziyaret sıklığını aşan müşterileri getir
export const getOverdueVisits = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    
    const overdueVisits = await Visit.find({
      nextVisitDate: { $lt: today },
      status: { $ne: 'cancelled' },
      isActive: true
    })
    .populate('customerId')
    .sort({ nextVisitDate: 1 });

    res.json(overdueVisits);
  } catch (error) {
    res.status(500).json({ message: 'Gecikmiş ziyaretler getirilirken bir hata oluştu', error });
  }
};

// Otomatik ziyaret yönetimi
export const manageAutomaticVisits = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Geçmiş ziyaretleri kontrol et ve iptal et
    await Visit.updateMany(
      {
        visitDate: { $lt: today },
        status: { $nin: ['completed', 'cancelled'] },
        isActive: true
      },
      {
        $set: { status: 'cancelled' }
      }
    );

    // 2. Sonraki ziyaret tarihi gelmiş olanları yeni ziyaret olarak oluştur
    const visitsToUpdate = await Visit.find({
      nextVisitDate: { $lte: today },
      status: 'scheduled',
      isActive: true
    }).populate('customerId');

    for (const visit of visitsToUpdate) {
      const customer = visit.customerId as any; // Customer tipini any olarak belirtiyoruz çünkü populate edilmiş

      // Eski ziyareti tamamlandı olarak işaretle
      visit.status = 'completed';
      await visit.save();

      // Yeni ziyaret oluştur
      const newVisit = new Visit({
        customerId: customer._id,
        visitDate: visit.nextVisitDate, // Eski sonraki ziyaret tarihi yeni ziyaret tarihi olur
        nextVisitDate: new Date(visit.nextVisitDate.getTime() + (customer.visitFrequency * 24 * 60 * 60 * 1000)), // Yeni sonraki ziyaret tarihi
        status: 'scheduled',
        isActive: true
      });

      await newVisit.save();
    }
  } catch (error) {
    console.error('Otomatik ziyaret yönetimi sırasında hata:', error);
  }
};

// Manuel test için endpoint
export const testAutomaticVisits = async (req: Request, res: Response) => {
  try {
    await manageAutomaticVisits();
    res.json({ message: 'Otomatik ziyaret yönetimi başarıyla çalıştırıldı' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Otomatik ziyaret yönetimi sırasında hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
}; 