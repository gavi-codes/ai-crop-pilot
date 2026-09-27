import re

with open('frontend/src/pages/SoilAnalysis/SoilForm.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace text colors
code = code.replace('text-slate-900', 'text-[#17221D]')
code = code.replace('text-slate-800', 'text-[#17221D]')
code = code.replace('text-slate-500', 'text-[#64748B]')
code = code.replace('text-slate-600', 'text-[#64748B]')

# Replace backgrounds and borders
code = code.replace('bg-emerald-500', 'bg-[#16A34A]')
code = code.replace('bg-emerald-600', 'bg-[#0B3D2E]')
code = code.replace('hover:bg-emerald-600', 'hover:bg-[#0B3D2E]')
code = code.replace('border-emerald-500', 'border-[#16A34A]')
code = code.replace('border-t-emerald-500', 'border-t-[#16A34A]')
code = code.replace('shadow-emerald-500/30', 'shadow-[#16A34A]/30')
code = code.replace('ring-emerald-500', 'ring-[#16A34A]')
code = code.replace('text-emerald-500', 'text-[#16A34A]')
code = code.replace('text-emerald-600', 'text-[#0B3D2E]')
code = code.replace('bg-emerald-50', 'bg-[#DCFCE7]')
code = code.replace('border-emerald-200', 'border-[#16A34A]/20')
code = code.replace('bg-gradient-to-r from-emerald-500 to-teal-500', 'bg-[#16A34A]')
code = code.replace('bg-gradient-to-r from-emerald-600 to-teal-600', 'bg-[#0B3D2E]')

code = code.replace('bg-slate-50', 'bg-[#F7FAF8]')
code = code.replace('bg-slate-100', 'bg-slate-100')
code = code.replace('border-slate-100', 'border-slate-200')
code = code.replace('border-slate-200', 'border-slate-300')
code = code.replace('shadow-xl shadow-slate-200/50', 'shadow-md shadow-slate-200/50')

with open('frontend/src/pages/SoilAnalysis/SoilForm.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
