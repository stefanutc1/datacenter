import { ref } from 'vue';

const savedLang = typeof localStorage !== 'undefined' ? localStorage.getItem('openid_lang') : null;
export const currentLang = ref(savedLang || 'ro');

export function setLanguage(lang) {
  currentLang.value = lang;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('openid_lang', lang);
  }
}

export const translations = {
  ro: {
    hub_title: 'Hub de Analiză Forenzică OpenID AiTM',
    hub_tag: 'Steam OpenID · Browser-in-the-Middle · Analiză Forenzică AiTM',
    search_placeholder: 'caută studii de caz, IOC-uri, vectori...',
    repo_link: 'repozitoriu github ↗',
    dossiers_title: 'dosare forenzice',
    intel_title: 'threat intelligence & matrice',
    nav_iocs: 'matrice ioc',
    nav_mitre: 'explorator mitre att&ck',
    investigator: 'investigator:',
    classification: 'TLP:CLEAR · Cyber Threat Intelligence',
    ioc_header_title: '🎯 Matrice Indicatori de Compromitere (IOC)',
    ioc_header_sub: 'Hash-uri criptografice, vectori de telefonie, artefacte de domeniu și endpoint-uri expuse.',
    th_type: 'tip',
    th_indicator: 'indicator / valoare',
    th_desc: 'descriere amenințare',
    th_status: 'stare triaj',
    mitre_title: '📊 Cartografiere Matrice Enterprise MITRE ATT&CK',
    mitre_sub: 'Tacticile, tehnicile și procedurile (TTP) ale atacatorului mapate pe framework-ul enterprise.',
    t1_title: 'Acces Inițial & Phishing',
    t1_desc: 'Livrare prin momeli de spearphishing pe rețele sociale, mesaje directe pe Discord sau telefonie falsificată (Vishing).',
    t2_title: 'Acces Credențiale & Releu AiTM',
    t2_desc: 'Proxy-ing în timp real al provocărilor de autentificare, recoltare de tokenuri 2FA TOTP / 3DS și captură cookie-uri de sesiune.',
    t3_title: 'Persistență & Evaziune Apărare',
    t3_desc: 'Mecanisme de blocare a contului, configurare de chei API, filtrare User-Agent și pachete JavaScript minificate și obfuschete.'
  },
  en: {
    hub_title: 'OpenID AiTM Phishing Forensics Hub',
    hub_tag: 'Steam OpenID · Browser-in-the-Middle · AiTM Forensics',
    search_placeholder: 'search case study, iocs, vectors...',
    repo_link: 'github repo ↗',
    dossiers_title: 'forensic dossiers',
    intel_title: 'threat intel & matrix',
    nav_iocs: 'ioc matrix',
    nav_mitre: 'mitre att&ck explorer',
    investigator: 'investigator:',
    classification: 'TLP:CLEAR · Cyber Threat Intelligence',
    ioc_header_title: '🎯 Indicators of Compromise (IOC) Matrix',
    ioc_header_sub: 'Cryptographic hashes, telephony vectors, domain artifacts, and endpoint exposures.',
    th_type: 'type',
    th_indicator: 'indicator / value',
    th_desc: 'threat description',
    th_status: 'triage status',
    mitre_title: '📊 MITRE ATT&CK Enterprise Matrix Mapping',
    mitre_sub: 'Adversary tactics, techniques, and procedures (TTPs) mapped to the enterprise framework.',
    t1_title: 'Initial Access & Phishing',
    t1_desc: 'Delivery via targeted spearphishing lures on social networks, Discord direct messages, or spoofed telephony (Vishing).',
    t2_title: 'Credential Access & AiTM Relay',
    t2_desc: 'Real-time proxying of authentication challenges, harvesting of 2FA TOTP / 3DS tokens, and session cookie capture.',
    t3_title: 'Persistence & Defense Evasion',
    t3_desc: 'Account locking mechanisms, API key provisioning, User-Agent filtering, and minified obfuscated JavaScript bundles.'
  }
};

export function t(key) {
  const dict = translations[currentLang.value] || translations.en;
  return dict[key] || translations.en[key] || key;
}
