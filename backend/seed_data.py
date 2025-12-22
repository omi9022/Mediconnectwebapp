"""Seed database with sample data for development."""

from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from auth import get_password_hash
import models

def seed_database():
    """Seed the database with sample data."""
    db = SessionLocal()
    
    try:
        print("🌱 Seeding database...")
        
        # Create admin user
        admin = models.User(
            email="admin@mediconnect.com",
            username="admin",
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            user_type=models.UserType.ADMIN,
            phone="+91 98765 54321",
            location="Vadodara, Gujarat",
            verified=True
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        print("✅ Admin user created")
        
        # Create hospital user
        hospital = models.User(
            email="cityhospital@mediconnect.com",
            username="cityhospital",
            hashed_password=get_password_hash("hospital123"),
            full_name="City Hospital",
            user_type=models.UserType.HOSPITAL,
            phone="+91 98765 00001",
            location="Vadodara, Gujarat",
            verified=True
        )
        db.add(hospital)
        db.commit()
        db.refresh(hospital)
        print("✅ Hospital user created")
        
        # Create user settings
        admin_settings = models.UserSettings(user_id=admin.id)
        hospital_settings = models.UserSettings(user_id=hospital.id)
        db.add_all([admin_settings, hospital_settings])
        db.commit()
        print("✅ User settings created")
        
        # Create suppliers
        suppliers_data = [
            {
                "name": "MedPlus Distributors",
                "email": "medplus@example.com",
                "phone": "+91 98765 11111",
                "location": "Vadodara, Gujarat",
                "latitude": 22.3072,
                "longitude": 73.1812,
                "distance": "2.5km",
                "rating": 4.8,
                "verified": True
            },
            {
                "name": "Apollo Pharmacy Hub",
                "email": "apollo@example.com",
                "phone": "+91 98765 22222",
                "location": "Vadodara, Gujarat",
                "latitude": 22.3176,
                "longitude": 73.1896,
                "distance": "4.1km",
                "rating": 4.7,
                "verified": True
            },
            {
                "name": "Healthcare Solutions",
                "email": "healthcare@example.com",
                "phone": "+91 98765 33333",
                "location": "Vadodara, Gujarat",
                "latitude": 22.2945,
                "longitude": 73.1590,
                "distance": "8.0km",
                "rating": 4.9,
                "verified": True
            },
            {
                "name": "Wellness Pharma",
                "email": "wellness@example.com",
                "phone": "+91 98765 44444",
                "location": "Vadodara, Gujarat",
                "latitude": 22.3156,
                "longitude": 73.1750,
                "distance": "3.5km",
                "rating": 4.6,
                "verified": True
            }
        ]
        
        suppliers = []
        for supplier_data in suppliers_data:
            supplier = models.Supplier(**supplier_data)
            db.add(supplier)
            suppliers.append(supplier)
        
        db.commit()
        print(f"✅ {len(suppliers)} suppliers created")
        
        # Create products
        products_data = [
            {
                "name": "Remdesivir Inj. 100mg",
                "brand": "Cipla",
                "category": "Emergency",
                "description": "Antiviral medication",
                "price": 1200,
                "market_price": 1800,
                "stock": 45,
                "min_stock_level": 20,
                "supplier_id": suppliers[0].id,
                "urgent": True,
                "rating": 4.5
            },
            {
                "name": "Enoxaparin Sodium",
                "brand": "Sanofi",
                "category": "Emergency",
                "description": "Anticoagulant",
                "price": 450,
                "market_price": 620,
                "stock": 12,
                "min_stock_level": 20,
                "supplier_id": suppliers[1].id,
                "urgent": True,
                "rating": 4.7
            },
            {
                "name": "Tocilizumab 400mg",
                "brand": "Roche",
                "category": "Emergency",
                "description": "Immunosuppressive drug",
                "price": 32000,
                "market_price": 40000,
                "stock": 3,
                "min_stock_level": 5,
                "supplier_id": suppliers[2].id,
                "urgent": True,
                "rating": 4.8
            },
            {
                "name": "Dexamethasone 8mg",
                "brand": "Pfizer",
                "category": "Pharma",
                "description": "Corticosteroid",
                "price": 85,
                "market_price": 120,
                "stock": 89,
                "min_stock_level": 30,
                "supplier_id": suppliers[0].id,
                "urgent": False,
                "rating": 4.6
            },
            {
                "name": "Azithromycin 500mg",
                "brand": "Sun Pharma",
                "category": "Pharma",
                "description": "Antibiotic",
                "price": 45,
                "market_price": 75,
                "stock": 156,
                "min_stock_level": 50,
                "supplier_id": suppliers[3].id,
                "urgent": False,
                "rating": 4.4
            },
            {
                "name": "Surgical Gloves (Box)",
                "brand": "Ansell",
                "category": "Surgical",
                "description": "Latex surgical gloves",
                "price": 180,
                "market_price": 250,
                "stock": 234,
                "min_stock_level": 100,
                "supplier_id": suppliers[0].id,
                "urgent": False,
                "rating": 4.9
            },
            {
                "name": "N95 Masks (Pack of 10)",
                "brand": "3M",
                "category": "Consumables",
                "description": "Respiratory protection",
                "price": 120,
                "market_price": 180,
                "stock": 567,
                "min_stock_level": 200,
                "supplier_id": suppliers[1].id,
                "urgent": False,
                "rating": 4.7
            },
            {
                "name": "Digital Thermometer",
                "brand": "Omron",
                "category": "Equipment",
                "description": "Medical thermometer",
                "price": 450,
                "market_price": 650,
                "stock": 78,
                "min_stock_level": 30,
                "supplier_id": suppliers[2].id,
                "urgent": False,
                "rating": 4.5
            }
        ]
        
        products = []
        for product_data in products_data:
            product = models.Product(**product_data)
            db.add(product)
            products.append(product)
        
        db.commit()
        print(f"✅ {len(products)} products created")
        
        # Create sample notifications
        notifications_data = [
            {
                "user_id": hospital.id,
                "title": "Low Stock Alert",
                "message": "Remdesivir stock below 50 units",
                "type": "warning",
                "read": False
            },
            {
                "user_id": hospital.id,
                "title": "New Supplier Added",
                "message": "Healthcare Solutions verified",
                "type": "info",
                "read": True
            },
            {
                "user_id": hospital.id,
                "title": "Price Drop",
                "message": "Remdesivir price reduced by 15%",
                "type": "info",
                "read": True
            }
        ]
        
        for notif_data in notifications_data:
            notification = models.Notification(**notif_data)
            db.add(notification)
        
        db.commit()
        print(f"✅ {len(notifications_data)} notifications created")
        
        # Create sample payment methods
        payment_methods = [
            {
                "user_id": hospital.id,
                "card_type": "Visa",
                "last_four": "4242",
                "expiry_month": 12,
                "expiry_year": 2025,
                "is_default": True
            },
            {
                "user_id": hospital.id,
                "card_type": "Mastercard",
                "last_four": "8888",
                "expiry_month": 6,
                "expiry_year": 2026,
                "is_default": False
            }
        ]
        
        for pm_data in payment_methods:
            payment_method = models.PaymentMethod(**pm_data)
            db.add(payment_method)
        
        db.commit()
        print(f"✅ {len(payment_methods)} payment methods created")
        
        print("\n🎉 Database seeded successfully!")
        print("\n📝 Login Credentials:")
        print("   Admin: admin / admin123")
        print("   Hospital: cityhospital / hospital123")
        
    except Exception as e:
        print(f"❌ Error seeding database: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    seed_database()
