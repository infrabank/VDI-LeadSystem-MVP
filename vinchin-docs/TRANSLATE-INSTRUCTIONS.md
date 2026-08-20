# Translator agent instructions — Vinchin manual EN→KO

You translate one batch of the Vinchin Backup & Recovery user manual into Korean for Korean enterprise IT engineers.

You will be told a batch id `NNN` (e.g. `004`). Work with these absolute paths:
- Glossary & rules: `C:/opencode/VDI-LeadSystem-MVP/vinchin-docs/GLOSSARY.md`
- Input:  `C:/opencode/VDI-LeadSystem-MVP/vinchin-docs/i18n/batches/b-NNN.json`  (a JSON array of English strings)
- Output: `C:/opencode/VDI-LeadSystem-MVP/vinchin-docs/i18n/batches/b-NNN.ko.json`

## Steps
1. Read `GLOSSARY.md` fully and obey it.
2. Read the input array `b-NNN.json`. Each element is either the innerHTML of a documentation block or a short UI label.
3. Translate every element to natural, polite Korean ("~합니다 / ~하세요 / ~할 수 있습니다").

## Hard rules
- **Preserve every HTML tag exactly**: same tag names, same order, same count, attributes unchanged (e.g. `href`). Translate ONLY the human-readable text between tags. Example: `Click <strong>Next</strong>.` → `<strong>Next</strong>를 클릭합니다.`
- **Keep in ENGLISH (do not translate):**
  - Product/feature names: Vinchin, VMware, vSphere, ESXi, Hyper-V, Proxmox, Citrix, XenServer, XCP-ng, oVirt, RHV, OLVM, ZStack, OpenStack, Sangfor, Huawei FusionCompute, H3C, Kubernetes, AWS, EC2, Oracle, MySQL, PostgreSQL, MariaDB, SQL Server, Microsoft 365, Exchange, NAS/SAN/DAS, CDP, etc.
  - UI control labels / buttons / tabs / field names / menu paths — especially text inside `<strong>` (e.g. Next, OK, Backup, Restore, General Strategy, `Backup > Kubernetes`, New Backup Job). These match the English screenshots, so keep them English.
  - Code, commands, file paths, IP addresses, ports, version numbers.
- Strings that are only symbols/numbers/punctuation: copy unchanged.
- Do not omit, merge, or reorder elements.

## OUTPUT FORMAT (critical for valid JSON)
Write `b-NNN.ko.json` as a JSON OBJECT whose keys are the input array INDICES as strings, and values are the Korean translation of that element:
```json
{ "0": "첫 번째 번역", "1": "두 번째 번역", "2": "..." }
```
- Provide an entry for EVERY index from 0 to (length-1). No gaps.
- Because Korean values contain quotes and HTML, ESCAPE properly: `"` → `\"`, backslash → `\\`. No raw newlines inside a string (use `\n` if needed, but blocks rarely need it).
- Do NOT use the English text as keys. Keys are indices only ("0","1",...). This keeps the JSON valid.
- Write the file in a SINGLE Write call. After writing, do not re-read or loop.

## Final message
Just report `done <count>/<inputLength>` — nothing else.
