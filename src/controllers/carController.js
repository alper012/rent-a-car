const Car = require('../models/Car');

exports.getCarById = async (req, res) => {
  const carId = req.params.id;

  try {
    // Veritabanından carId ile araba bul
    const car = await Car.findByPk(carId);

    // Eğer araba bulunamazsa hata mesajı döndür
    if (!car) {
      return res.status(404).json({ message: 'Araba bulunamadı' });
    }

    // Araba bulunursa başarıyla yanıt ver
    res.status(200).json({
      message: 'Araba bulundu',
      car: car,
    });
  } catch (error) {
    // Hata durumunda yanıt ver
    res.status(500).json({
      message: 'Araba aranırken bir hata meydana geldi',
      error: error.message,
    });
  }
};

exports.getAllCars = async (req, res) => {
  try {
    // Veritabanından tüm arabaları getir
    const cars = await Car.findAll();

    if (cars.length === 0) {
      return res.status(404).json({ message: 'Hiç araba bulunamadı' });
    }

    res.status(200).json({
      message: 'Tüm arabalar başarıyla getirildi',
      cars: cars,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Arabalar alınırken bir hata meydana geldi',
      error: error.message,
    });
  }
};

exports.getMyCars = async (req, res) => {
  try {
    // Oturum açan kullanıcının ID'sini JWT'den veya session'dan alıyoruz
    const userId = req.user.id;

    // Veritabanından kullanıcıya ait arabaları bul
    const cars = await Car.findAll({ where: { userId: userId } }); // userId, Car tablosunda foreign key ve kullanıcının ID'si

    // Eğer arabalar bulunamazsa
    if (cars.length === 0) {
      return res
        .status(404)
        .json({ message: 'Bu kullanıcıya ait araba bulunamadı' });
    }

    res.status(200).json({
      message: 'Kullanıcının arabaları başarıyla getirildi',
      cars: cars,
    });
  } catch (error) {
    // Hata durumunda yanıt ver
    res.status(500).json({
      message: 'Kullanıcının arabaları getirilirken bir hata meydana geldi',
      error: error.message,
    });
  }
};

exports.createCar = async (req, res) => {
  const { make, model, year, pricePerDay } = req.body;

  // Girdilerin tam olup olmadığını kontrol et
  if (!make || !model || !year || !pricePerDay) {
    return res.status(400).json({ message: 'Tüm alanlar doldurulmalıdır' });
  }

  try {
    // Yeni bir araba oluştur
    const newCar = await Car.create({
      make,
      model,
      year,
      pricePerDay,
    });

    // Başarıyla oluşturulursa yanıt ver
    res.status(201).json({
      message: 'Araba başarıyla oluşturuldu',
      car: newCar, // Oluşturulan araba bilgilerini döndür
    });
  } catch (error) {
    // Hata durumunda yanıt ver
    res.status(500).json({
      message: 'Araba oluşturulurken bir hata meydana geldi',
      error: error.message,
    });
  }
};

exports.updateCar = async (req, res) => {
  const carId = req.params.id; // Güncellenmek istenen arabanın ID'si
  const { make, model, year, pricePerDay } = req.body; // Gönderilen güncellemeleri alıyoruz

  try {
    // Önce veritabanından güncellenecek arabayı bulalım
    const car = await Car.findByPk(carId);

    // Eğer araba bulunamazsa, 404 yanıtı gönder
    if (!car) {
      return res
        .status(404)
        .json({ message: 'Güncellenecek araba bulunamadı' });
    }

    // Arabayı güncelle
    car.make = make || car.make; // Yeni değer varsa kullan, yoksa eski değer kalsın
    car.model = model || car.model;
    car.year = year || car.year;
    car.pricePerDay = pricePerDay || car.pricePerDay;

    // Veritabanında güncelle
    await car.save();

    // Güncellenmiş araba bilgilerini döndür
    res.status(200).json({
      message: `Araba ID: ${carId} başarıyla güncellendi`,
      car: car,
    });
  } catch (error) {
    // Hata durumunda yanıt ver
    res.status(500).json({
      message: 'Araba güncellenirken bir hata meydana geldi',
      error: error.message,
    });
  }
};
