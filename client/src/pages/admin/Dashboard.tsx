// Gerekli Chakra UI bileşenleri ve React hook'ları import ediliyor
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorMode,
  Center,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { vehicleService } from "../../services/vehicle.service"; // Araç verilerini almak için servis import ediliyor

// Dashboard bileşeni tanımlanıyor
const Dashboard = () => {
  // Chakra UI'den tema (açık/koyu) bilgisi alınıyor
  const { colorMode } = useColorMode();

  // State tanımları
  const [totalVehicles, setTotalVehicles] = useState<number>(0); // Araç sayısını tutar
  const [isLoading, setIsLoading] = useState(true); // Yüklenme durumunu kontrol eder
  const [error, setError] = useState<string | null>(null); // Hata mesajını tutar

  // Bileşen yüklendiğinde API'den veri çekilir
  useEffect(() => {
    const fetchData = async () => {
      try {
        // API'den araç verileri çekilir
        const vehicles = await vehicleService.getAllVehicles();
        // Araç sayısı state'e yazılır
        setTotalVehicles(vehicles.length);
      } catch (error) {
        // Hata varsa uygun mesaj gösterilir
        setError(error instanceof Error ? error.message : "Bir hata oluştu");
      } finally {
        // Yükleme tamamlandığında spinner gizlenir
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Eğer veri yükleniyorsa, büyük bir spinner gösterilir
  if (isLoading) {
    return (
      <Center h="calc(100vh - 200px)">
        <Spinner size="xl" />
      </Center>
    );
  }

  // Eğer hata oluştuysa, kullanıcıya kırmızı yazıyla mesaj gösterilir
  if (error) {
    return (
      <Center h="calc(100vh - 200px)">
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  // Veri geldiyse asıl dashboard görünümü render edilir
  return (
    <Box>
      {/* Responsive grid yapısı, burada tek sütun kullanılmış */}
      <SimpleGrid columns={1} spacing={6}>
        <Box
          bg={colorMode === "light" ? "white" : "gray.700"} // Tema rengine göre arka plan rengi
          p={6} // İç boşluk
          borderRadius="lg" // Kenar yuvarlaklığı
          shadow="md" // Gölgelendirme
        >
          <Stat>
            {/* Açıklayıcı metin */}
            <StatLabel fontSize="lg">Toplam Araç Sayısı</StatLabel>
            {/* Sayısal veri */}
            <StatNumber fontSize="4xl">{totalVehicles}</StatNumber>
          </Stat>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

// Bileşen dışa aktarılır
export default Dashboard;
