"""Payment processing service using Stripe."""

import stripe
from decouple import config
from typing import Optional, Dict
from loguru import logger

class PaymentService:
    """Payment processing service."""
    
    def __init__(self):
        self.api_key = config('STRIPE_SECRET_KEY', default=None)
        if self.api_key:
            stripe.api_key = self.api_key

    async def create_payment_intent(
        self,
        amount: float,
        currency: str = "inr",
        metadata: Optional[Dict] = None
    ) -> Optional[Dict]:
        """Create a payment intent."""
        if not self.api_key:
            logger.warning("Stripe not configured. Simulating payment.")
            return {
                'id': f'pi_simulated_{int(amount)}',
                'amount': int(amount * 100),
                'currency': currency,
                'status': 'succeeded',
                'client_secret': 'simulated_secret'
            }

        try:
            # Convert to smallest currency unit (paise for INR, cents for USD)
            amount_in_cents = int(amount * 100)
            
            intent = stripe.PaymentIntent.create(
                amount=amount_in_cents,
                currency=currency.lower(),
                metadata=metadata or {},
                automatic_payment_methods={'enabled': True}
            )
            
            return {
                'id': intent.id,
                'amount': intent.amount,
                'currency': intent.currency,
                'status': intent.status,
                'client_secret': intent.client_secret
            }
        except Exception as e:
            logger.error(f"Failed to create payment intent: {str(e)}")
            return None

    async def confirm_payment(self, payment_intent_id: str) -> bool:
        """Confirm a payment intent."""
        if not self.api_key:
            logger.info(f"Simulating payment confirmation for {payment_intent_id}")
            return True

        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            return intent.status == 'succeeded'
        except Exception as e:
            logger.error(f"Failed to confirm payment: {str(e)}")
            return False

    async def create_customer(
        self,
        email: str,
        name: str,
        phone: Optional[str] = None
    ) -> Optional[str]:
        """Create a Stripe customer."""
        if not self.api_key:
            logger.info(f"Simulating customer creation for {email}")
            return f"cus_simulated_{email.split('@')[0]}"

        try:
            customer = stripe.Customer.create(
                email=email,
                name=name,
                phone=phone
            )
            return customer.id
        except Exception as e:
            logger.error(f"Failed to create customer: {str(e)}")
            return None

    async def save_payment_method(
        self,
        customer_id: str,
        payment_method_id: str
    ) -> bool:
        """Attach payment method to customer."""
        if not self.api_key:
            logger.info(f"Simulating payment method save for {customer_id}")
            return True

        try:
            stripe.PaymentMethod.attach(
                payment_method_id,
                customer=customer_id
            )
            return True
        except Exception as e:
            logger.error(f"Failed to save payment method: {str(e)}")
            return False

    async def process_refund(
        self,
        payment_intent_id: str,
        amount: Optional[float] = None
    ) -> bool:
        """Process a refund."""
        if not self.api_key:
            logger.info(f"Simulating refund for {payment_intent_id}")
            return True

        try:
            refund_data = {'payment_intent': payment_intent_id}
            if amount:
                refund_data['amount'] = int(amount * 100)
            
            refund = stripe.Refund.create(**refund_data)
            return refund.status == 'succeeded'
        except Exception as e:
            logger.error(f"Failed to process refund: {str(e)}")
            return False

    async def get_payment_methods(self, customer_id: str) -> list:
        """Get saved payment methods for a customer."""
        if not self.api_key:
            logger.info(f"Simulating payment methods retrieval for {customer_id}")
            return []

        try:
            payment_methods = stripe.PaymentMethod.list(
                customer=customer_id,
                type='card'
            )
            return payment_methods.data
        except Exception as e:
            logger.error(f"Failed to get payment methods: {str(e)}")
            return []

# Service instance
payment_service = PaymentService()
