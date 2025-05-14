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
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Container,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { vehicleService } from "../../services/vehicle.service";

interface FormData {
  brand: string;
  model: string;
  year: number;
  priceADay: number;
  seats: number;
  power: number;
  fuelType: string;
  transmission: string;
  image: string;
}

const NewCar = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validasyonu
    if (
      !formData.brand.trim() ||
      !formData.model.trim() ||
      !formData.image.trim()
    ) {
      toast({
        title: "Eksik bilgi",
        description: "Lütfen tüm zorunlu alanları doldurun",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    setIsSaving(true);
    try {
      await vehicleService.createVehicle(formData);
      toast({
        title: "Araç eklendi",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      navigate("/admin/cars");
    } catch (error) {
      toast({
        title: "Ekleme başarısız",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Yeni Araç Ekle</Heading>

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
                  placeholder="Örn: BMW"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Model</FormLabel>
                <Input
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="Örn: 3 Serisi"
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
                  placeholder="https://example.com/car-image.jpg"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                isLoading={isSaving}
              >
                Araç Ekle
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
  );
};

export default NewCar;
