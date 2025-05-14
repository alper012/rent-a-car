import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link as ChakraLink,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    // Form submit fonksiyonu.
    e.preventDefault(); // Formun sayfanın yenilenmesini engelliyoruz.
    setIsLoading(true); // Kayıt işlemi başladığında loading durumunu true yapıyoruz.

    try {
      // Kullanıcı kaydını yapıyoruz.
      await register(
        formData.firstName, // Ad
        formData.lastName, // Soyad
        formData.email, // E-posta
        formData.password // Şifre
      );

      // Başarıyla kayıt olduktan sonra toast mesajı gösteriliyor.
      toast({
        title: "Kayıt başarılı", // Toast başlığı
        description: "Hesabınız oluşturuldu. Giriş yapabilirsiniz.", // Başarı mesajı
        status: "success", // Durum başarılı
        duration: 3000, // Mesajın 3 saniye görünmesi
        isClosable: true, // Kullanıcı mesajı kapatabilsin
        position: "bottom", // Mesaj ekranın altında görünsün
      });

      // Kayıt sonrası kullanıcıyı giriş sayfasına yönlendiriyoruz.
      navigate("/login");
    } catch (error) {
      // Hata durumunda toast mesajı gösteriyoruz.
      toast({
        title: "Kayıt başarısız", // Hata başlığı
        description: error instanceof Error ? error.message : "Bir hata oluştu", // Hata mesajı
        status: "error", // Durum: hata
        duration: 3000, // Mesajın 3 saniye görünmesi
        isClosable: true, // Kullanıcı mesajı kapatabilsin
        position: "bottom", // Mesaj ekranın altında görünsün
      });
    } finally {
      setIsLoading(false); // Kayıt işlemi tamamlandığında loading durumunu false yapıyoruz.
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Form input'larının değişimlerini işleyen fonksiyon.
    const { name, value } = e.target; // Input elementinin ismini ve değerini alıyoruz.
    setFormData((prev) => ({
      // Önceki form verisini alıp üzerine yeni değeri ekliyoruz.
      ...prev, // Önceki form verisini koruyoruz.
      [name]: value, // Dinamik olarak input alanına göre form verisini güncelliyoruz.
    }));
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      {/* Kayıt formunun kapsayıcı kutusu */}
      <VStack spacing={4}>
        {" "}
        {/* Chakra UI ile form elemanlarını dikey olarak hizalıyoruz */}
        <Heading>Kayıt Ol</Heading> {/* Form başlığı */}
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* Kayıt formu */}
          <VStack spacing={4}>
            {/* Form alanları */}
            <FormControl isRequired>
              {" "}
              {/* Ad alanı */}
              <FormLabel>Ad</FormLabel>
              <Input
                name="firstName" // Input ismi
                value={formData.firstName} // Input değeri
                onChange={handleChange} // Değişim fonksiyonu
              />
            </FormControl>
            <FormControl isRequired>
              {" "}
              {/* Soyad alanı */}
              <FormLabel>Soyad</FormLabel>
              <Input
                name="lastName" // Input ismi
                value={formData.lastName} // Input değeri
                onChange={handleChange} // Değişim fonksiyonu
              />
            </FormControl>
            <FormControl isRequired>
              {" "}
              {/* E-posta alanı */}
              <FormLabel>Email</FormLabel>
              <Input
                type="email" // Email türü
                name="email" // Input ismi
                value={formData.email} // Input değeri
                onChange={handleChange} // Değişim fonksiyonu
              />
            </FormControl>
            <FormControl isRequired>
              {" "}
              {/* Şifre alanı */}
              <FormLabel>Şifre</FormLabel>
              <Input
                type="password" // Şifre türü
                name="password" // Input ismi
                value={formData.password} // Input değeri
                onChange={handleChange} // Değişim fonksiyonu
              />
            </FormControl>
            <Button
              type="submit" // Form gönderme butonu
              colorScheme="blue" // Buton rengi
              width="100%" // Butonun genişliği
              isLoading={isLoading} // Buton yükleniyorsa yükleniyor durumunu göster
            >
              Kayıt Ol
            </Button>
          </VStack>
        </form>
        <Text>
          {" "}
          {/* Diğer metin */}
          Zaten hesabınız var mı?{" "}
          <ChakraLink as={Link} to="/login" color="blue.500">
            Giriş Yap
          </ChakraLink>
        </Text>
      </VStack>
    </Box>
  );
};

export default Register; // Register bileşenini dışa aktarıyoruz
