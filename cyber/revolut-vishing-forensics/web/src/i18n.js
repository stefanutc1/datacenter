import { ref } from 'vue';

const savedLang = typeof localStorage !== 'undefined' ? localStorage.getItem('revolut_lang') : null;
export const currentLang = ref(savedLang || 'ro');

export function setLanguage(lang) {
  currentLang.value = lang;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('revolut_lang', lang);
  }
}

export const translations = {
  ro: {
    hub_title: 'Hub de Analiză Forenzică Revolut Vishing',
    hub_tag: 'Inginerie Socială · Spoofing Caller ID · Suprascriere 3DS',
    search_placeholder: 'caută rapoarte, IOC-uri, numere de telefon...',
    repo_link: 'repozitoriu github ↗',
    dossiers_title: 'dosare de investigație',
    intel_title: 'threat intel & matrice',
    nav_iocs: 'matrice ioc',
    nav_mitre: 'explorator mitre att&ck',
    investigator: 'investigator:',
    classification: 'TLP:CLEAR · Cyber Threat Intelligence',
    ioc_header_title: '🎯 Matrice Indicatori de Compromitere (IOC)',
    ioc_header_sub: 'Numere de telefon spoofate, gateway-uri VoIP, adrese IP C2 și tokenuri exfiltrate.',
    th_type: 'tip',
    th_indicator: 'indicator / valoare',
    th_desc: 'descriere amenințare',
    th_status: 'stare triaj',
    mitre_title: '📊 Cartografiere Matrice Enterprise MITRE ATT&CK',
    mitre_sub: 'Tacticile, tehnicile și procedurile (TTP) din atacurile de tip vishing financiar.',
    t1_title: 'Inginerie Socială & Spoofing',
    t1_desc: 'Apeluri vocale frauduloase mascate ca departament de securitate bancară utilizând furnizori SIP permisivi.',
    t2_title: 'Releu Tokenuri & Suprascriere 3DS',
    t2_desc: 'Manipularea victimei pentru a autoriza notificări push 3DS sau a dicta coduri unice OTP de securitate.',
    t3_title: 'Exfiltrare & Transfer Imediat',
    t3_desc: 'Transferuri SEPA instantanee și conversii crypto imediate către conturi de tranzit fără KYC.'
  },
  en: {
    hub_title: 'Revolut Vishing Forensics Hub',
    hub_tag: 'Social Engineering · Caller ID Spoofing · 3DS Push Override',
    search_placeholder: 'search reports, iocs, phone numbers...',
    repo_link: 'github repo ↗',
    dossiers_title: 'investigation dossiers',
    intel_title: 'threat intel & matrix',
    nav_iocs: 'ioc matrix',
    nav_mitre: 'mitre att&ck explorer',
    investigator: 'investigator:',
    classification: 'TLP:CLEAR · Cyber Threat Intelligence',
    ioc_header_title: '🎯 Indicators of Compromise (IOC) Matrix',
    ioc_header_sub: 'Spoofed caller IDs, VoIP gateways, C2 IP ranges, and exfiltrated authorization tokens.',
    th_type: 'type',
    th_indicator: 'indicator / value',
    th_desc: 'threat description',
    th_status: 'triage status',
    mitre_title: '📊 MITRE ATT&CK Enterprise Matrix Mapping',
    mitre_sub: 'Adversary tactics, techniques, and procedures (TTPs) of financial vishing operations.',
    t1_title: 'Social Engineering & Spoofing',
    t1_desc: 'Fraudulent voice calls impersonating bank fraud prevention units utilizing permissive SIP trunking providers.',
    t2_title: 'Token Relay & 3DS Push Override',
    t2_desc: 'Coercing victims into approving out-of-band 3DS push authorizations or dictating one-time passcodes.',
    t3_title: 'Exfiltration & Instant Off-Ramping',
    t3_desc: 'Immediate SEPA Instant transfers and crypto off-ramping to non-KYC mule accounts and tumbler pools.'
  }
};

export function t(key) {
  const dict = translations[currentLang.value] || translations.en;
  return dict[key] || translations.en[key] || key;
}
