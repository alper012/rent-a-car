// Gerekli Chakra UI bileşenleri ve yardımcı kütüphaneler import ediliyor
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Image,
  Badge,
  useColorMode,
  Spinner,
  Center,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { bookingService } from "../services/booking.service"; // API servisi
import { format } from "date-fns"; // Tarih formatlama
import { tr } from "date-fns/locale"; // Türkçe dil desteği
import type { Booking } from "../services/booking.service"; // Booking tipi

// Kiralama durumlarına göre renk belirleyen yardımcı fonksiyon
const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "yellow"; // Onay bekliyor
    case "APPROVED":
      return "green"; // Onaylandı
    case "REJECTED":
      return "red"; // Reddedildi
    case "COMPLETED":
      return "blue"; // Tamamlandı
    default:
      return "gray"; // Diğer durumlar
  }
};

// Kiralama durumlarına göre metin karşılıklarını döner
const getStatusText = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Onay Bekliyor";
    case "APPROVED":
      return "Onaylandı";
    case "REJECTED":
      return "Reddedildi";
    case "COMPLETED":
      return "Tamamlandı";
    default:
      return status; // Tanımsız durumlar
  }
};

const MyRentals = () => {
  const { colorMode } = useColorMode(); // Tema rengi (light/dark)
  const [bookings, setBookings] = useState<Booking[]>([]); // Kiralama verileri
  const [isLoading, setIsLoading] = useState(true); // Yüklenme durumu
  const [error, setError] = useState<string | null>(null); // Hata mesajı

  // Bileşen ilk yüklendiğinde kiralama verileri API'den çekilir
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.getMyBookings(); // Kullanıcının kiralamaları
        setBookings(data); // State'e kaydet
      } catch (error) {
        setError(error instanceof Error ? error.message : "Bir hata oluştu"); // Hata varsa göster
      } finally {
        setIsLoading(false); // Yüklenme tamamlandı
      }
    };

    fetchBookings(); // Fonksiyon çağrılır
  }, []);

  // Veriler yükleniyorsa spinner gösterilir
  if (isLoading) {
    return (
      <Center h="calc(100vh - 100px)">
        <Spinner size="xl" />
      </Center>
    );
  }

  // Hata oluştuysa kullanıcıya hata mesajı gösterilir
  if (error) {
    return (
      <Center h="calc(100vh - 100px)">
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  // Ana içerik
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Kiralamalarım</Heading>

        {/* Hiç kiralama yoksa mesaj göster */}
        {bookings.length === 0 ? (
          <Center h="200px">
            <Text>Henüz bir kiralama işleminiz bulunmuyor.</Text>
          </Center>
        ) : (
          // Kiralama kartları grid şeklinde gösterilir
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            {bookings.map((booking) => (
              <GridItem key={booking.id}>
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  bg={colorMode === "light" ? "white" : "gray.700"} // Tema rengine göre arka plan
                  shadow="md"
                >
                  <Image
                    src={booking.vehicle.image} // Araç görseli
                    alt={`${booking.vehicle.brand} ${booking.vehicle.model}`}
                    height="200px"
                    width="100%"
                    objectFit="cover"
                  />
                  <Box p={6}>
                    <VStack align="stretch" spacing={4}>
                      <HStack justify="space-between">
                        {/* Araç marka/model bilgisi */}
                        <Heading size="md">
                          {booking.vehicle.brand} {booking.vehicle.model}
                        </Heading>
                        {/* Durum etiketi */}
                        <Badge
                          colorScheme={getStatusColor(booking.status)}
                          px={2}
                          py={1}
                          borderRadius="md"
                        >
                          {getStatusText(booking.status)}
                        </Badge>
                      </HStack>

                      {/* Tarih ve ücret bilgileri */}
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <Box>
                          <Text fontWeight="bold">Başlangıç Tarihi</Text>
                          <Text>
                            {format(
                              new Date(booking.startDate),
                              "d MMMM yyyy",
                              { locale: tr }
                            )}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">Bitiş Tarihi</Text>
                          <Text>
                            {format(new Date(booking.endDate), "d MMMM yyyy", {
                              locale: tr,
                            })}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">Günlük Fiyat</Text>
                          <Text>₺{booking.vehicle.priceADay}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold">Toplam Gün</Text>
                          <Text>
                            {Math.ceil(
                              (new Date(booking.endDate).getTime() -
                                new Date(booking.startDate).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            gün
                          </Text>
                        </Box>
                      </Grid>

                      {/* Toplam ücret */}
                      <Box>
                        <Text fontWeight="bold">Toplam Tutar</Text>
                        <Text fontSize="xl" color="blue.500">
                          ₺
                          {booking.vehicle.priceADay *
                            Math.ceil(
                              (new Date(booking.endDate).getTime() -
                                new Date(booking.startDate).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                </Box>
              </GridItem>
            ))}
          </Grid>
        )}
      </VStack>
    </Container>
  );
};

export default MyRentals;
