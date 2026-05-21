import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Gift, Heart, Menu, X, CalendarClock, MessageSquare, Send } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Pagination, FreeMode, Navigation, Thumbs } from 'swiper/modules';

import HeroImage from './assets/hero.webp';
import lalaImage from './assets/lala.webp';
import boaImage from './assets/boa.webp';
import mangImage from './assets/mang.webp';
import albumImage1 from './assets/album1.webp';
import albumImage2 from './assets/album2.webp';
import albumImage3 from './assets/album3.webp';
import albumImage4 from './assets/album4.webp';
import albumImage5 from './assets/album5.webp';
import albumImage8 from './assets/album8.webp';
import albumImage9 from './assets/album9.webp';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import MusicPlayer from './components/MusicPlayer';

const myAlbum = [albumImage1, albumImage2, albumImage3, albumImage4, albumImage5, albumImage8, albumImage9, HeroImage, boaImage, mangImage];

const participants = [
  {
    name: "Ni Putu Laksmi Nirmala Dewi, S.Kom",
    relation: "Putri Pertama dari pasangan I Nyoman Sunartika Umardana, S.H. dan Ni Wayan Suryani, S.E.",
    image: lalaImage, 
  },
  {
    name: "I GD. Made Bagus Pradnyana Wibawa",
    relation: "Putra Kedua dari pasangan I Nyoman Sunartika Umardana, S.H. dan Ni Wayan Suryani, S.E.",
    image: boaImage, 
  },
  {
    name: "I Gd Nyoman Bagus Pranata Kusuma",
    relation: "Putra Ketiga dari pasangan I Nyoman Sunartika Umardana, S.H. dan Ni Wayan Suryani, S.E.",
    image: mangImage, 
  }
];

const App = () => {
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [timeLeft, setTimeLeft] = useState({ hari: 0, jam: 0, menit: 0, detik: 0 });
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishes = async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setWishes(data);
      }
    } catch (err) {
      console.error("Gagal mengambil ucapan:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message) return;

    const payload = { name, text: message };

    // Optimistic Update (Tampilkan di UI terlebih dahulu agar terasa instan)
    const temporaryWish = { ...payload, createdAt: new Date(), _id: Date.now().toString() };
    setWishes((prev) => [temporaryWish, ...prev]);

    // Reset Form
    setName('');
    setMessage('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Jika gagal di server, ambil ulang data asli untuk sinkronisasi kembali
        fetchWishes();
      }
    } catch (err) {
      console.error("Gagal mengirim ucapan:", err);
      fetchWishes();
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('to');
    if (name) setGuestName(decodeURIComponent(name));

    const target = new Date("2026-06-06T11:00:00"); 
    const timer = setInterval(() => {
      const now = new Date();
      const diff = target - now;
      fetchWishes();
      setTimeLeft({
        hari: Math.floor(diff / (1000 * 60 * 60 * 24)),
        jam: Math.floor((diff / (1000 * 60 * 60)) % 24),
        menit: Math.floor((diff / 1000 / 60) % 60),
        detik: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper untuk memformat waktu agar lebih rapi di HP
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleOpenInvitation = () => {
    setIsOpened(true); // Membuka status undangan
    
    // Memulai musik setelah interaksi pengguna
    if (audioRef.current) {
      audioRef.current.play(); //
      setIsPlaying(true); //
    }
  
    // Scroll otomatis ke section berikutnya
    const nextSection = document.getElementById('pendahuluan');
    if (nextSection) {
      setTimeout(() => {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      ;
    }
  };

  return (
    <div className={`bg-stone-50 text-stone-900 selection:bg-amber-200 ${isOpened ? "overflow-auto" : "overflow-hidden h-screen"}`}>
      {/* HERO SECTION - Mobile Optimized Height */}
      <section className={`relative min-h-svh flex flex-col items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 z-0">
          <img 
            src={HeroImage} 
            className="w-full h-full object-cover scale-110 motion-safe:animate-[pulse_10s_infinite]"
            alt="Bali Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-stone-50" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 px-6 mt-15 text-center text-white"
        >
          <span className="block tracking-[0.4em] text-xs uppercase mb-4 opacity-80">Om Swastyastu</span>
          <h2 className="text-sm tracking-widest uppercase mb-2">Undangan Upacara</h2>
          <h1 className="font-cursive text-7xl md:text-9xl text-amber-400 drop-shadow-lg mb-8">Mepandes</h1>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 mt-15 rounded-2xl shadow-2xl">
            <p className="text-xs uppercase tracking-tighter mb-2 opacity-90">Keluarga Besar Kami Mengundang:</p>
            <h3 className="text-xl font-bold tracking-tight border-t border-white/20 pt-3">{guestName}</h3>
          </div>
        
        </motion.div>
        <motion.button
          onClick={handleOpenInvitation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`mt-10 px-6 py-3 bg-amber-500 text-white text-xs rounded-full font-bold shadow-lg z-20 ${isOpened ? 'hidden' : 'inline-block'}`}
        >
          Buka Undangan
        </motion.button>
      </section>

      {/* PENDAHULUAN - Mobile Typography */}
      <section className="relative py-20 px-8 min-h-svh max-w-2xl mx-auto text-center overflow-hidden bg-stone-50" id='pendahuluan'>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 0.65 }} // Opacity rendah agar terlihat elegan/samar
          viewport={{ once: true }}
          className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 pointer-events-none"
        >
          <img 
            src="/ornamen.png" 
            alt="Ornament Left" 
            className="w-full h-full object-contain rotate-180 shadow-stone-200" 
          />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 0.65 }}
          viewport={{ once: true }}
          className="absolute bottom-5 right-0 w-32 h-32 md:w-48 md:h-48 pointer-events-none z-50"
        >
          <img 
            src="/ornamen.png" 
            alt="Ornament Right" 
            className="w-full h-full object-contain" 
          />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Heart className="mx-auto text-amber-600 mb-5 w-7 h-7" />
          <h3 className="font-cursive text-4xl text-stone-800 mb-6 italic">Om Swastyastu</h3>
          <p className="text-sm leading-relaxed italic text-stone-600">
            "Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa, kami bermaksud mengundang Bapak/Ibu/Saudara/i pada upacara potong gigi (Mepandes) putra-putri kami."
          </p> <br /> <br />
          <p className="text-sm leading-relaxed italic text-stone-600">
            Seseorang yang mampu mengendalikan indranya dan melaksanakan kewajiban dengan tulus adalah pribadi yang utama.
          </p>
          <h3 className="text-center font-cursive ml-[-10px] text-xl text-stone-800 mb-10 italic">Bhagavad Gita 3.7</h3>
        </motion.div>
        {/* GRADASI DI AKHIR SECTION */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-b from-transparent to-amber-50 pointer-events-none" />
      </section>

      {/* SECTION PROFIL PESERTA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-cursive text-5xl text-stone-800 mb-4"
          >
            Sang Sangaskara
          </motion.h3>
          <p className="text-sm text-stone-500 mb-12 uppercase tracking-[0.2em]">Peserta Mepandes</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {participants.map((person, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group mb-2"
              >
                {/* Frame Foto dengan Ornamen Ringan */}
                <div className="relative mb-4 inline-block">
                  <div className="absolute inset-0 border-2 border-amber-200 translate-x-2 translate-y-2 rounded-2xl -z-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                  <img 
                    src={person.image} 
                    alt={person.name}
                    className="w-64 h-80 object-cover rounded-2xl shadow-md border-4 border-white transition-all duration-500"
                  />
                </div>
                
                {/* Nama & Relasi */}
                <h4 className="text-xl font-bold text-stone-800">{person.name}</h4>
                <p className="text-amber-600 text-sm italic font-serif">{person.relation}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 pb-20 bg-stone-100 px-4">
        <h3 className="text-center font-cursive text-5xl text-stone-800 mb-10">Galeri Foto</h3>
        
        <div className="max-w-md mx-auto">
          {/* Main Swiper (Foto Besar) */}
          <Swiper
            style={{
              '--swiper-navigation-color': '#fff',
              '--swiper-pagination-color': '#fff',
            }}
            loop={true}
            spaceBetween={10}
            navigation={true}
            autoplay={{ delay: 3000 }}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            modules={[FreeMode, Navigation, Thumbs, Autoplay]}
            className="rounded-3xl shadow-2xl mb-4 h-[450px]"
          >
            {myAlbum.map((img, index) => (
              <SwiperSlide key={index}>
                <img src={img} className="w-full h-full object-cover" alt={`Gallery ${index}`} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnail Swiper (Kumpulan Foto Kecil di Bawah) */}
          <Swiper
            onSwiper={setThumbsSwiper}
            loop={true}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="thumbs-slider"
          >
            {myAlbum.map((img, index) => (
              <SwiperSlide key={index} className="cursor-pointer">
                <div className="opacity-40 [.swiper-slide-thumb-active_&]:opacity-100 transition-opacity">
                  <img 
                    src={img} 
                    className="w-full h-20 object-cover rounded-xl border-2 border-transparent [.swiper-slide-thumb-active_&]:border-amber-500" 
                    alt={`Thumb ${index}`} 
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .thumbs-slider .swiper-slide {
            width: 25%;
            height: 100%;
          }
          .swiper-button-next, .swiper-button-prev {
            scale: 0.7;
            color: white !important;
          }
        `}} />
      </section>

      {/* LOKASI - Full Width on Mobile */}
      <section className="py-20 px-6 bg-stone-100 text-stone-800">
        <div className="text-center mb-10">
          <MapPin size={28} className="mx-auto text-amber-600 mb-4" />
          <h3 className="font-cursive text-5xl text-black mb-4">Lokasi Acara</h3>
          <p className="text-sm opacity-80 px-6">Gang Rama, Br. Dinas Kutuh Kelod, Desa Samsam, Kec. Kerambitan, Tabanan, Bali</p>
        </div>
        
        <div className="rounded-3xl overflow-hidden h-72 border-2 border-white/10 mb-8">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d33852.84078476791!2d115.12486774205544!3d-8.52700707601751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zOMKwMzEnMzMuNyJTIDExNcKwMDYnNDQuNyJF!5e0!3m2!1sid!2sid!4v1777732476503!5m2!1sid!2sid" 
            className="w-full h-full grayscale invert opacity-80"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>

        <motion.a 
          whileTap={{ scale: 0.95 }}
          href="https://maps.app.goo.gl/Ah6i8rReWnsrzALC8"
          className="block w-full py-4 bg-amber-500 text-stone-900 font-bold rounded-2xl text-center shadow-lg"
          target="_blank"
        >
          Buka Petunjuk Jalan
        </motion.a>
      </section>

      {/* WAKTU & COUNTDOWN - Single Row Layout */}
      <section className="px-4 py-20 bg-amber-50">
        <div className="max-w-md mx-auto">
        <CalendarClock size={36} className="mx-auto text-amber-400 mb-2" />
        <h3 className="text-center font-cursive ml-[-10px] text-5xl text-stone-800 mb-10 italic">Tanggal Acara</h3>
          {/* Countdown Row */}
          <div className="flex justify-between gap-2 mb-12">
            {Object.entries(timeLeft).map(([label, value]) => (
              <div 
                key={label} 
                className="flex-1 bg-white py-3 px-1 rounded-xl shadow-sm border border-amber-100 text-center min-w-[65px]"
              >
                <span className="text-2xl font-bold text-amber-800 block leading-none mb-1">
                  {value}
                </span>
                <span className="text-[9px] uppercase tracking-tighter text-amber-600 font-bold">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Detail Acara Row */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-stone-200">
              <div className="bg-amber-100 p-2.5 rounded-full text-amber-700 shrink-0">
                <Calendar size={18} />
              </div>
              <div className="text-left">
                <p className="font-bold text-stone-800 text-sm md:text-base text-nowrap">Sabtu, 06 Juni 2026</p>
                <p className="text-[11px] text-stone-500 uppercase tracking-wider">Tanggal Acara</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-stone-200">
              <div className="bg-amber-100 p-2.5 rounded-full text-amber-700 shrink-0">
                <Clock size={18} />
              </div>
              <div className="text-left">
                <p className="font-bold text-stone-800 text-sm md:text-base text-nowrap">11:00 WITA - Selesai</p>
                <p className="text-[11px] text-stone-500 uppercase tracking-wider">Waktu Pelaksanaan</p>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Section ucapan dan buku tamu */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <MessageSquare className="mx-auto text-amber-600 mb-4" size={32} />
            <h3 className="font-cursive text-5xl text-stone-800 mb-4">Buku Tamu</h3>
            <p className="text-xs text-stone-500 uppercase tracking-widest">Berikan Doa Restu Anda</p>
          </div>

          {/* Form Input */}
          <form onSubmit={handleSubmit} className="bg-stone-50 p-6 rounded-3xl border border-stone-200 mb-8 shadow-sm">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Tulis ucapan & doa restu..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-amber-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-amber-700 active:scale-95 transition-all"
            >
              <Send size={16} />
              Kirim Ucapan
            </button>
          </form>

          {/* List Ucapan */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <p className="text-center text-xs text-stone-400 py-4">Memuat doa restu...</p>
            ) : wishes.length === 0 ? (
              <p className="text-center text-xs text-stone-400 py-4">Belum ada ucapan. Jadilah yang pertama!</p>
            ) : (
              wishes.map((wish) => (
                <motion.div 
                  key={wish._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-stone-50 p-4 rounded-2xl border border-stone-100 shadow-sm text-left"
                >
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-stone-800 text-sm uppercase tracking-wide">{wish.name}</h4>
                    <span className="text-[10px] text-stone-400">{formatDate(wish.createdAt)}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed font-serif italic">
                    "{wish.text}"
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Styling Scrollbar Kecil untuk Mobile */}
        <style dangerouslySetInnerHTML={{ __html: `
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #f5f5f4; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 10px; }
        `}} />
      </section>

      {/* SECTION PENUTUP */}
      <section className="py-20 px-8 bg-white relative overflow-hidden">
        {/* Ornamen Pemanis (Opsional) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-10 w-64 h-64 bg-amber-200 rounded-full blur-3xl" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto text-center relative z-10"
        >
          <Heart className="mx-auto text-amber-500 mb-6 animate-pulse" size={28} />
          
          <h3 className="font-cursive text-5xl text-stone-800 mb-6">Matur Suksma</h3>
          
          <div className="space-y-4 text-stone-600 text-sm leading-relaxed mb-10">
            <p>
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada putra-putri kami.
            </p>
            <p>
              Atas kehadiran dan doa restunya, kami sekeluarga mengucapkan banyak terima kasih.
            </p>
          </div>

          {/* Penutup Salam */}
          <div className="py-8 border-t border-stone-100">
            <p className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-2">Salam Hangat Kami,</p>
            <h4 className="font-bold text-lg text-stone-800 uppercase tracking-widest leading-tight">
              Lala's Family
            </h4>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-stone-400 italic font-serif text-sm"
          >
            Om Shanti, Shanti, Shanti Om
          </motion.p>
        </motion.div>
      </section>

      <MusicPlayer 
        isPlaying={isPlaying} 
        setIsPlaying={setIsPlaying} 
        audioRef={audioRef}
        isOpened={isOpened}
      />
    </div>
  );
};

export default App;