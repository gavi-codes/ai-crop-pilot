import os

# Define replacement mappings for the exact design system
replacements = {
    'text-slate-900': 'text-[#17221D]',
    'text-slate-800': 'text-[#17221D]',
    'text-slate-500': 'text-[#64748B]',
    'text-slate-600': 'text-[#64748B]',
    
    'bg-emerald-500': 'bg-[#16A34A]',
    'bg-emerald-600': 'bg-[#0B3D2E]',
    'hover:bg-emerald-600': 'hover:bg-[#0B3D2E]',
    'border-emerald-500': 'border-[#16A34A]',
    'border-t-emerald-500': 'border-t-[#16A34A]',
    'shadow-emerald-500/30': 'shadow-[#16A34A]/30',
    'shadow-emerald-500/20': 'shadow-[#16A34A]/20',
    'ring-emerald-500': 'ring-[#16A34A]',
    'text-emerald-500': 'text-[#16A34A]',
    'text-emerald-600': 'text-[#0B3D2E]',
    'bg-emerald-50': 'bg-[#DCFCE7]',
    'bg-emerald-100': 'bg-[#DCFCE7]',
    'border-emerald-200': 'border-[#16A34A]/20',
    'bg-gradient-to-r from-emerald-500 to-teal-500': 'bg-[#16A34A]',
    'bg-gradient-to-r from-emerald-600 to-teal-600': 'bg-[#0B3D2E]',
    
    'bg-slate-50': 'bg-[#F7FAF8]',
    'shadow-xl shadow-slate-200/50': 'shadow-sm border border-slate-200',
    'shadow-lg shadow-slate-200/50': 'shadow-sm border border-slate-200',
    'rounded-3xl': 'rounded-2xl',
    
    'bg-gradient-to-br from-emerald-50 to-teal-100': 'bg-[#F7FAF8]',
    'from-emerald-50 to-teal-100': 'bg-[#F7FAF8]'
}

pages_dir = 'frontend/src/pages'

for root, dirs, files in os.walk(pages_dir):
    for file in files:
        if file.endswith('.jsx'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            modified = False
            new_content = content
            for old, new in replacements.items():
                if old in new_content:
                    new_content = new_content.replace(old, new)
                    modified = True
            
            if modified:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {file_path}")
