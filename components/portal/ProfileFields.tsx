import React from 'react';
import { Lang, Profile, ProfileDetails } from './types';

const t = {
  en: { fullName: 'Full name', clinic: 'Clinic / practice', city: 'City', country: 'Country', phone: 'Phone' },
  sq: { fullName: 'Emri i plotë', clinic: 'Klinika / praktika', city: 'Qyteti', country: 'Shteti', phone: 'Telefoni' },
};

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white';
const labelClass = 'block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2';

export function detailsFromProfile(p: Profile | null | undefined): ProfileDetails {
  return {
    full_name: p?.full_name || '',
    clinic: p?.clinic || '',
    city: p?.city || '',
    country: p?.country || '',
    phone: p?.phone || '',
  };
}

/** Name + practice details form fields (used in Account and course requests). */
const ProfileFields: React.FC<{ lang: Lang; value: ProfileDetails; onChange: (v: ProfileDetails) => void }> = ({
  lang,
  value,
  onChange,
}) => {
  const s = t[lang];
  const set = (k: keyof ProfileDetails) => (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...value, [k]: e.target.value });
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className={labelClass}>{s.fullName}</label>
        <input value={value.full_name} onChange={set('full_name')} required autoComplete="name" className={inputClass} />
      </div>
      <div className="sm:col-span-2">
        <label className={labelClass}>{s.clinic}</label>
        <input value={value.clinic} onChange={set('clinic')} required autoComplete="organization" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>{s.city}</label>
        <input value={value.city} onChange={set('city')} required autoComplete="address-level2" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>{s.country}</label>
        <input value={value.country} onChange={set('country')} autoComplete="country-name" className={inputClass} />
      </div>
      <div className="sm:col-span-2">
        <label className={labelClass}>{s.phone}</label>
        <input type="tel" value={value.phone} onChange={set('phone')} required autoComplete="tel" className={inputClass} />
      </div>
    </div>
  );
};

export default ProfileFields;
