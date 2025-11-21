# AiJournalApp

Bu proje, kullanıcının yazdığı kısa günlük metinlerini analiz ederek olumlu, olumsuz veya nötr olarak sınıflandıran basit bir React Native uygulamasıdır. Uygulama aynı zamanda bu analizleri telefonda saklayarak internet yokken bile geçmiş analizleri görüntülemeye izin verir.

Proje, ücretsiz servisler kullanılarak geliştirilmiştir ve temel bir mobil AI uygulamasının nasıl kurulabileceğini göstermek amacıyla hazırlanmıştır.

---

## Proje Hakkında

Uygulamada kullanıcı bir metin yazar ve bu metin HuggingFace üzerindeki ücretsiz sentiment modeli ile analiz edilir. API'dan dönen sonuca göre uygulama kısa bir özet ve tavsiye metni üretir. Analiz sonuçları AsyncStorage içinde tutulur.

Kod yapısı basit tutulmuştur:
- iki ekran (Analiz ve Geçmiş)
- bir Context dosyası
- bir servis (ai.ts)
- temel stiller

---

## Kullanılan Teknolojiler

- React Native CLI
- TypeScript
- AsyncStorage 
- Context API
- HuggingFace ücretsiz Inference Router API
- İsteğe bağlı TR -> EN çeviri modeli (Helsinki-NLP)

Her şey ücretsiz servislerle yapılmıştır.

---

## Kurulum

Proje klasörünü klonlayın:

```bash
git clone https://github.com/ahmetcerit/AiJournalApp.git
cd AiJournalApp
```

Bağımlılıkları yükleyin:

```bash
npm install
```

Ardından proje köküne bir `.env` dosyası oluşturun:

```
EXPO_PUBLIC_HF_API_KEY=buraya_api_key
EXPO_PUBLIC_HF_API_URL=https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-xlm-roberta-base-sentiment
```

Çalıştırmak için:

```bash
npm run android
```

veya

```bash
npm run ios
```

---

## Kullanılan AI Modeli ve API Açıklaması

Sentiment analizi için HuggingFace üzerindeki:

```
cardiffnlp/twitter-xlm-roberta-base-sentiment
```

modeli kullanılmaktadır.

Metin Türkçe ise daha doğru sonuç almak için gerekirse TR -> EN çeviri modeli kullanılır:

```
Helsinki-NLP/opus-mt-tr-en
```

Her iki model de HuggingFace Inference Router üzerinden ücretsiz olarak çağrılır.

API entegrasyonu tamamen `ai.ts` dosyasında yapılmıştır. Yanıttaki label ve score değerleri kontrol edilerek uygulamanın kendi sentiment sonucu üretilir.

Skor hesaplama mantığını (`ai.ts`) ve geçmiş yönetimi için Context kullanımını (`HistoryScreen.tsx`) hazırlarken ChatGPT’den öneriler alınmıştır; final versiyonları projeye göre düzenlenmiştir.

---

## Offline Çalışma

Tüm analiz sonuçları AsyncStorage içinde saklanır.
Bu sayede internet kesilse bile:

- Geçmiş ekranı çalışmaya devam eder
- Önceki analizler okunabilir

---

## Ekranlar

- Analiz Ekranı: Metin girişi ve analiz butonu
- Geçmiş Ekranı: Önceki analizlerin listesi
- Tümünü Sil butonu ile geçmişi temizleme

Ekran görüntüleri ve kısa tanıtım videosu teslim klasörüne eklenecektir.

---

## Notlar

- Proje süresi: 3 gün
- Tüm servisler ücretsizdir
- Kod yapısı sade ve anlaşılır tutulmuştur
- AI servis kullanımı README içinde şeffaf olarak açıklanmıştır


---
## Demo Video

https://github.com/ahmetcerit01/AiJournalApp/blob/main/demo/application.mov


Bu proje, temel bir duygu analizi uygulamasının mobilde nasıl kurulabileceğini göstermek amacıyla hazırlanmıştır.
