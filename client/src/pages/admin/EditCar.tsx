import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  SimpleGrid,
  useToast,
  HStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Container,
  Image,
  Center,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { vehicleService } from "../../services/vehicle.service";

// Form verilerini tanımlayan interface
interface FormData {
  brand: string; // Marka
  model: string; // Model
  year: number; // Yıl
  priceADay: number; // Günlük fiyat
  seats: number; // Koltuk sayısı
  power: number; // Motor gücü (HP)
  fuelType: string; // Yakıt tipi
  transmission: string; // Vites tipi (manuel, otomatik)
  image: string; // Resim URL
}

const EditCar = () => {
  const navigate = useNavigate(); // Sayfalar arası geçiş için navigate hook'u
  const toast = useToast(); // Kullanıcıya bildirim göndermek için useToast hook'u
  const { id } = useParams(); // URL parametresinden araba id'sini almak
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Silme dialogu durumu
  const cancelRef = useRef<HTMLButtonElement>(null); // Dialog iptal butonu için ref
  const [isLoading, setIsLoading] = useState(true); // Veri yükleniyor mu?
  const [isSaving, setIsSaving] = useState(false); // Veriler kaydediliyor mu?
  const [error, setError] = useState<string | null>(null); // Hata durumu
  const [formData, setFormData] = useState<FormData>({
    // Form verilerini saklayan state
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    priceADay: 0,
    seats: 5,
    power: 0,
    fuelType: "Gasoline",
    transmission: "manual",
    image: "",
  });

  // Araba verilerini yüklemek için useEffect hook'u
  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) return;
      try {
        const data = await vehicleService.getVehicleById(id); // Araba bilgilerini servisten almak
        setFormData({
          brand: data.brand,
          model: data.model,
          year: data.year,
          priceADay: data.priceADay,
          seats: data.seats,
          power: data.power,
          fuelType: data.fuelType,
          transmission: data.transmission,
          image: data.image,
        });
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Araç yüklenirken bir hata oluştu" // Hata durumunu ayarla
        );
      } finally {
        setIsLoading(false); // Yükleme tamamlandığında isLoading'i false yap
      }
    };

    fetchVehicle();
  }, [id]);

  // Formu gönderme fonksiyonu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Sayfanın yenilenmesini engelle
    if (!id) return;

    setIsSaving(true); // Kaydetme işlemi başladığında isSaving'i true yap
    try {
      await vehicleService.updateVehicle(id, formData); // Araba verisini güncelle
      toast({
        title: "Araç güncellendi",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      navigate("/admin/cars"); // Başarıyla güncellendikten sonra arabalar sayfasına yönlendir
    } catch (error) {
      toast({
        title: "Güncelleme başarısız",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setIsSaving(false); // Kaydetme işlemi bittiğinde isSaving'i false yap
    }
  };

  // Araba silme fonksiyonu
  const handleDelete = async () => {
    if (!id) return;

    try {
      await vehicleService.deleteVehicle(id); // Araba verisini sil
      toast({
        title: "Araç silindi",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      navigate("/admin/cars"); // Silme işlemi tamamlandığında arabalar sayfasına yönlendir
    } catch (error) {
      toast({
        title: "Silme başarısız",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setIsDeleteDialogOpen(false); // Dialogu kapat
    }
  };

  // Form verilerinin değişmesini izleyen fonksiyon
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      // Eğer form adı içeriyorsa, yani nested bir veri varsa
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev, // Burada prev'in tüm özellikleri kopyalanıyor
        [parent]: { // Burada, dinamik bir key (parent) ekleniyor
          ...prev[parent], // parent key'i ile ilgili mevcut değeri alıp, bir şeyler ekliyoruz
          [child]: value, // child key'ini güncelliyoruz
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Sayısal verileri değiştirme fonksiyonu
  const handleNumberChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value), // Sayısal değer olarak güncelle
    }));
  };

  // Eğer veri yükleniyorsa, yükleniyor spinner'ı göster
  if (isLoading) {
    return (
      <Center h="calc(100vh - 200px)">
        <Spinner size="xl" />
      </Center>
    );
  }

  // Eğer hata varsa, hatayı göster
  if (error) {
    return (
      <Center h="calc(100vh - 200px)">
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  // JSX - Araba düzenleme formu ve silme dialogu
  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Araba Düzenle</Heading>
        <Button colorScheme="red" onClick={() => setIsDeleteDialogOpen(true)}>
          Arabayı Sil
        </Button>
      </HStack>

      <Container maxW="container.lg" py={8}>
        <VStack spacing={8} align="stretch">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            {/* Sol Taraf - Form */}
            <Box as="form" onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Marka</FormLabel>
                  <Input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Model</FormLabel>
                  <Input
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Yıl</FormLabel>
                  <NumberInput
                    min={1900}
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={(value) => handleNumberChange("year", value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Günlük Fiyat (₺)</FormLabel>
                  <NumberInput
                    min={0}
                    value={formData.priceADay}
                    onChange={(value) => handleNumberChange("priceADay", value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Koltuk Sayısı</FormLabel>
                  <NumberInput
                    min={1}
                    max={9}
                    value={formData.seats}
                    onChange={(value) => handleNumberChange("seats", value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Motor Gücü (HP)</FormLabel>
                  <NumberInput
                    min={0}
                    value={formData.power}
                    onChange={(value) => handleNumberChange("power", value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Yakıt Tipi</FormLabel>
                  <Select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                  >
                    <option value="Gasoline">Benzin</option>
                    <option value="Diesel">Dizel</option>
                    <option value="Electric">Elektrik</option>
                    <option value="Hybrid">Hibrit</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Vites</FormLabel>
                  <Select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                  >
                    <option value="manual">Manuel</option>
                    <option value="automatic">Otomatik</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Resim URL</FormLabel>
                  <Input
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  isLoading={isSaving}
                >
                  Kaydet
                </Button>
              </VStack>
            </Box>

            {/* Sağ Taraf - Önizleme */}
            <Box>
              <VStack spacing={4} position="sticky" top="20px">
                <Heading size="md">Resim Önizleme</Heading>
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  width="100%"
                >
                  <Image
                    src={formData.image}
                    alt={`${formData.brand} ${formData.model}`}
                    fallbackSrc="https://via.placeholder.com/400x300?text=Resim+Yok"
                    width="100%"
                    height="300px"
                    objectFit="cover"
                  />
                </Box>
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Arabayı Sil
            </AlertDialogHeader>

            <AlertDialogBody>
              Bu arabayı silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteDialogOpen(false)}
              >
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

export default EditCar;
