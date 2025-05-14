
import {
  Box, 
  Container, 
  Heading, // Heading: Başlık elementi
  Table, // Table: Tablo oluşturmak için kullanılır
  Thead, // Thead: Tablo başlıkları için container
  Tbody, // Tbody: Tablo içeriği
  Tr, // Tr: Tablo satırı
  Th, // Th: Tablo başlık hücresi
  Td, // Td: Tablo veri hücresi
  Badge, // Badge: Etiket (status göstergesi için)
  Button, 
  useColorMode, 
  useToast, 
  ButtonGroup, // ButtonGroup: Butonları grup halinde düzenlemek için
  HStack,
  Text, 
  Image, 
  Spinner, // Spinner: Yükleniyor simgesi
  Center, // Center: Ortalamak için kullanılan konteyner
  AlertDialog, // AlertDialog: Uyarı penceresi
  AlertDialogBody, // AlertDialogBody: Uyarı penceresinin gövdesi
  AlertDialogFooter, // AlertDialogFooter: Uyarı penceresinin alt kısmı
  AlertDialogHeader, // AlertDialogHeader: Uyarı penceresinin başlığı
  AlertDialogContent, // AlertDialogContent: Uyarı penceresinin içeriği
  AlertDialogOverlay, // AlertDialogOverlay: Uyarı penceresinin zemin kararması
  useDisclosure, // useDisclosure: Açılır pencereler için kontrol hook'u
} from "@chakra-ui/react";

// React ve diğer gerekli kütüphanelerden import
import { useState, useEffect, useRef } from "react"; // React hook'ları
import { bookingService, Booking } from "../../services/booking.service"; // Booking servisi ve Booking türü
import { format } from "date-fns"; // Tarih formatlama kütüphanesi
import { tr } from "date-fns/locale"; // Türkçe tarih formatı

// Durum renklerini döndüren fonksiyon
const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "yellow"; // Bekliyor
    case "APPROVED":
      return "green"; // Onaylı
    case "REJECTED":
      return "red"; // Reddedildi
    case "COMPLETED":
      return "blue"; // Tamamlandı
    default:
      return "gray"; // Varsayılan gri
  }
};

// Durum metinlerini döndüren fonksiyon
const getStatusText = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Onay Bekliyor"; // Bekliyor
    case "APPROVED":
      return "Onaylandı"; // Onaylandı
    case "REJECTED":
      return "Reddedildi"; // Reddedildi
    case "COMPLETED":
      return "Tamamlandı"; // Tamamlandı
    default:
      return status; // Varsayılan durum
  }
};

// Aksiyonlar için dialog bileşeni (Onayla / Reddet)
interface ActionDialogProps {
  booking: Booking; // Kiralama bilgisi
  action: "APPROVED" | "REJECTED"; // Onay veya reddetme işlemi
  isOpen: boolean; // Dialog'un açık olup olmadığı
  onClose: () => void; // Dialog'u kapatma fonksiyonu
  onConfirm: () => void; // Aksiyon onayı fonksiyonu
}

const ActionDialog = ({
  booking, // Kiralama bilgisi
  action, // Onay ya da red aksiyonu
  isOpen, // Dialog açık mı?
  onClose, // Kapatma fonksiyonu
  onConfirm, // Onay fonksiyonu
}: ActionDialogProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null); // Dialog'da iptal butonuna referans

  // Action değerine bağlı olarak bir metin döndürür. 
  //ActionDialog içinde, uyarı mesajında kullanıcıya hangi aksiyonun yapılacağını belirten metin olarak kullanılıyor
  const getActionText = () => {
    switch (action) {
      case "APPROVED":
        return "onaylamak"; // Onaylama aksiyonu
      case "REJECTED":
        return "reddetmek"; // Red aksiyonu
      default:
        return "";
    }
  };

  return (
    <AlertDialog // Uyarı penceresi
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Kiralama Durumunu Güncelle // Başlık
          </AlertDialogHeader>

          <AlertDialogBody>
            {`${booking.user?.firstName} ${
              booking.user?.lastName
            } kullanıcısının ${booking.vehicle.brand} ${
              booking.vehicle.model
            } araç kiralama talebini ${getActionText()} istediğinize emin misiniz?`}{" "}
            // Uyarı mesajı
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}> // onClick içinde handleAction çağrılır
              İptal 
            </Button>
            <Button
              colorScheme={getStatusColor(action)} // Aksiyon rengi
              onClick={onConfirm} 
              ml={3}
            >
              Onayla 
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

// Kiralama talepleri sayfası
const Bookings = () => {
  const { colorMode } = useColorMode(); // Tema modu (ışık / karanlık)
  const [bookings, setBookings] = useState<Booking[]>([]); // Kiralama talepleri
  const [isLoading, setIsLoading] = useState(true); // Yükleniyor durumu
  const [error, setError] = useState<string | null>(null); // Hata durumu
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null); // Seçilen kiralama
  const [selectedAction, setSelectedAction] = useState<
    "APPROVED" | "REJECTED" | null
  >(null); // Seçilen aksiyon (Onayla/Reddet)
  const { isOpen, onOpen, onClose } = useDisclosure(); // Dialog kontrol hook'u
  const toast = useToast(); // Toast bildirimleri için hook

  // Kiralama taleplerini API'den alıyoruz
  const fetchBookings = async () => {
    try {
      const data = await bookingService.getAllBookings(); // Booking servisi ile verileri al
      setBookings(data); // Talepleri state'e kaydet
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu"); // Hata mesajı
    } finally {
      setIsLoading(false); // Yükleniyor durumunu bitir
    }
  };

  // İlk render'da kiralama taleplerini çek
  useEffect(() => {
    fetchBookings();
  }, []);

  // Aksiyon işlemi (Onayla/Reddet)
  const handleAction = async () => {
    if (!selectedBooking || !selectedAction) return; // Seçim yapılmadıysa işlemi durdur

    try {
      await bookingService.updateBookingStatus(
        selectedBooking.id,
        selectedAction
      ); // Kiralama durumunu güncelle
      toast({
        title: "Durum güncellendi", // Başarılı bildirim
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      fetchBookings(); // Yeni verileri çek
    } catch (error) {
      toast({
        title: "Güncelleme başarısız", // Hatalı işlem bildirimi
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      onClose(); // Dialog'u kapat
      setSelectedBooking(null); // Seçimi sıfırla
      setSelectedAction(null); // Aksiyon seçimini sıfırla
    }
  };

  // Aksiyon dialog'ını açma fonksiyonu
  const openActionDialog = (
    booking: Booking,
    action: typeof selectedAction
  ) => {
    setSelectedBooking(booking); // Seçilen kiralamayı kaydet
    setSelectedAction(action); // Seçilen aksiyonu kaydet
    onOpen(); // Dialog'u aç
  };

  // Yükleniyor durumunu göster
  if (isLoading) {
    return (
      <Center h="calc(100vh - 100px)">
        <Spinner size="xl" /> {/* Yükleniyor simgesi */}
      </Center>
    );
  }

  // Hata durumunu göster
  if (error) {
    return (
      <Center h="calc(100vh - 100px)">
        <Text color="red.500">{error}</Text> {/* Hata mesajı */}
      </Center>
    );
  }

  return (
    <Box>
      <Container maxW="container.xl" py={8}>
        {" "}
        {/* Sayfa düzeni */}
        <Heading size="lg" mb={6}>
          Kiralama Talepleri
        </Heading>{" "}
        {/* Başlık */}
        <Box
          bg={colorMode === "light" ? "white" : "gray.700"} // Tema'ya göre arka plan rengi
          borderRadius="lg"
          shadow="md"
          overflow="hidden"
        >
          <Table variant="simple">
            <Thead
              bg={colorMode === "light" ? "gray.50" : "gray.800"} // Tema'ya göre tablo başlık rengi
              position="sticky"
              top={0}
              zIndex={1}
            >
              <Tr>
                <Th>Araç</Th>
                <Th>Müşteri</Th>
                <Th>Tarih Aralığı</Th>
                <Th>Tutar</Th>
                <Th>Durum</Th>
                <Th>İşlemler</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bookings.map(
                (
                  booking // Her bir kiralama talebini map ile döngüye alıyoruz
                ) => (
                  <Tr key={booking.id}>
                    <Td>
                      <HStack spacing={3}>
                        {booking.vehicle && ( // Araç varsa
                          <>
                            <Image
                              src={booking.vehicle.image}
                              alt={`${booking.vehicle.brand} ${booking.vehicle.model}`}
                              boxSize="50px"
                              objectFit="cover"
                              borderRadius="md"
                              fallbackSrc="https://via.placeholder.com/50" // Placeholder image
                            />
                            <Box>
                              <Text fontWeight="bold">
                                {booking.vehicle.brand} {booking.vehicle.model}
                              </Text>
                              <Text fontSize="sm" color="gray.500">
                                {booking.vehicle.year}
                              </Text>
                            </Box>
                          </>
                        )}
                        {!booking.vehicle && ( // Araç yoksa hata mesajı
                          <Text color="red.500">Araç bilgisi bulunamadı</Text>
                        )}
                      </HStack>
                    </Td>
                    <Td>
                      {booking.user ? ( // Kullanıcı varsa bilgileri göster
                        <>
                          <Text fontWeight="medium">
                            {booking.user.firstName} {booking.user.lastName}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {booking.user.email}
                          </Text>
                        </>
                      ) : (
                        // Kullanıcı yoksa hata mesajı
                        <Text color="red.500">
                          Kullanıcı bilgisi bulunamadı
                        </Text>
                      )}
                    </Td>
                    <Td>
                      <Text>
                        {format(new Date(booking.startDate), "d MMMM yyyy", {
                          locale: tr,
                        })}
                      </Text>
                      <Text>
                        {format(new Date(booking.endDate), "d MMMM yyyy", {
                          locale: tr,
                        })}
                      </Text>
                    </Td>
                    <Td>
                      {booking.vehicle ? ( // Fiyat varsa toplam kiralama ücretini hesaplar.
                        <>
                          <Text fontWeight="bold">
                            ₺
                            {booking.vehicle.priceADay * //gunluk fiyat * 
                              Math.ceil(
                                (new Date(booking.endDate).getTime() - //iki tarih arasindaki fark icin cikarma islemi (toplam tarihi bulmak icin)
                                  new Date(booking.startDate).getTime()) / // 1 gune cevirmek icin bolme islemi (ms cinsinden)
                                  (1000 * 60 * 60 * 24) 
                              )}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {Math.ceil(
                              (new Date(booking.endDate).getTime() -
                                new Date(booking.startDate).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            gün
                          </Text>
                        </>
                      ) : (
                        // Fiyat hesaplanamazsa hata mesajı
                        <Text color="red.500">Fiyat hesaplanamadı</Text>
                      )}
                    </Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(booking.status)}>
                        {getStatusText(booking.status)}
                      </Badge>
                    </Td>
                    <Td>
                      <ButtonGroup size="sm" variant="outline">
                        {booking.status === "PENDING" && ( // Bekleyen talepler için işlemler
                          <>
                            <Button
                              colorScheme="green"
                              onClick={() =>
                                openActionDialog(booking, "APPROVED")
                              }
                            >
                              Onayla
                            </Button>
                            <Button
                              colorScheme="red"
                              onClick={() =>
                                openActionDialog(booking, "REJECTED")
                              }
                            >
                              Reddet
                            </Button>
                          </>
                        )}
                      </ButtonGroup>
                    </Td>
                  </Tr>
                )
              )}
            </Tbody>
          </Table>
        </Box>
      </Container>

      {selectedBooking &&
        selectedAction && ( 
          <ActionDialog
            booking={selectedBooking}
            action={selectedAction}
            isOpen={isOpen}
            onClose={() => {
              onClose();
              setSelectedBooking(null); // Dialog kapandığında seçimleri sıfırla
              setSelectedAction(null); // Dialog kapandığında aksiyonu sıfırla
            }}
            onConfirm={handleAction} // Aksiyon onayı
          />
        )}
    </Box>
  );
};

export default Bookings; // Default export, Bookings bileşenini dışarıya aktarır
