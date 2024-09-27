const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  const { name, surname, password } = req.body;

  try {
    // Şifreyi hashle
    const saltRounds = 10; // bcrypt için önerilen minimum salt rounds sayısı
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({ name, surname, hashedPassword });
    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu',
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Kullanıcı oluşturulurken bir hata oluştu',
      error: error.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      message: 'Kullanıcı alınırken bir hata oluştu',
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id; // Güncellenecek kullanıcının ID'si
  const { firstName, lastName, email, password } = req.body; // İstek gövdesinden gelen veriler

  try {
    // Veritabanından kullanıcıyı ID'ye göre bul
    const user = await User.findByPk(userId);

    // Kullanıcı bulunamazsa 404 yanıtı dön
    if (!user) {
      return res
        .status(404)
        .json({ message: 'Güncellenecek kullanıcı bulunamadı' });
    }

    // Gelen değerler yoksa mevcut verileri kullan
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;

    // Şifre güncellenmişse, bcrypt ile hashle ve kaydet
    if (password) {
      const saltRounds = 10; // bcrypt'in kullandığı salt round değeri
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      user.password = hashedPassword;
    }
// 
    // Güncellenmiş veriyi kaydet
    await user.save();

    // Başarılı yanıt
    res.status(200).json({
      message: 'Kullanıcı başarıyla güncellendi',
      user,
    });
  } catch (error) {
    // Hata durumu
    res.status(500).json({
      message: 'Kullanıcı güncellenirken bir hata oluştu',
      error: error.message,
    });
  }
};
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: 'Silinecek kullanıcı bulunamadı' });
    }

    await user.destroy();
    res.status(200).json({
      message: 'Kullanıcı başarıyla silindi',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Kullanıcı silinirken bir hata oluştu',
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({
      message: 'Kullanıcılar alınırken bir hata oluştu',
      error: error.message,
    });
  }
};
