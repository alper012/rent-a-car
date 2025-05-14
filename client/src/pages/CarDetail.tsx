import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  Badge,
  useColorMode,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { vehicleService, Vehicle } from "../services/vehicle.service";
import { bookingService } from "../services/booking.service";

const CarDetail = () => {
  const { colorMode } = useColorMode();
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rentalDates, setRentalDates] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) return;
      try {
        const data = await vehicleService.getVehicleById(id);
        setVehicle(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Bugünün tarihini al
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Seçilen tarihi al
    const selectedDate = new Date(value);
    selectedDate.setHours(0, 0, 0, 0);

    // Başlangıç tarihi için kontrol
    if (name === "startDate") {
      if (selectedDate < today) {
        toast({
          title: "Hata",
          description: "Geçmiş bir tarih seçemezsiniz",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      // Eğer bitiş tarihi varsa ve seçilen başlangıç tarihi bitiş tarihinden büyükse
      if (rentalDates.endDate && selectedDate > new Date(rentalDates.endDate)) {
        toast({
          title: "Hata",
          description: "Başlangıç tarihi, bitiş tarihinden büyük olamaz",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    // Bitiş tarihi için kontrol
    if (name === "endDate") {
      if (selectedDate < today) {
        toast({
          title: "Hata",
          description: "Geçmiş bir tarih seçemezsiniz",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      // Eğer başlangıç tarihi varsa ve seçilen bitiş tarihi başlangıç tarihinden küçükse
      if (
        rentalDates.startDate &&
        selectedDate < new Date(rentalDates.startDate)
      ) {
        toast({
          title: "Hata",
          description: "Bitiş tarihi, başlangıç tarihinden küçük olamaz",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    setRentalDates((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRentClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (vehicle?.isBooked) {
      toast({
        title: "Hata",
        description: "Bu araç şu anda kiralanmış durumda",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsModalOpen(true);
  };

  const handleRent = async () => {
    if (!vehicle?.id || !rentalDates.startDate || !rentalDates.endDate) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurun",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      await bookingService.createBooking({
        vehicleId: vehicle.id,
        startDate: rentalDates.startDate,
        endDate: rentalDates.endDate,
      });

      toast({
        title: "Kiralama Başarılı",
        description:
          "Araç başarıyla kiralandı. Kiralamalarım sayfasından takip edebilirsiniz.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setIsModalOpen(false);
      navigate("/my-rentals");
    } catch (error) {
      toast({
        title: "Kiralama Başarısız",
        description: error instanceof Error ? error.message : "Bir hata oluştu",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  if (isLoading) {
    return (
      <Center h="calc(100vh - 100px)">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error || !vehicle) {
    return (
      <Center h="calc(100vh - 100px)">
        <Text color="red.500">{error || "Araç bulunamadı"}</Text>
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Grid
        templateColumns={{ base: "1fr", lg: "3fr 2fr" }}
        gap={6}
        alignItems="start"
      >
        {/* Sol Taraf - Resim */}
        <Box
          borderRadius="lg"
          overflow="hidden"
          bg={colorMode === "light" ? "white" : "gray.700"}
          shadow="md"
        >
          <Image
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model}`}
            width="100%"
            height="auto"
            maxH="500px"
            objectFit="cover"
          />
        </Box>

        {/* Sağ Taraf - Detaylar */}
        <Box
          bg={colorMode === "light" ? "white" : "gray.700"}
          p={6}
          borderRadius="lg"
          shadow="md"
        >
          <VStack align="stretch" spacing={6}>
            <Box>
              <Heading size="lg" mb={2}>
                {vehicle.brand} {vehicle.model}
              </Heading>
              <Badge colorScheme="blue" fontSize="lg" px={3} py={1}>
                {vehicle.year}
              </Badge>
              {vehicle.isBooked && (
                <Badge colorScheme="red" fontSize="lg" px={3} py={1} ml={2}>
                  Kiralandı
                </Badge>
              )}
            </Box>

            <Text
              fontSize="3xl"
              fontWeight="bold"
              color={colorMode === "light" ? "blue.600" : "blue.200"}
            >
              ₺{vehicle.priceADay} / gün
            </Text>

            <Divider />

            <Box>
              <Heading size="md" mb={4}>
                Teknik Özellikler
              </Heading>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <HStack>
                  <Text fontWeight="bold">Motor Gücü:</Text>
                  <Text>{vehicle.power} HP</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Yakıt:</Text>
                  <Text>{vehicle.fuelType}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Vites:</Text>
                  <Text>{vehicle.transmission}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Koltuk:</Text>
                  <Text>{vehicle.seats}</Text>
                </HStack>
              </Grid>
            </Box>

            <Button
              colorScheme="blue"
              size="lg"
              mt={4}
              onClick={handleRentClick}
              isDisabled={vehicle.isBooked}
            >
              {vehicle.isBooked ? "Kiralandı" : "Hemen Kirala"}
            </Button>
          </VStack>
        </Box>
      </Grid>

      {/* Rental Modal - Sadece giriş yapmış kullanıcılar için gösterilir */}
      {user && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Araç Kiralama</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Başlangıç Tarihi</FormLabel>
                  <Input
                    type="date"
                    name="startDate"
                    value={rentalDates.startDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Bitiş Tarihi</FormLabel>
                  <Input
                    type="date"
                    name="endDate"
                    value={rentalDates.endDate}
                    onChange={handleDateChange}
                    min={
                      rentalDates.startDate ||
                      new Date().toISOString().split("T")[0]
                    }
                  />
                </FormControl>
                {rentalDates.startDate && rentalDates.endDate && (
                  <Box
                    w="100%"
                    p={4}
                    bg={colorMode === "light" ? "gray.50" : "gray.700"}
                    borderRadius="md"
                  >
                    <Text fontWeight="bold">Toplam Tutar:</Text>
                    <Text
                      fontSize="xl"
                      color={colorMode === "light" ? "blue.600" : "blue.200"}
                    >
                      ₺
                      {vehicle.priceADay *
                        Math.ceil(
                          (new Date(rentalDates.endDate).getTime() -
                            new Date(rentalDates.startDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}
                    </Text>
                  </Box>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="ghost"
                mr={3}
                onClick={() => setIsModalOpen(false)}
              >
                İptal
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleRent}
                isDisabled={!rentalDates.startDate || !rentalDates.endDate}
              >
                Kirala
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default CarDetail;
