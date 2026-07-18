
import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, Check } from 'lucide-react';

interface ContactFormProps {
  lang: 'en' | 'sq';
}

const ContactForm: React.FC<ContactFormProps> = ({ lang }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const labels = {
    title: lang === 'en' ? "Let's Design Your Smile Together" : "Le të Dizajnojmë Buzëqeshjen tuaj Së bashku",
    desc: lang === 'en' 
      ? "Fill out the form for a free surgical assessment. Our world-class Chief Oral Surgeon will review your case." 
      : "Plotësoni formularin për një vlerësim kirurgjikal falas. Kryekirurgja jonë specialiste do të rishikojë rastin tuaj.",
    call: lang === 'en' ? "Call/WhatsApp" : "Telefon/WhatsApp",
    location: lang === 'en' ? "Location" : "Lokacioni",
    prishtina: lang === 'en' ? "Rr. Bajram Kelmendi, Pejë, Kosovo" : "Rr. Bajram Kelmendi, Pejë, Kosovë",
    successTitle: lang === 'en' ? "Message Sent!" : "Mesazhi u Dërgua!",
    successDesc: lang === 'en' ? "Our patient coordinator will contact you shortly." : "Koordinatori ynë i pacientëve do t'ju kontaktojë së shpejti.",
    nameLabel: lang === 'en' ? "Full Name" : "Emri dhe Mbiemri",
    phoneLabel: lang === 'en' ? "Phone Number" : "Numri i Telefonit",
    interestLabel: lang === 'en' ? "Treatment Interest" : "Interesimi për Trajtim",
    messageLabel: lang === 'en' ? "Message" : "Mesazhi",
    messagePlaceholder: lang === 'en' ? "Tell us about your dental goals..." : "Na tregoni për synimet tuaja dentare...",
    submit: lang === 'en' ? "Submit Free Request" : "Dërgo Kërkesën Falas",
    policy: lang === 'en' ? "By submitting, you agree to our Privacy Policy." : "Duke dërguar, ju pajtoheni me Politikën tonë të Privatësisë."
  };

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden scroll-mt-24">
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-50 rounded-full -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-white/10">
          {/* Info Side */}
          <div className="lg:w-2/5 bg-slate-800 p-6 sm:p-12 text-white">
            <h3 className="text-4xl font-display font-black mb-8 tracking-tight">{labels.title}</h3>
            <p className="text-slate-300 mb-12 text-lg font-medium leading-relaxed">
              {labels.desc}
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-white/10 p-3 rounded-xl">
                  <Phone className="text-blue-500" size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black mb-1">{labels.call}</p>
                  <p className="text-xl font-bold">+383 49 272 803</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-white/10 p-3 rounded-xl">
                  <Mail className="text-blue-500" size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black mb-1">WhatsApp</p>
                  <a href="https://wa.me/38349772307" target="_blank" rel="noopener" className="text-xl font-bold hover:text-blue-400 transition-colors">+383 49 772 307</a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-white/10 p-3 rounded-xl">
                  <MapPin className="text-blue-500" size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black mb-1">{labels.location}</p>
                  <p className="text-xl font-bold">{labels.prishtina}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-3/5 p-6 sm:p-12 bg-white">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Check size={48} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">{labels.successTitle}</h4>
                  <p className="text-slate-600 font-medium">{labels.successDesc}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{labels.nameLabel}</label>
                    <input required type="text" placeholder="John Doe" className="w-full bg-slate-50 border-slate-200 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{labels.phoneLabel}</label>
                    <input required type="tel" placeholder="+383 44 000 000" className="w-full bg-slate-50 border-slate-200 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lang === 'en' ? 'Urgency' : 'Urgjenca'}</label>
                    <select className="w-full bg-slate-50 border-slate-200 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none">
                      <option>{lang === 'en' ? 'As soon as possible' : 'Sa më shpejt'}</option>
                      <option>{lang === 'en' ? 'Within 1-3 months' : 'Brenda 1-3 muajsh'}</option>
                      <option>{lang === 'en' ? 'Just exploring' : 'Vetëm po eksploroj'}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lang === 'en' ? 'Preferred Contact' : 'Mënyra e Kontaktit'}</label>
                    <select className="w-full bg-slate-50 border-slate-200 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none">
                      <option>WhatsApp</option>
                      <option>Email</option>
                      <option>{lang === 'en' ? 'Phone Call' : 'Thirrje Telefonike'}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{labels.interestLabel}</label>
                  <select className="w-full bg-slate-50 border-slate-200 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none font-medium">
                    <option>{lang === 'en' ? 'Select Surgical Treatment' : 'Zgjidh Trajtimin Kirurgjikal'}</option>
                    <option>Dental Implants / Bone Grafting</option>
                    <option>All-on-4 / All-on-6 Restoration</option>
                    <option>Hollywood Smile / Veneers</option>
                    <option>Maxillofacial Consultation</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{labels.messageLabel}</label>
                  <textarea rows={4} placeholder={labels.messagePlaceholder} className="w-full bg-slate-50 border-slate-200 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"></textarea>
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full bg-blue-600 hover:bg-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-xl hover:shadow-blue-200 uppercase tracking-widest">
                    <span>{labels.submit}</span>
                    <Send size={20} />
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-6 font-bold uppercase tracking-tight">
                    {labels.policy}
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
