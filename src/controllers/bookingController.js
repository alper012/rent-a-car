const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');

exports.bookCar = (req, res) => {
  const authHeader = req.headers['authorization']; //authorization header'dan tokeni al
  const token = authHeader && authHeader.split(' ')[1]; // eger authHeader falsy degilse diziyi bosluk karakterine gore iki parcaya ayir ve 1.indexi al

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Token'ı doğrula
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Token'dan gelen userId
    const tokenUserId = decoded.userId;

    // İstek gövdesinden gelen carId, userId, date
    const { carId, userId, date } = req.body;

    // İstek gövdesindeki userId ile token'daki userId'yi karşılaştır
    if (userId !== tokenUserId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized: User ID mismatch' });
    }

    // Eksik parametre kontrolü
    if (!carId || !userId || !date) {
      return res
        .status(400)
        .json({ message: 'Please provide carId, userId, and date' });
    }

    // Tarih format kontrolü (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date.match(dateRegex)) {
      return res
        .status(400)
        .json({ message: 'Invalid date format. Please use YYYY-MM-DD.' });
    }

    // Tarih doğrulama
    const bookingDate = new Date(date);
    const currentDate = new Date();

    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (bookingDate < currentDate) {
      return res
        .status(400)
        .json({ message: 'Booking date cannot be in the past' });
    }

    // Eğer tüm kontroller geçtiyse, başarılı yanıt
    return res.status(201).json({ message: 'Car booked successfully' });
  });
};

exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.body;

  // Eğer bookingId gönderilmediyse
  if (!bookingId) {
    return res.status(400).json({ message: 'Please provide bookingId' });
  }

  try {
    // Veritabanında bookingId'yi arıyoruz
    const booking = await Booking.findOne({ where: { id: bookingId } });

    // Eğer bu bookingId ile eşleşen bir kayıt bulunmazsa
    if (!booking) {
      console.error('Yakalanan Hata:', error);
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Eğer booking varsa (burada iptal etme işlemini yapabilirsiniz)
    await booking.destroy(); // Bu işlem rezervasyonu siler (iptal eder)

    return res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message || error });
  }
};

exports.getBooking = (req, res) => {
  const { bookingId } = req.query;

  if (!bookingId) {
    return res.status(400).json({ message: 'Please provide bookingId' });
  }

  return res.status(200).json({
    message: 'Booking details retrieved successfully',
    bookingDetails: {
      bookingId,
      carId: '123',
      userId: '456',
      date: '2021-12-31',
    },
  });
};
