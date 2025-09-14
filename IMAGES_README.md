# Инструкции по добавлению изображений

## 📸 Необходимые изображения

### 1. Hero Background (bg.jpg)
**Путь:** `images/bg.jpg`
- **Размер:** 1920x1080px или больше
- **Формат:** JPG, PNG, WebP
- **Содержание:** Промышленное фото (нефтепереработка, химическое производство, гранулы пластика)
- **Рекомендация:** Высокое качество, горизонтальная ориентация

### 2. Продукция (products/)
**Путь:** `images/products/`

#### Нефтепродукты:
- `gasoline-mtbe.jpg` - Бензин с добавками MTBE
- `gasoline-etbe.jpg` - Бензин с добавками ETBE  
- `diesel-fuel.jpg` - Дизельное топливо
- `propylene-oxide.jpg` - Пропилен-оксид
- `acetic-acid.jpg` - Уксусная кислота

#### Полимеры:
- `pp-homopolymer.jpg` - Полипропилен гомополимер
- `pp-copolymer.jpg` - Полипропилен сополимер
- `hdpe.jpg` - Полиэтилен высокой плотности
- `ldpe.jpg` - Полиэтилен низкой плотности
- `lldpe.jpg` - Линейный полиэтилен
- `hostacom.jpg` - Hostacom материалы
- `softell.jpg` - Softell материалы
- `adsyl.jpg` - Adsyl материалы
- `hifax.jpg` - Hifax материалы

#### Специальная химия:
- `fuel-additives.jpg` - Топливные присадки
- `industrial-solvents.jpg` - Промышленные растворители
- `catalysts.jpg` - Катализаторы
- `corrosion-inhibitors.jpg` - Ингибиторы коррозии
- `surfactants.jpg` - Поверхностно-активные вещества
- `specialty-polymers.jpg` - Специальные полимеры

### 3. Сертификаты (certificates/)
**Путь:** `images/certificates/`
- `iso-9001.jpg` - ISO 9001:2015
- `iso-14001.jpg` - ISO 14001:2015
- `ohsas-18001.jpg` - OHSAS 18001
- `export-license.jpg` - Лицензия на экспорт

### 4. Команда (team/)
**Путь:** `images/team/`
- `ceo.jpg` - Генеральный директор
- `cto.jpg` - Технический директор
- `sales-director.jpg` - Директор по продажам

### 5. О компании (about/)
**Путь:** `images/about/`
- `company-overview.jpg` - Обзор компании (офис, производство)

## 📏 Технические требования

### Размеры изображений:
- **Hero background:** 1920x1080px (16:9)
- **Продукты:** 400x300px (4:3)
- **Сертификаты:** 300x400px (3:4)
- **Команда:** 300x400px (3:4)
- **О компании:** 600x400px (3:2)

### Форматы:
- **JPG** - для фотографий
- **PNG** - для изображений с прозрачностью
- **WebP** - современный формат (опционально)

### Оптимизация:
- Сжатие без потери качества
- Размер файла: не более 500KB для обычных изображений, до 2MB для hero-изображения
- Используйте инструменты: TinyPNG, ImageOptim, или онлайн-сжатие

## 🚀 Как добавить изображения

1. **Замените файл bg.jpg:**
   ```bash
   # Удалите placeholder
   rm images/bg.jpg
   
   # Добавьте ваше изображение
   cp /path/to/your/image.jpg images/bg.jpg
   ```

2. **Добавьте изображения продуктов:**
   ```bash
   # Создайте папки если нужно
   mkdir -p images/products images/certificates images/team images/about
   
   # Добавьте ваши изображения
   cp /path/to/product1.jpg images/products/
   cp /path/to/certificate1.jpg images/certificates/
   # и т.д.
   ```

3. **Загрузите на GitHub:**
   ```bash
   git add images/
   git commit -m "Add company images"
   git push origin main
   ```

## ⚠️ Важные замечания

- Все изображения должны быть оптимизированы для веба
- Используйте описательные имена файлов
- Убедитесь, что у вас есть права на использование изображений
- Для лучшей производительности используйте современные форматы (WebP)
- Тестируйте загрузку на медленных соединениях

## 🔧 Автоматическая оптимизация

Можно настроить автоматическую оптимизацию изображений при сборке:

```bash
# Установка imagemin (Node.js)
npm install --save-dev imagemin imagemin-mozjpeg imagemin-pngquant

# Скрипт для оптимизации
npm run optimize-images
```

После добавления всех изображений сайт будет полностью готов к использованию!
