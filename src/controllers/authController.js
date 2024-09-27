const jwt = require('jsonwebtoken'); //Token olusturmak icin
const bcrypt = require('bcrypt'); // Şifreyi hashlamak için
const User = require('../models/User');

// Login işlemini yöneten bir controller fonksiyonu
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kullanıcıyı veritabanında email ile bul
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Şifreyi karşılaştır
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Geçersiz şifre' });
    }

    // Kullanıcı doğrulandı, JWT token üret
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { // 3 parametre: kullanici bilgisi, imza icin gizli anahtar, token suresi
  
      expiresIn: '1h',
    });

    // Token'ı yanıt olarak gönder
    return res.status(200).json({
      message: 'Başarılı giriş',
      token: token, // Kullanıcıya token'ı gönderiyoruz
    });
  } catch (error) {
    return res.status(500).json({ message: 'Sunucu hatası', error });
  }
};

// Register işlemi
exports.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Şifreyi hash'le
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'Kayıt başarılı', user });
  } catch (error) {
    return res.status(500).json({ message: 'Sunucu hatası', error });
  }
};

// Şifremi Unuttum (Forgot Password) işlemi
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Gerçek hayatta burada kullanıcıya bir sıfırlama e-postası gönderilir.
    // Örneğin, reset token oluşturulup kullanıcının e-posta adresine gönderilebilir.

    return res
      .status(200)
      .json({ message: 'Şifre sıfırlama bağlantısı gönderildi' });
  } catch (error) {
    return res.status(500).json({ message: 'Sunucu hatası', error });
  }
};

// Şifre Sıfırlama (Reset Password) işlemi
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Gerçek hayatta token doğrulama işlemi yapılır.
    // Örneğin, bu token'ı veritabanında tutabilir ve kontrol edebilirsiniz.

    // Token doğrulandıktan sonra, kullanıcıya yeni şifreyi güncelle
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Yeni şifreyi hash'le

    // Örnek olarak token üzerinden kullanıcıya erişip şifresini güncelleyelim
    const user = await User.findOne({ where: { resetPasswordToken: token } });
    if (!user) {
      return res.status(404).json({ message: 'Geçersiz token' });
    }

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Şifre başarıyla güncellendi' });
  } catch (error) {
    return res.status(500).json({ message: 'Sunucu hatası', error });
  }
};
