# Sales Management API Dokümantasyonu

## Genel Bilgiler

- Base URL: `http://localhost:5000/api`
- Tüm istekler JSON formatında yapılmalıdır
- Tüm yanıtlar JSON formatında döner
- Tarih formatı: ISO 8601 (örn: "2024-03-20T10:00:00Z")
- Tüm silme işlemleri soft delete olarak gerçekleştirilir

## 1. Müşteri (Customer) Endpoint'leri

### Müşteri Oluşturma
```http
POST /api/customers
```
**İstek Gövdesi:**
```json
{
  "storeName": "ABC Market",
  "authorizedPersons": ["Ahmet Yılmaz", "Mehmet Demir"],
  "phone": "0212 555 55 55",
  "address": "Örnek Mahallesi, Örnek Sokak No:1",
  "city": "İstanbul",
  "district": "Kadıköy",
  "locationLink": "https://maps.google.com/...",
  "routineName": "Pazartesi Rutini",
  "initialPoints": 100,
  "visitFrequency": 30
}
```

### Müşteri Listeleme
```http
GET /api/customers
```

### Müşteri Detayı
```http
GET /api/customers/:id
```

### Müşteri Güncelleme
```http
PUT /api/customers/:id
```

### Müşteri Silme (Soft Delete)
```http
DELETE /api/customers/:id
```

## 2. Ziyaret (Visit) Endpoint'leri

### Ziyaret Oluşturma
```http
POST /api/visits
```
**İstek Gövdesi:**
```json
{
  "customerId": "müşteri_id",
  "visitDate": "2024-03-20T10:00:00Z",
  "notes": "Müşteri ile görüşme yapıldı"
}
```

### Ziyaret Listeleme
```http
GET /api/visits
```
**Query Parametreleri:**
- `status`: Ziyaret durumu (completed, scheduled, cancelled)
- `startDate`: Başlangıç tarihi
- `endDate`: Bitiş tarihi
- `customerId`: Müşteri ID'si

### Ziyaret Detayı
```http
GET /api/visits/:id
```

### Ziyaret Güncelleme
```http
PUT /api/visits/:id
```
**İstek Gövdesi:**
```json
{
  "visitDate": "2024-03-20T10:00:00Z",
  "status": "completed",
  "notes": "Güncellenmiş notlar"
}
```

### Ziyaret Silme (Soft Delete)
```http
DELETE /api/visits/:id
```

### Gecikmiş Ziyaretleri Listeleme
```http
GET /api/visits/overdue
```

## 3. Ürün (Product) Endpoint'leri

### Ürün Oluşturma
```http
POST /api/products
```
**İstek Gövdesi:**
```json
{
  "name": "Örnek Ürün",
  "description": "Ürün açıklaması",
  "price": 99.99,
  "stock": 100,
  "category": "Elektronik"
}
```

### Ürün Listeleme
```http
GET /api/products
```

### Ürün Detayı
```http
GET /api/products/:id
```

### Ürün Güncelleme
```http
PUT /api/products/:id
```

### Ürün Silme (Soft Delete)
```http
DELETE /api/products/:id
```

## Hata Kodları

- `200 OK`: İşlem başarılı
- `201 Created`: Yeni kayıt oluşturuldu
- `400 Bad Request`: Geçersiz istek
- `404 Not Found`: Kayıt bulunamadı
- `500 Internal Server Error`: Sunucu hatası

## Örnek Kullanımlar

### 1. Yeni Müşteri Oluşturma
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "storeName": "ABC Market",
    "phone": "0212 555 55 55",
    "address": "Örnek Mahallesi",
    "city": "İstanbul",
    "district": "Kadıköy",
    "routineName": "Pazartesi Rutini",
    "initialPoints": 100,
    "visitFrequency": 30
  }'
```

### 2. Müşteri için Ziyaret Oluşturma
```bash
curl -X POST http://localhost:5000/api/visits \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "müşteri_id",
    "visitDate": "2024-03-20T10:00:00Z",
    "notes": "İlk ziyaret"
  }'
```

### 3. Gecikmiş Ziyaretleri Listeleme
```bash
curl -X GET http://localhost:5000/api/visits/overdue
```

## Frontend Entegrasyonu İçin Öneriler

1. Axios veya Fetch API kullanarak HTTP istekleri yapabilirsiniz
2. Tüm isteklerde `Content-Type: application/json` header'ını eklemeyi unutmayın
3. Tarih işlemleri için `date-fns` veya `moment.js` kütüphanelerini kullanabilirsiniz
4. Form validasyonları için `yup` veya `zod` kütüphanelerini öneriyoruz
5. State yönetimi için Redux veya Context API kullanabilirsiniz

## Güvenlik

- Tüm endpoint'ler CORS korumalıdır
- İleride JWT tabanlı kimlik doğrulama eklenecektir
- Hassas veriler için rate limiting uygulanacaktır 