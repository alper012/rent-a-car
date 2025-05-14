import {
  Box, // Temel bir div benzeri bileşen, Chakra UI'de kullanılır.
  Container, // İçeriği belirli bir genişlikte sınırlandıran kapsayıcı bileşen.
  Flex, // İçindeki bileşenleri esnek (flexbox) düzeninde hizalamaya yarar.
  Button, // Chakra UI'nin buton bileşeni.
  useColorMode, // Chakra UI'nin renk modu (light/dark) kontrolünü sağlayan hook.
  IconButton, // Simge içeren buton (örneğin gece/gündüz modunu değiştirme butonu).
  Menu, // Açılır menü bileşeni (kullanıcı için profil menüsü gibi).
  MenuButton, // Menüye tıklanmasını sağlayan buton.
  MenuList, // Menü içeriğini kapsayan bileşen.
  MenuItem, // Menüdeki her bir öğeyi temsil eden bileşen.
  Avatar, // Kullanıcının profil fotoğrafı veya isminin baş harflerini gösteren bileşen.
  Text, // Metin göstermek için kullanılan bileşen.
  HStack, // İçindeki öğeleri yatay (horizontal) olarak hizalayan bileşen.
  Link, // Chakra UI’nin Link bileşeni, React Router ile birlikte kullanılabilir.
  useToast, // Bildirim mesajları (Toast) göstermek için kullanılan Chakra UI hook'u.
} from "@chakra-ui/react";

import { MoonIcon, SunIcon, ChevronDownIcon } from "@chakra-ui/icons"; // Chakra UI'den getirilen ikonlar.

import { Link as RouterLink, useNavigate } from "react-router-dom"; // Sayfa yönlendirmeleri için React Router bileşenleri.

import { useAuth } from "../hooks/useAuth"; // Kullanıcı oturum durumunu yöneten özel bir hook.

const Navbar = () => {
  // Renk modu (light veya dark) ve değiştirme fonksiyonu.
  const { colorMode, toggleColorMode } = useColorMode();

  // Sayfa yönlendirme işlemi için React Router'ın useNavigate hook'u.
  const navigate = useNavigate();

  // Kullanıcıya bildirim göstermek için useToast hook'u.
  const toast = useToast();

  // Kullanıcı bilgilerini almak ve çıkış yapma fonksiyonunu içeren useAuth hook'u.
  const { user, logout, isAdmin } = useAuth();

  // Kullanıcının çıkış yapmasını sağlayan fonksiyon.
  const handleLogout = () => {
    logout(); // Logout fonksiyonu cagirilir.
    navigate("/login"); // Kullanıcıyı giriş sayfasına yönlendir.
    toast({
      title: "Çıkış Yapıldı", // Bildirim başlığı.
      status: "success", // Başarılı işlem bildirimi.
      duration: 3000, // 3 saniye boyunca görüntülenecek.
      isClosable: true, // Kullanıcı bildirimi kapatabilir.
      position: "bottom", // Bildirimin ekranın altında görünmesini sağlar.
    });
  };

  return (
    <Box
      as="nav" // Bu Box'ı bir <nav> HTML etiketi gibi kullan.
      bg={colorMode === "light" ? "white" : "gray.800"} // Renk moduna göre arka plan rengini belirle.
      py={4} // Üst ve alt dolgu (padding).
      borderBottom="1px" // Alt kenarlık ekler.
      borderColor={colorMode === "light" ? "gray.200" : "gray.700"} // Renk moduna göre kenarlık rengi belirler.
      position="sticky" // Navbar'ı sayfanın üstüne sabitler.
      top={0} // Navbar'ın en üstte kalmasını sağlar.
      zIndex={1000} // Diğer bileşenlerden önde olması için yüksek z-index değeri.
    >
      <Container maxW="container.xl">
        {" "}
        {/* İçeriği maksimum genişlikte sınırlayan kapsayıcı */}
        <Flex justify="space-between" align="center">
          {" "}
          {/* İçeriği yatay olarak sıralar ve ortalar */}
          {/* Logo veya Anasayfa Linki */}
          <Link
            as={RouterLink} // React Router'ın Link bileşeniyle bağlanır.
            to="/" // Anasayfaya yönlendirir.
            fontSize="xl" // Büyük yazı tipi boyutu.
            fontWeight="bold" // Kalın yazı tipi.
            _hover={{ textDecoration: "none" }} // Üzerine gelindiğinde alt çizgi olmamasını sağlar.
          >
            Rent A Car
          </Link>
          {/* Navbar sağ tarafındaki bileşenler */}
          <HStack spacing={4}>
            {" "}
            {/* Bileşenleri yatay olarak hizalar ve aralarına boşluk ekler */}
            {/* Gece/Gündüz Modu Butonu */}
            <IconButton
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />} // Renk moduna göre ikon değiştirir.
              onClick={toggleColorMode} // Gece/Gündüz modunu değiştirir.
              aria-label="Toggle color mode" // Erişilebilirlik için açıklama.
              variant="ghost" // Arka planı olmayan şeffaf buton.
            />
            {/* Kullanıcı giriş yapmışsa profil menüsünü göster */}
            {user ? (
              <Menu>
                <MenuButton
                  as={Button} // Menü butonu olarak bir buton kullanılır.
                  rightIcon={<ChevronDownIcon />} // Butonun sağında aşağı ok ikonu.
                  variant="ghost" // Şeffaf buton.
                >
                  <HStack>
                    {" "}
                    {/* Profil resmi ve adını yatay olarak hizalar */}
                    <Avatar
                      size="sm" // Küçük avatar resmi.
                      name={`${user.firstName} ${user.lastName}`} // Kullanıcının adının baş harflerini gösterir.
                      bg="blue.500" // Mavi arka plan rengi.
                      color="white" // Beyaz metin rengi.
                    />
                    <Text display={{ base: "none", md: "block" }}>
                      {user.firstName} {user.lastName} {/* Kullanıcının adı */}
                    </Text>
                  </HStack>
                </MenuButton>

                {/* Profil menüsü seçenekleri */}
                <MenuList>
                  {isAdmin ? (
                    // Eğer kullanıcı admin ise "Admin Paneli" menü seçeneğini göster
                    <MenuItem onClick={() => navigate("/admin")}>
                      Admin Panel
                    </MenuItem>
                  ) : (
                    // Eğer kullanıcı admin değilse, "Kiralamalarım" menü seçeneğini göster
                    <MenuItem onClick={() => navigate("/my-rentals")}>
                      Kiralamalarım{" "}
                      {/* Normal kullanıcı için "Kiralamalarım" seçeneği */}
                    </MenuItem>
                  )}

                  {/* Kullanıcı profiline gitmek için menü seçeneği */}
                  <MenuItem onClick={() => navigate("/profile")}>
                    Profil {/* Profil sayfasına yönlendirir */}
                  </MenuItem>

                  {/* Kullanıcının çıkış yapmasını sağlayan menü seçeneği */}
                  <MenuItem onClick={handleLogout}>
                    Çıkış Yap {/* Kullanıcıyı çıkış yapar */}
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              // Kullanıcı giriş yapmamışsa "Giriş Yap" butonunu göster.
              <Link
                as={RouterLink}
                to="/login"
                _hover={{ textDecoration: "none" }} // Üzerine gelince alt çizgi olmasın.
              >
                <Button colorScheme="blue">Giriş Yap</Button> {/* Mavi buton */}
              </Link>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar; // Navbar bileşenini dışa aktar.
