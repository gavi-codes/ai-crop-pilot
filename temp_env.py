with open('backend/.env', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('postgres\n# Security', 'postgres"\n# Security')

with open('backend/.env', 'w', encoding='utf-8') as f:
    f.write(text)
