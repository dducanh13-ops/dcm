import { Car } from 'lucide-react';

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  fuelEconomy: string;
  horsepower: number;
  image: string;
  rating: number;
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
];

const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'Hyundai', 'Kia', 'Volkswagen', 'BMW', 'Mercedes-Benz'];
const models = ['Sedan', 'SUV', 'Truck', 'Hatchback', 'Coupe', 'Minivan', 'Crossover', 'Wagon', 'Convertible', 'Electric'];

const generateVehicles = (count: number): Vehicle[] => {
  return Array.from({ length: count }, (_, i) => {
    const make = makes[Math.floor(Math.random() * makes.length)];
    const model = `${models[Math.floor(Math.random() * models.length)]} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    return {
      id: i + 1,
      make,
      model,
      year: 2020 + Math.floor(Math.random() * 5),
      price: 20000 + Math.floor(Math.random() * 60000),
      fuelEconomy: `${20 + Math.floor(Math.random() * 20)}/${25 + Math.floor(Math.random() * 20)}`,
      horsepower: 150 + Math.floor(Math.random() * 300),
      image: `https://source.unsplash.com/featured/?${make},${model},car`,
      rating: 3 + Math.random() * 2,
    };
  });
};

export const vehicles = generateVehicles(100);

export const getVehicleImage = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (response.ok) {
      return url;
    }
    throw new Error('Image not found');
  } catch (error) {
    console.warn('Error loading image:', error);
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  }
};

export const getVehiclesByMake = (make: string): Vehicle[] => {
  return vehicles.filter(vehicle => vehicle.make.toLowerCase() === make.toLowerCase());
};