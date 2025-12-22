"""Currency conversion service."""

from forex_python.converter import CurrencyRates
from typing import Dict
from loguru import logger
from datetime import datetime, timedelta

class CurrencyService:
    """Real-time currency conversion service."""
    
    def __init__(self):
        self.converter = CurrencyRates()
        self.cache = {}
        self.cache_duration = timedelta(hours=1)
        
        # Fallback rates (used if API is unavailable)
        self.fallback_rates = {
            'USD': {'INR': 83.12, 'EUR': 0.92, 'GBP': 0.79},
            'INR': {'USD': 0.012, 'EUR': 0.011, 'GBP': 0.0095},
            'EUR': {'USD': 1.09, 'INR': 90.47, 'GBP': 0.86},
            'GBP': {'USD': 1.27, 'INR': 105.53, 'EUR': 1.16}
        }

    def get_exchange_rate(self, from_currency: str, to_currency: str) -> float:
        """Get exchange rate between two currencies."""
        if from_currency == to_currency:
            return 1.0

        cache_key = f"{from_currency}_{to_currency}"
        
        # Check cache
        if cache_key in self.cache:
            cached_data = self.cache[cache_key]
            if datetime.now() - cached_data['timestamp'] < self.cache_duration:
                return cached_data['rate']

        try:
            # Try to get live rate
            rate = self.converter.get_rate(from_currency, to_currency)
            
            # Cache the rate
            self.cache[cache_key] = {
                'rate': rate,
                'timestamp': datetime.now()
            }
            
            return rate
        except Exception as e:
            logger.warning(f"Failed to get live rate, using fallback: {str(e)}")
            
            # Use fallback rates
            if from_currency in self.fallback_rates and to_currency in self.fallback_rates[from_currency]:
                return self.fallback_rates[from_currency][to_currency]
            
            # If not in fallback, return 1.0 as last resort
            return 1.0

    def convert(self, amount: float, from_currency: str, to_currency: str) -> float:
        """Convert amount from one currency to another."""
        rate = self.get_exchange_rate(from_currency, to_currency)
        return round(amount * rate, 2)

    def convert_multiple(
        self,
        amounts: Dict[str, float],
        from_currency: str,
        to_currency: str
    ) -> Dict[str, float]:
        """Convert multiple amounts."""
        return {
            key: self.convert(value, from_currency, to_currency)
            for key, value in amounts.items()
        }

    def get_supported_currencies(self) -> list:
        """Get list of supported currencies."""
        return ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'JPY', 'CNY']

    def get_currency_symbol(self, currency: str) -> str:
        """Get currency symbol."""
        symbols = {
            'INR': '₹',
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'AED': 'د.إ',
            'SGD': 'S$',
            'JPY': '¥',
            'CNY': '¥'
        }
        return symbols.get(currency, currency)

# Service instance
currency_service = CurrencyService()
