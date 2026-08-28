import { ref } from 'vue';

const savedLang = typeof localStorage !== 'undefined' ? localStorage.getItem('taskscam_lang') : null;
export const currentLang = ref(savedLang || 'ro');

export function setLanguage(lang) {
 currentLang.value = lang;
 if (typeof localStorage !== 'undefined') {
 localStorage.setItem('taskscam_lang', lang);
 }
}

export const translations = {
 ro: {
 hub_title: 'Hub Analiză Infrastructură Task Scam',
 hub_tag: 'Sisteme Piramidale · Expunere API · Vulnerabilități SQLi',
 search_placeholder: 'caută rapoarte, IOC-uri, endpoint-uri...',
 repo_link: 'repozitoriu github ↗',
 dossiers_title: 'dosare de investigație',
 intel_title: 'threat intel & matrice',
 nav_iocs: 'matrice ioc',
 nav_mitre: 'explorator mitre att&ck',
 investigator: 'investigator:',
 classification: 'TLP:CLEAR · Cyber Threat Intelligence',
 ioc_header_title: ' Matrice Indicatori de Compromitere (IOC)',
 ioc_header_sub: 'Hash-uri criptografice, adrese wallet USDT, domenii și baze de date expuse.',
 th_type: 'tip',
 th_indicator: 'indicator / valoare',
 th_desc: 'descriere amenințare',
 th_status: 'stare triaj',
 mitre_title: ' Cartografiere Matrice Enterprise MITRE ATT&CK',
 mitre_sub: 'Tacticile, tehnicile și procedurile (TTP) ale rețelei de fraudă.',
 t1_title: 'Acces Inițial & Fraudă Telegram',
 t1_desc: 'Recrutare victime prin mesaje sponsorizate Telegram și WhatsApp pentru joburi false de optimizare produse.',
 t2_title: 'Manipulare UI & Sold Fals',
 t2_desc: 'Interfețe web frauduloase care afișează profituri simulate pentru a convinge victima să depună fonduri USDT suplimentare.',
 t3_title: 'Exfiltrare & Spălare Crypto',
 t3_desc: 'Rerutarea automată a depozitelor TRC-20 / ERC-20 prin mixere și adrese de tranzit nebifurcate.'
 },
 en: {
 hub_title: 'Task Scam Infrastructure Analysis Hub',
 hub_tag: 'Pyramid Systems · API Exposure · SQLi Vulnerabilities',
 search_placeholder: 'search reports, iocs, endpoints...',
 repo_link: 'github repo ↗',
 dossiers_title: 'investigation dossiers',
 intel_title: 'threat intel & matrix',
 nav_iocs: 'ioc matrix',
 nav_mitre: 'mitre att&ck explorer',
 investigator: 'investigator:',
 classification: 'TLP:CLEAR · Cyber Threat Intelligence',
 ioc_header_title: ' Indicators of Compromise (IOC) Matrix',
 ioc_header_sub: 'Cryptographic hashes, USDT wallet addresses, domains and exposed database schemas.',
 th_type: 'type',
 th_indicator: 'indicator / value',
 th_desc: 'threat description',
 th_status: 'triage status',
 mitre_title: ' MITRE ATT&CK Enterprise Matrix Mapping',
 mitre_sub: 'Adversary tactics, techniques, and procedures (TTPs) of the fraud ring.',
 t1_title: 'Initial Access & Telegram Lures',
 t1_desc: 'Recruitment via sponsored Telegram channels and WhatsApp lures advertising fictitious product optimization tasks.',
 t2_title: 'UI Manipulation & Simulated Ledger',
 t2_desc: 'Deceptive frontend ledger displaying fabricated earnings to coerce victims into depositing additional USDT collateral.',
 t3_title: 'Exfiltration & Crypto Laundering',
 t3_desc: 'Automated sweeping of TRC-20 / ERC-20 deposits through nested wallet structures and mixer contracts.'
 }
};

export function t(key) {
 const dict = translations[currentLang.value] || translations.en;
 return dict[key] || translations.en[key] || key;
}
