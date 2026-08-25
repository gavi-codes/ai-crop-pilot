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

        # Database of active Central and Karnataka State Agricultural schemes
        schemes_db = [
            {
                'id': 'pm-kisan',
                'name': 'PM-KISAN Samman Nidhi',
                'category': 'Central',
                'subsidy_amount': '₹6,000 / Year',
                'description': 'Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families across the country.',
                'eligibility': 'All landholding farmers owning cultivable land in India.',
                'steps': '1. Link Aadhaar with Land Records. 2. Apply on PM-Kisan Portal. 3. Bank Account DBT Verification.',
                'is_eligible': True,
                'match_reason': 'You own cultivable land.'
            },
            {
                'id': 'pm-sinchayee',
                'name': 'PM Krishi Sinchayee Yojana (Micro-Irrigation)',
                'category': 'Central',
                'subsidy_amount': '90% Cost Subsidy' if land_size <= 5.0 else '45% Cost Subsidy',
                'description': 'Financial support for installing modern drip and sprinkler irrigation systems to conserve water resources.',
                'eligibility': 'Small farmers (up to 5.0 acres) get 90% subsidy; larger landholdings get 45% subsidy.',
                'steps': '1. Get a design quotation from a certified drip supplier. 2. Submit layout plan to Agriculture Dept. 3. Physical inspection.',
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
                'steps': '1. Submit land records (RTC) and borewell yield certificate. 2. Apply through BESCOM/GESCOM. 3. Co-payment deposit of 10%.',
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
                'steps': '1. Register crops at commercial/cooperative banks during sowing. 2. Pay 1.5% (Rabi) or 2% (Kharif) premium. 3. Claims credited via DBT.',
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
                'steps': '1. Register sowing details on the Fruit Portal. 2. Crop survey verification by village accountant. 3. Direct account payout.',
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
                'steps': '1. Visit nearest Custom Hiring Center. 2. Provide Farmer ID / FRUITS ID. 3. Book tractor hours.',
                'is_eligible': True,
                'match_reason': f"Your land size of {land_size} acres qualifies you for the {'50%' if land_size <= 5.0 else '20%'} hiring discount."
            }
        ]

        # Filter schemes that the user is eligible for
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
