import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Star, DollarSign, Fuel, MessageCircle } from 'lucide-react';
import { vehicles, Vehicle, getVehicleImage, getVehiclesByMake } from '../data/vehicles';

const VEHICLES_PER_PAGE = 8;

const Home: React.FC = () => {
  const [displayedVehicles, setDisplayedVehicles] = useState<Vehicle[]>([]);
  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const location = useLocation();

  const allMakes = Array.from(new Set(vehicles.map(v => v.make))).sort();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
    setPage(1);
  }, [location.search]);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      let filtered = vehicles;

      if (selectedMakes.length > 0) {
        filtered = selectedMakes.flatMap(make => getVehiclesByMake(make));
      }

      filtered = filtered.filter(v => {
        const matchesSearch = searchQuery === '' || 
          v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.year.toString().includes(searchQuery);
        const matchesPrice = v.price >= priceRange[0] && v.price <= priceRange[1];
        return matchesSearch && matchesPrice;
      });

      const slicedVehicles = filtered.slice(0, page * VEHICLES_PER_PAGE);

      const vehiclesWithImages = await Promise.all(
        slicedVehicles.map(async (vehicle) => ({
          ...vehicle,
          image: await getVehicleImage(vehicle.image)
        }))
      );

      setDisplayedVehicles(vehiclesWithImages);
      setLoading(false);
    };

    fetchVehicles();
  }, [selectedMakes, page, searchQuery, priceRange]);

  const handleMakeToggle = (make: string) => {
    setSelectedMakes(prev =>
      prev.includes(make) ? prev.filter(m => m !== make) : [...prev, make]
    );
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handlePriceRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setPriceRange(prev => {
      if (event.target.id === 'minPrice') {
        return [value, prev[1]];
      } else {
        return [prev[0], value];
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="text-center mb-12 py-16 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold mb-4">Welcome to EasyDrive Reviews</h1>
        <p className="text-2xl">Practical car reviews for everyday drivers</p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Browse Vehicles</h2>
        <div className="mb-6 space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Brands</h3>
            <div className="flex flex-wrap gap-2">
              {allMakes.map(make => (
                <button
                  key={make}
                  onClick={() => handleMakeToggle(make)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedMakes.includes(make) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {make}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Price Range</h3>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                id="minPrice"
                min="0"
                max="100000"
                step="1000"
                value={priceRange[0]}
                onChange={handlePriceRangeChange}
                className="w-full"
              />
              <input
                type="range"
                id="maxPrice"
                min="0"
                max="100000"
                step="1000"
                value={priceRange[1]}
                onChange={handlePriceRangeChange}
                className="w-full"
              />
              <span>${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : displayedVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedVehicles.map((vehicle) => (
              <Link key={vehicle.id} to={`/review/${vehicle.id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative overflow-hidden">
                  <img src={vehicle.image} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-48 object-cover transition-transform duration-300 transform hover:scale-110" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-4">
                    <h3 className="text-lg font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Star className="text-yellow-400 mr-1" size={16} />
                      <span>{vehicle.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-gray-600 flex items-center">
                      <MessageCircle size={16} className="mr-1" />
                      {Math.floor(Math.random() * 100) + 1} reviews
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <DollarSign size={16} className="mr-1" />
                      {vehicle.price.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <Fuel size={16} className="mr-1" />
                      {vehicle.fuelEconomy}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">No vehicles available for the selected criteria.</div>
        )}
        {!loading && displayedVehicles.length < vehicles.filter(v => (selectedMakes.length === 0 || selectedMakes.includes(v.make)) && (searchQuery === '' || v.make.toLowerCase().includes(searchQuery.toLowerCase()) || v.model.toLowerCase().includes(searchQuery.toLowerCase()) || v.year.toString().includes(searchQuery))).length && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Why Choose EasyDrive Reviews?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Star className="text-blue-500 mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Expert Reviews</h3>
            <p>Get insights from our team of automotive experts.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <DollarSign className="text-blue-500 mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Price Comparisons</h3>
            <p>Easily compare prices across different models and brands.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Fuel className="text-blue-500 mb-4" size={32} />
            <h3 className="text-xl font-semibold mb-2">Fuel Efficiency</h3>
            <p>Find the most fuel-efficient vehicles for your needs.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;