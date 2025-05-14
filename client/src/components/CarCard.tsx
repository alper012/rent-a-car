import {
  Box, // Bir div gibi davranan, düzenleme (layout) için kullanılan bir bileşen
  Button, // Chakra UI'nin buton bileşeni
  Image, // Görselleri göstermek için kullanılan bileşen
  Text, // Metin göstermek için kullanılan bileşen
  VStack, // İçindeki öğeleri dikey olarak hizalayan bir bileşen (Vertical Stack)
  useColorMode, // Chakra UI'nin renk modunu (light/dark) kontrol etmeye yarayan hook
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom"; // React Router'dan gelen, sayfalar arasında yönlendirme yapmak için kullanılan hook

interface CarCardProps {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
}

const CarCard = ({ id, brand, model, year, price, imageUrl }: CarCardProps) => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/car/${id}`); //BU ROTAYI BULAMIYORUM?
  };
  return (
    <Box
      borderWidth="1px" // Kutuya 1 piksel genişliğinde bir kenarlık ekler
      borderRadius="lg" // Köşeleri büyük yuvarlatır (large)
      overflow="hidden" // İçerik kutunun dışına taşarsa gizlenir
      bg={colorMode === "light" ? "white" : "gray.700"} // Tema moduna göre arka plan rengi ayarlanır
      _hover={{
        shadow: "xl", // Üzerine gelindiğinde gölgeyi artırır
        transform: "translateY(-2px)", // Hover sırasında kutuyu biraz yukarı kaydırır
        cursor: "pointer", // İmleci el işareti yaparak tıklanabilir olduğunu gösterir
      }}
      transition="all 0.2s" // Hover efektlerinin yumuşak olması için geçiş süresi belirler
      height="100%" // Kutunun yüksekliğini tam olarak ayarlar
      display="flex" // Kutuyu bir flex container yapar
      flexDirection="column" // İçindeki elemanları dikey yönde hizalar
      onClick={handleClick} // Kutunun tamamına tıklanınca belirlenen fonksiyonu çalıştırır
    >
      {/* Resmi kapsayan bir kutu oluşturuluyor */}
      <Box position="relative" paddingTop="60%">
        <Image
          src={imageUrl} // Arabanın resmini URL'den getirir
          alt={`${brand} ${model}`} // Resim açıklaması (erişilebilirlik için)
          position="absolute" // Konumlandırmayı absolute yaparak Box'un içine sabitler
          top="0"
          left="0"
          width="100%" // Resmin kutuya tam oturmasını sağlar
          height="100%"
          objectFit="cover" // Resmin oranlarını bozmadan kutuya sığmasını sağlar
        />
      </Box>

      {/* Arabanın bilgilerini içeren metinleri sıralayan bir dikey Stack (VStack) */}
      <VStack align="stretch" p={4} flex="1" spacing={3}> {/* VStack → Dikey olarak bileşenleri sıralayan bir konteynerdir. */}
        {/* Araba Markası ve Modeli */}
        <Text
          fontSize="xl" // Büyük font kullan
          fontWeight="bold" // Kalın yazı tipi
          color={colorMode === "light" ? "gray.800" : "white"} // Tema moduna göre yazı rengi belirle
        >
          {brand} {model}
        </Text>

        {/* Üretim yılı */}
        <Text color={colorMode === "light" ? "gray.600" : "gray.300"}>
          Yıl: {year}
        </Text>

        {/* Günlük kiralama fiyatı */}
        <Text
          color={colorMode === "light" ? "blue.600" : "blue.200"} // Tema moduna göre fiyat rengini belirle
          fontSize="lg" // Büyük font boyutu
          fontWeight="semibold" // Orta kalınlıkta yazı
        >
          ₺{price} / a day
        </Text>

        {/* Araba detaylarını gör butonu */}
        <Button
          colorScheme="blue" // Mavi buton rengi
          size="lg" // Büyük boyutlu buton
          mt="auto" // Boş alanı ittirerek butonu en alta yerleştirir
          onClick={(e) => {
            e.stopPropagation(); // Üstteki onClick (handleClick) olayının çalışmasını engeller
            navigate(`/car/${id}`); // Belirtilen arabanın detay sayfasına yönlendirir
          }}
        >
          Detayları Gör
        </Button>
      </VStack>
    </Box>
  );
};

export default CarCard;
