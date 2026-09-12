from models import User

class SchemeService:

    @staticmethod
    def get_eligible_schemes(user_id):
        user = User.query.get(user_id)
        if not user:
            return {'success': False, 'message': 'User not found'}

        district = (user.district or 'Koppal').strip()
        dist_lower = district.lower()
        land_size = user.land_size or 1.0
        soil_type = user.soil_type or 'Black Soil'

        schemes_db = [
            {
                'id': 'pm-kisan',
                'name': 'PM-KISAN Samman Nidhi',
                'category': 'Central',
                'subsidy_amount': '₹6,000 / Year',
                'description': 'Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families.',
                'eligibility': 'All landholding farmers owning cultivable land in India.',
                'steps': 'Full Procedure for PM-KISAN:\n1. Open pmkisan.gov.in and click on "New Farmer Registration".\n2. Enter your Aadhaar Number and Mobile Number.\n3. Verify with Aadhaar OTP.\n4. Enter Land details (Khata Number, Survey Number, Area).\n5. Upload land ownership documents (RTC/Pahani).\n6. Submit. Wait for physical verification by the Village Accountant (VA).\n7. Once approved, subsidy is directly credited via DBT to your bank.',
                'is_eligible': True,
                'match_reason': 'You own cultivable land.'
            },
            {
                'id': 'pm-sinchayee',
                'name': 'PM Krishi Sinchayee Yojana (Micro-Irrigation)',
                'category': 'Central',
                'subsidy_amount': '90% Cost Subsidy' if land_size <= 5.0 else '45% Cost Subsidy',
                'description': 'Financial support for installing modern drip and sprinkler irrigation systems.',
                'eligibility': 'Small farmers (up to 5.0 acres) get 90% subsidy; larger landholdings get 45% subsidy.',
                'steps': 'Full Procedure for Micro-Irrigation Subsidy:\n1. Obtain a quotation from a government-empanelled Drip Irrigation supplier.\n2. Apply online at pmksy.gov.in or visit the Raitha Samparka Kendra (RSK).\n3. Submit documents: Aadhaar, RTC, Bank Passbook, and Supplier Quotation.\n4. Agriculture Department will conduct a field inspection.\n5. Upon approval, a work order is generated.\n6. After installation, a joint inspection is done, and the subsidy is released directly to the supplier.',
                'is_eligible': True,
                'match_reason': f"Your land size of {land_size} acres qualifies you for the {'90% maximum' if land_size <= 5.0 else '45% standard'} drip irrigation subsidy."
            },
            {
                'id': 'surya-raitha',
                'name': 'Surya Raitha Scheme (Solar Pump)',
                'category': 'State',
                'subsidy_amount': '90% Capital Subsidy',
                'description': 'Karnataka Government initiative providing solar-powered water pumps to replace conventional diesel/electric pumps in dry regions.',
                'eligibility': 'Active farmers in dry-zone districts (Koppal, Raichur, Gulbarga) who possess borewells.',
                'steps': 'Full Procedure for Surya Raitha:\n1. Apply through the nearest BESCOM/GESCOM subdivision office.\n2. Submit your Aadhaar, RTC (Pahani), and a valid Borewell Yield Certificate.\n3. Wait for technical feasibility clearance from the electricity board.\n4. Pay the 10% farmer co-payment deposit at the bank.\n5. The solar pump agency installs the panel and pump.\n6. The pump is linked to the grid, and excess power generated can be sold back to the government.',
                'is_eligible': dist_lower in ['koppal', 'raichur', 'gulbarga'],
                'match_reason': f"Eligible district: {district} is designated as a dry-zone area qualifying for solar grid integration."
            },
            {
                'id': 'pm-fasal-bima',
                'name': 'PM Fasal Bima Yojana (Crop Insurance)',
                'category': 'Central',
                'subsidy_amount': 'Low Premium (1.5% - 2%)',
                'description': 'Comprehensive yield insurance coverage against crop failure due to drought, flooding, pests, or disease outbreaks.',
                'eligibility': 'All farmers cultivating notified crops in defined districts.',
                'steps': 'Full Procedure for Crop Insurance:\n1. Download the "Crop Insurance App" or visit pmfby.gov.in.\n2. Register as a farmer. Enter Aadhaar and Bank details.\n3. Select your Crop, Season (Kharif/Rabi), and District.\n4. Upload Sowing Certificate (provided by VA) and Land Records.\n5. Pay the highly subsidized premium (2% for Kharif, 1.5% for Rabi) online.\n6. In case of crop loss, report within 72 hours on the portal to claim insurance payout via DBT.',
                'is_eligible': True,
                'match_reason': f"Your crops match the Kharif/Rabi sowing index in {district}."
            },
            {
                'id': 'raitha-siri',
                'name': 'Raitha Siri Scheme (Millet Promotion)',
                'category': 'State',
                'subsidy_amount': '₹10,000 / Hectare',
                'description': 'Incentive to promote minor millet cultivation (Ragi, Jowar, Sajje) in dry areas to address climate resilience.',
                'eligibility': 'Karnataka farmers cultivating millets with registered crop survey details.',
                'steps': 'Full Procedure for Raitha Siri:\n1. Register your farmer profile on the Karnataka FRUITS Portal (fruits.karnataka.gov.in).\n2. During the crop season, ensure the Village Accountant registers your millet crop in the "Bhoomi E-Crop Survey".\n3. Visit the Raitha Samparka Kendra (RSK) and submit a simple application with your FRUITS ID.\n4. The Agriculture Officer verifies the crop survey data online.\n5. The incentive of ₹10,000 per hectare is directly transferred to your Aadhaar-seeded bank account in two installments.',
                'is_eligible': dist_lower in ['koppal', 'raichur', 'gulbarga', 'davangere', 'mysuru'],
                'match_reason': f"Your district {district} is eligible for dry-land millet financial incentives."
            },
            {
                'id': 'krishi-yantra',
                'name': 'Krishi Yantra Dhare (Machinery Renting)',
                'category': 'State',
                'subsidy_amount': '50% Rent Discount' if land_size <= 5.0 else '20% Rent Discount',
                'description': 'Custom hiring centers established across Karnataka enabling smallholders to hire tractors and heavy farm machinery at subsidized rates.',
                'eligibility': 'Marginal and small farmers with active agricultural landholding IDs.',
                'steps': 'Full Procedure for Machinery Hiring:\n1. Locate your hobli-level Custom Hiring Service Center (CHSC) on the CHSC Karnataka Portal.\n2. Walk into the center with your Aadhaar Card and FRUITS ID.\n3. The staff will verify your land size to determine your discount tier (50% for <5 acres).\n4. Book the tractor/harvester for specific dates and hours.\n5. Pay the discounted rental fee in advance.\n6. The machinery will arrive at your field on the scheduled date.',
                'is_eligible': True,
                'match_reason': f"Your land size of {land_size} acres qualifies you for the {'50%' if land_size <= 5.0 else '20%'} hiring discount."
            }
        ]

        eligible_schemes = [s for s in schemes_db if s['is_eligible']]

        return {
            'success': True,
            'data': {
                'farmer': {
                    'name': user.name,
                    'district': district,
                    'land_size': land_size,
                    'soil_type': soil_type
                },
                'schemes': eligible_schemes
            }
        }
