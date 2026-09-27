import re
with open('frontend/src/components/Layout.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('<aside className="hidden lg:flex flex-col w-72 bg-slate-900 text-white border-r border-slate-800 shrink-0">', '<aside className="hidden lg:flex flex-col w-72 text-white border-r border-[#16A34A]/20 shrink-0" style={{ backgroundColor: \'#0B3D2E\' }}>')
code = code.replace('bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/10', 'bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/20')
code = code.replace('text-slate-400 hover:bg-slate-800 hover:text-white', 'text-[#DCFCE7]/70 hover:bg-white/10 hover:text-white')
code = code.replace('bg-slate-950/40', 'bg-black/20')
code = code.replace('bg-slate-800/40', 'bg-white/5')
code = code.replace('bg-gradient-to-tr from-emerald-500 to-teal-500', 'bg-[#16A34A]')

code = code.replace('<aside className={`\n        fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-slate-900 text-white border-r border-slate-850', '<aside style={{ backgroundColor: \'#0B3D2E\' }} className={`\n        fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 text-white border-r border-[#16A34A]/20')
code = code.replace('bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md', 'bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/20')

code = code.replace('bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] \nfrom-emerald-50/30 via-slate-50 to-teal-50/15', 'bg-[#F7FAF8]')
code = code.replace('text-slate-800', 'text-[#17221D]')
code = code.replace('bg-white border-b border-slate-100', 'bg-white border-b border-slate-100 shadow-sm')

with open('frontend/src/components/Layout.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
