// Chakra UI'dan gerekli bileşenler ve hook'lar import ediliyor
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  useColorMode,
  IconButton,
  Heading,
  useToast,
  Center,
  Spinner,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";

// Chakra UI'dan ikonlar import ediliyor
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

// React Router'dan link ve yönlendirme hook'u
import { Link, useNavigate } from "react-router-dom";

// React hook'ları
import { useState, useEffect, useRef } from "react";

// Araç servisinden verileri almak için servis fonksiyonları
import { vehicleService, Vehicle } from "../../services/vehicle.service";

const Cars = () => {
  // Tema rengini alır (light/dark)
  const { colorMode } = useColorMode();

  // Chakra'nın toast bildirimi için hook
  const toast = useToast();

  // Yönlendirme işlemleri için hook
  const navigate = useNavigate();

  // Araç listesi, yüklenme durumu ve hata mesajı için state'ler
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Silinmek üzere seçilen aracın ID'si
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null
  );

  // Dialog kontrolü için Chakra UI hook'u
  const { isOpen, onOpen, onClose } = useDisclosure();

  // İptal butonuna referans (AlertDialog için)
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Sayfa ilk yüklendiğinde araçları getir
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Araç verilerini API'den çek
  const fetchVehicles = async () => {
    try {
      const data = await vehicleService.getAllVehicles();
      setVehicles(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Araçlar yüklenirken bir hata oluştu"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Sil butonuna tıklanınca dialogu aç ve ID'yi kaydet
  const handleDeleteClick = (id: string) => {
    setSelectedVehicleId(id);
    onOpen();
  };

  // Silme işlemini gerçekleştir
  const handleDelete = async () => {
    if (!selectedVehicleId) return;

    try {
      await vehicleService.deleteVehicle(selectedVehicleId);
      setVehicles((prev) =>
        prev.filter((vehicle) => vehicle.id !== selectedVehicleId)
      );
      toast({
        title: "Araç silindi",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description:
          error instanceof Error
            ? error.message
            : "Araç silinirken bir hata oluştu",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
      setSelectedVehicleId(null);
    }
  };

  // Yükleniyor ekranı
  if (isLoading) {
    return (
      <Center h="calc(100vh - 200px)">
        <Spinner size="xl" />
      </Center>
    );
  }

  // Hata mesajı varsa göster
  if (error) {
    return (
      <Center h="calc(100vh - 200px)">
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  return (
    <Box>
      {/* Sayfa başlığı ve Yeni Araç Ekle butonu */}
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Araçlar</Heading>
        <Button as={Link} to="/admin/cars/new" colorScheme="blue">
          Yeni Araç Ekle
        </Button>
      </HStack>

      {/* Araç listesinin yer aldığı tablo */}
      <Box
        bg={colorMode === "light" ? "white" : "gray.700"}
        borderRadius="lg"
        shadow="md"
        overflow="hidden"
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Marka</Th>
              <Th>Model</Th>
              <Th>Yıl</Th>
              <Th>Günlük Fiyat</Th>
              <Th>Durum</Th>
              <Th>İşlemler</Th>
            </Tr>
          </Thead>
          <Tbody>
            {vehicles.map((vehicle) => (
              <Tr
                key={vehicle.id}
                _hover={{
                  bg: colorMode === "light" ? "gray.50" : "gray.600",
                }}
              >
                <Td>{vehicle.brand}</Td>
                <Td>{vehicle.model}</Td>
                <Td>{vehicle.year}</Td>
                <Td>₺{vehicle.priceADay}</Td>
                <Td>{vehicle.isBooked ? "Kirada" : "Müsait"}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      icon={<EditIcon />}
                      aria-label="Düzenle"
                      size="sm"
                      colorScheme="blue"
                      onClick={() => navigate(`/admin/cars/edit/${vehicle.id}`)}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      aria-label="Sil"
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDeleteClick(vehicle.id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Silme işlemi için onay penceresi (AlertDialog) */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Aracı Sil
            </AlertDialogHeader>

            <AlertDialogBody>
              Bu aracı silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                İptal
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Sil
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Cars;
