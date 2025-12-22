"""Geolocation and distance calculation service."""

from geopy.geocoders import Nominatim
from geopy.distance import geodesic
from typing import Tuple, Optional
from loguru import logger

class GeolocationService:
    """Geolocation service for address and distance calculations."""
    
    def __init__(self):
        self.geolocator = Nominatim(user_agent="mediconnect")

    def get_coordinates(self, address: str) -> Optional[Tuple[float, float]]:
        """Get latitude and longitude from address."""
        try:
            location = self.geolocator.geocode(address)
            if location:
                return (location.latitude, location.longitude)
            return None
        except Exception as e:
            logger.error(f"Failed to geocode address: {str(e)}")
            return None

    def calculate_distance(
        self,
        coords1: Tuple[float, float],
        coords2: Tuple[float, float],
        unit: str = 'km'
    ) -> float:
        """Calculate distance between two coordinates."""
        try:
            distance = geodesic(coords1, coords2)
            
            if unit == 'km':
                return round(distance.kilometers, 2)
            elif unit == 'miles':
                return round(distance.miles, 2)
            elif unit == 'meters':
                return round(distance.meters, 2)
            else:
                return round(distance.kilometers, 2)
        except Exception as e:
            logger.error(f"Failed to calculate distance: {str(e)}")
            return 0.0

    def find_nearest_suppliers(
        self,
        user_location: Tuple[float, float],
        supplier_locations: list,
        max_distance: float = 50
    ) -> list:
        """Find suppliers within max_distance km."""
        nearby_suppliers = []
        
        for supplier in supplier_locations:
            supplier_coords = (supplier['latitude'], supplier['longitude'])
            distance = self.calculate_distance(user_location, supplier_coords)
            
            if distance <= max_distance:
                supplier['distance'] = distance
                nearby_suppliers.append(supplier)
        
        # Sort by distance
        nearby_suppliers.sort(key=lambda x: x['distance'])
        return nearby_suppliers

    def format_distance(self, distance_km: float) -> str:
        """Format distance for display."""
        if distance_km < 1:
            return f"{int(distance_km * 1000)}m"
        else:
            return f"{distance_km:.1f}km"

# Service instance
geolocation_service = GeolocationService()
