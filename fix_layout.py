import re
with open('frontend/src/components/Layout.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = re.sub(r'bg-\[radial-gradient.*font-sans', 'bg-[#F7FAF8] text-[#17221D] font-sans', code, flags=re.DOTALL)
code = code.replace('overflow-y-auto bg-slate-50', 'overflow-y-auto bg-[#F7FAF8]')

with open('frontend/src/components/Layout.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
