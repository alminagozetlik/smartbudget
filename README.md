# SmartBudget – Kişisel Bütçe Takip Uygulaması

SmartBudget, kullanıcıların gelir ve giderlerini kolayca takip edebilmeleri, aylık bütçe hedefleri belirleyebilmeleri ve harcamalarını grafiklerle analiz edebilmeleri için geliştirilmiş web tabanlı bir kişisel finans uygulamasıdır.

## Projenin Amacı

Bu projenin amacı, kişisel finans yönetimini kolaylaştıran, kullanıcı dostu ve mobil uyumlu bir web uygulaması geliştirmektir.

## Özellikler

- **Dashboard:** Toplam bakiye, gelir ve giderleri görüntüleme
- **İşlem Yönetimi:** Gelir ve gider ekleme, arama, filtreleme ve silme
- **Bütçe Yönetimi:** Aylık harcama limiti belirleme ve bütçe kullanımını takip etme
- **Veri Görselleştirme:** Harcamaları kategorilere göre grafikle gösterme
- **Ayarlar:** Kullanıcı adını değiştirme, CSV dışa aktarma ve işlem verilerini sıfırlama
- **Veri Saklama:** Tarayıcının localStorage özelliğiyle verileri koruma
- **Responsive Tasarım:** Mobil, tablet ve masaüstü ekranlarına uyum

## Kullanılan Teknolojiler

- React
- Vite
- JavaScript
- Tailwind CSS
- Recharts
- Lucide React
- HTML ve CSS
- localStorage

## Kurulum

Projeyi bilgisayarınızda çalıştırmak için:

```bash
git clone REPO_URL
cd smartbudget
npm install
npm run dev
```

`REPO_URL` kısmını kendi GitHub depo bağlantınızla değiştirin.

## Yapay Zekâ Kullanımı

Projenin geliştirilmesi sırasında ChatGPT'den aşağıdaki konularda destek alınmıştır:

- Proje planlaması ve bileşen yapısının oluşturulması
- React ve Tailwind CSS ile arayüz geliştirme
- Gelir/gider yönetimi ve bütçe hesaplamalarının uygulanması
- JavaScript hatalarının tespit edilmesi ve düzeltilmesi
- Mobil uyumluluk ve kullanıcı deneyimi iyileştirmeleri
- Proje dokümantasyonunun hazırlanması

Oluşturulan kodlar geliştirme sürecinde test edilmiş ve ihtiyaçlara göre düzenlenmiştir.

## Ekran Görüntüsü

Dashboard ekran görüntüsü bu bölüme eklenecektir.

## Canlı Demo

Netlify bağlantısı yayınlama işlemi tamamlandıktan sonra eklenecektir.

## Notlar

Bu proje eğitim amacıyla geliştirilmiştir. Veriler sunucuda değil, kullanıcının tarayıcısında saklanmaktadır. Farklı cihazlar arasında otomatik veri senkronizasyonu bulunmamaktadır.
