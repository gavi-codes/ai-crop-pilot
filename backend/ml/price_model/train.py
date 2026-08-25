import csv
import json
import os
import re

def clean_and_train():
    data_dir = os.path.dirname(__file__)
    files = ['onion_prices_2024.csv', 'onion_prices_2024_part2.csv']
    
    historical_data = {}
    
    for f in files:
        path = os.path.join(data_dir, f)
        if not os.path.exists(path):
            continue
            
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
            
        # Parse the messy CSV manually
        blocks = content.split('"Title"')
        for block in blocks:
            if not block.strip():
                continue
            
            lines = block.strip().split('\n')
            title_line = lines[0]
            month_match = re.search(r'- ([A-Za-z]+), (\d{4})', title_line)
            if not month_match:
                continue
                
            month = month_match.group(1)
            year = month_match.group(2)
            
            # Skip header line
            for line in lines[2:]:
                if not line.strip() or line.startswith('Average') or line.startswith('Note:') or '=' in line:
                    continue
                    
                parts = line.split(',')
                if len(parts) >= 2:
                    district = parts[0].strip()
                    price_str = parts[1].strip()
                    
                    if price_str != '-' and price_str:
                        try:
                            price = float(price_str)
                            if district not in historical_data:
                                historical_data[district] = []
                            historical_data[district].append({
                                'month': f"{month} {year}",
                                'price': price
                            })
                        except ValueError:
                            pass

    # Save cleaned data
    output_path = os.path.join(data_dir, 'cleaned_price_data.json')
    with open(output_path, 'w') as f:
        json.dump(historical_data, f, indent=4)
        
    print("Data cleaned and saved to cleaned_price_data.json")

if __name__ == '__main__':
    clean_and_train()
