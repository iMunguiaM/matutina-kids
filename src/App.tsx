import React, { useState, useEffect, useCallback } from 'react';
import { 
  Compass, Map, Tent, TreePine, Mountain, 
  Sun, Waves, Flower, Bird, Users, Flame, 
  Volume2, Star, Heart, ArrowLeft, Check, 
  X, Backpack, Telescope, Sparkles, Footprints,
  Trophy, Cloud, Trees as TreeIcon, ArrowRightLeft,
  Zap, Anchor, Moon
} from 'lucide-react';

// --- SISTEMA DE VOZ LATINOAMERICANA (VOZ DE NIÑO) ---
const speakLatam = (text: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    
    const voices = window.speechSynthesis.getVoices();
    const latamVoice = voices.find(v => v.lang === 'es-MX' || v.lang === 'es-419') || 
                       voices.find(v => v.lang.includes('es'));
    
    if (latamVoice) msg.voice = latamVoice;
    msg.rate = 1.0; 
    msg.pitch = 1.6; 
    window.speechSynthesis.speak(msg);
  }
};

type MatutinaAudioType = 'titulo' | 'versiculo' | 'cita';

let currentNarrationAudio: HTMLAudioElement | null = null;

const playMatutinaAudio = (
  dayId: number,
  audioType: MatutinaAudioType,
  fallbackText: string
) => {
  window.speechSynthesis?.cancel();

  if (currentNarrationAudio) {
    currentNarrationAudio.pause();
    currentNarrationAudio.currentTime = 0;
  }

  const day = String(dayId).padStart(2, '0');
  const audioUrl = `${import.meta.env.BASE_URL}audio/dia-${day}-${audioType}.mp3`;
  const audio = new Audio(audioUrl);

  currentNarrationAudio = audio;

  audio.onerror = () => {
    speakLatam(fallbackText);
  };

  audio.play().catch(() => {
    speakLatam(fallbackText);
  });
};

// --- EFECTOS DE SONIDO ---
const playAdventureSfx = (type: 'success' | 'pop') => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  const ctx = new AudioContextClass();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === 'success') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
  } else {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
  }
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
};

// --- COMPONENTE: AVENTURERO ANIMADO ---
const AdventurerCharacter = () => (
  <div className="relative w-48 h-48 animate-bounce" style={{ animationDuration: '3s' }}>
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Cuerpo/Camisa (Uniforme Tan) */}
      <rect x="70" y="110" width="60" height="70" rx="10" fill="#D2B48C" />
      {/* Pañoleta Amarilla (Identificador de Aventurero) */}
      <path d="M70 110 L100 135 L130 110" fill="#FFD700" stroke="#B8860B" strokeWidth="2" />
      <circle cx="100" cy="135" r="5" fill="#B8860B" />
      {/* Cabeza */}
      <circle cx="100" cy="70" r="45" fill="#FFDBAC" />
      {/* Gorra */}
      <path d="M55 60 Q100 20 145 60" fill="#386641" />
      <rect x="55" y="55" width="90" height="10" rx="5" fill="#386641" />
      {/* Cara */}
      <circle cx="85" cy="75" r="4" fill="#333" />
      <circle cx="115" cy="75" r="4" fill="#333" />
      <path d="M85 90 Q100 105 115 90" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
);

// --- COMPONENTE: ILUSTRACIONES POR DÍA ---
const DayIllustration = ({ id }: { id: number }) => {
  switch (id) {
    case 1: return <div className="animate-pulse"><Sun className="w-24 h-24 text-yellow-400 fill-yellow-200" /></div>;
    case 2: return <div className="animate-bounce" style={{animationDuration: '4s'}}><Waves className="w-24 h-24 text-blue-400" /></div>;
    case 3: return <div className="flex gap-2 animate-bounce"><TreePine className="text-green-600" /><Flower className="text-pink-400" /><TreePine className="text-green-700" /></div>;
    case 4: return <div className="animate-pulse flex items-center gap-2"><Sun className="text-yellow-500"/><Star className="text-blue-300"/><Star className="text-blue-400" /></div>;
    case 5: return <div className="animate-float flex flex-col items-center"><Bird className="text-orange-400"/><Waves className="text-blue-500" /></div>;
    case 6: return <div className="animate-bounce flex gap-1"><Users className="text-red-500" /><Star className="text-yellow-400" /></div>;
    case 7: return <div className="animate-pulse"><Flame className="w-24 h-24 text-orange-600 fill-orange-300" /></div>;
    case 8: return <div className="animate-pulse"><Waves className="w-24 h-24 text-red-600" /></div>;
    case 9: return <div className="animate-bounce"><Cloud className="w-24 h-24 text-blue-300 fill-blue-100" /></div>;
    case 10: return <div className="animate-pulse flex gap-2"><Sparkles className="text-indigo-400" /><Star className="text-yellow-400" /></div>;
    case 11: return <div className="animate-float flex items-center gap-2"><Cloud className="w-16 h-16 text-gray-300" /><Flame className="w-16 h-16 text-orange-500 fill-orange-200" /></div>;
    case 12: return <div className="flex items-center justify-center gap-4 animate-pulse"><Waves className="w-16 h-16 text-blue-500 -rotate-90" /><ArrowRightLeft className="w-10 h-10 text-yellow-500" /><Waves className="w-16 h-16 text-blue-500 rotate-90" /></div>;
    case 13: return <div className="flex flex-col items-center animate-bounce"><Flower className="w-16 h-16 text-pink-400 fill-pink-100" /><div className="w-2 h-20 bg-amber-800 rounded-full"></div></div>;
    case 14: return <div className="flex items-center gap-4"><Waves className="w-16 h-16 text-blue-400" /><div className="w-4 h-24 bg-orange-400 rounded-full animate-pulse shadow-lg"></div><Waves className="w-16 h-16 text-blue-400 opacity-20" /></div>;
    case 15: return <div className="flex items-center gap-4 animate-pulse"><Sun className="w-20 h-20 text-yellow-500" /><Moon className="w-16 h-16 text-blue-300 fill-blue-50" /></div>;
    default: return <Sparkles className="w-20 h-20 text-yellow-400" />;
  }
};

const MapAmbientDecor = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute top-8 left-4 md:left-10 opacity-[0.20] animate-float-slow">
      <Sun className="w-14 h-14 md:w-20 md:h-20 text-yellow-300" />
    </div>

    <div className="absolute top-16 right-6 md:right-16 opacity-[0.35] animate-drift">
      <Cloud className="w-16 h-16 md:w-24 md:h-24 text-white" />
    </div>

    <div className="absolute top-[28%] left-[6%] opacity-[0.18] animate-float-reverse">
      <Waves className="w-12 h-12 md:w-16 md:h-16 text-blue-300" />
    </div>

    <div className="absolute top-[36%] right-[8%] opacity-[0.18] animate-float-slow">
      <TreePine className="w-12 h-12 md:w-16 md:h-16 text-green-300" />
    </div>

    <div className="absolute bottom-[24%] left-[10%] opacity-[0.18] animate-drift-reverse">
      <Bird className="w-12 h-12 md:w-16 md:h-16 text-orange-300" />
    </div>

    <div className="absolute bottom-[14%] right-[8%] opacity-[0.22] animate-float-slow">
      <Moon className="w-12 h-12 md:w-16 md:h-16 text-blue-200" />
    </div>

    <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 opacity-[0.18] animate-twinkle-soft">
      <Sparkles className="w-14 h-14 md:w-16 md:h-16 text-cyan-200" />
    </div>
  </div>
);

type MatutinaDay = {
  id: number;
  title: string;
  verse: string;
  citation: string;
  icon: React.ReactNode;
  bg: string;
  accent: string;
  story: string;
};

const MATUTINA_DATA: MatutinaDay[] = [
  {
    id: 1,
    title: "La luz",
    verse: "Ustedes son la luz de este mundo",
    citation: "Mateo 5:14",
    icon: <Sun className="w-12 h-12 text-yellow-500" />,
    bg: "bg-yellow-50",
    accent: "#FBC02D",
    story: "¡Mira! Al principio todo estaba oscuro como una cueva, pero Dios dijo '¡Luz!' y todo brilló."
  },
  {
    id: 2,
    title: "Separación de las aguas",
    verse: "El que permanece unido a mí, y yo unido a él, da mucho fruto; pues sin mí no pueden ustedes hacer nada",
    citation: "Juan 15: 5",
    icon: <Waves className="w-12 h-12 text-blue-500" />,
    bg: "bg-blue-50",
    accent: "#1976D2",
    story: "Dios hizo el cielo azul y separó las nubes de los ríos. ¡Qué aire tan rico para respirar!"
  },
  {
    id: 3,
    title: "Mar, tierra y vegetación",
    verse: "Querido hermano, pido a Dios que, así como te va bien espiritualmente, te vaya bien en todo y tengas buena salud",
    citation: "3 Juan 1: 2",
    icon: <TreePine className="w-12 h-12 text-green-600" />,
    bg: "bg-green-50",
    accent: "#388E3C",
    story: "Dios plantó árboles gigantes y flores hermosas. ¡Son los pulmones de nuestro mundo!"
  },
  {
    id: 4,
    title: "El sol, la luna y las estrellas",
    verse: "¡Alabado sea el nombre del Señor del oriente al occidente!",
    citation: "Salmos 113: 3",
    icon: <Star className="w-12 h-12 text-yellow-600" />,
    bg: "bg-indigo-50",
    accent: "#5C6BC0",
    story: "Dios creó el sol para el día y la luna con las estrellas para la noche. ¡Todo brilla!"
  },
  {
    id: 5,
    title: "Aves y animales marinos",
    verse: "¡Alaben al Señor desde la tierra, monstruos del mar, y mar profundo!",
    citation: "Salmos 148: 7",
    icon: <Bird className="w-12 h-12 text-purple-500" />,
    bg: "bg-purple-50",
    accent: "#7B1FA2",
    story: "Dios llenó el mar de ballenas y el cielo de aves. ¡Cuidemos de ellas!"
  },
  {
    id: 6,
    title: "Animales terrestres y la corona de la creación",
    verse: "Cuando Dios creó al hombre, lo creó a su imagen; varón y mujer los creó",
    citation: "Génesis 1: 27",
    icon: <Users className="w-12 h-12 text-red-500" />,
    bg: "bg-red-50",
    accent: "#D32F2F",
    story: "Dios hizo a los animales y luego a nosotros. ¡Somos su tesoro más especial!"
  },
  {
    id: 7,
    title: "La zarza que no se consumía",
    verse: "Dios le contestó: YO SOY EL QUE SOY. Y dirás a los israelitas: «YO SOY me ha enviado a ustedes»",
    citation: "Éxodo 3: 14",
    icon: <Flame className="w-12 h-12 text-orange-600" />,
    bg: "bg-orange-50",
    accent: "#E64A19",
    story: "Moisés vio una zarza ardiendo pero no se quemaba. ¡Dios tiene una misión para ti!"
  },
  {
    id: 8,
    title: "El agua se convirtió en sangre",
    verse: "Las obras del Señor son grandes, y quienes las aman, las estudian",
    citation: "Salmos 111: 2",
    icon: <Waves className="w-12 h-12 text-red-600" />,
    bg: "bg-red-50",
    accent: "#B71C1C",
    story: "Aarón golpeó el río Nilo y el agua se volvió sangre. ¡Dios es más poderoso que todo!"
  },
  {
    id: 9,
    title: "El granizo",
    verse: "¡Tuyos son, Señor, la grandeza, el poder, la gloria, el dominio y la majestad! Porque todo lo que hay en el cielo y en la tierra es tuyo",
    citation: "1 Crónicas 29: 11",
    icon: <Cloud className="w-12 h-12 text-blue-300" />,
    bg: "bg-blue-50",
    accent: "#0288D1",
    story: "Dios mostró su gran poder con una tormenta de granizo, protegiendo siempre a su pueblo."
  },
  {
    id: 10,
    title: "Las tinieblas",
    verse: "Todos ustedes son de la luz y del día. No somos de la noche ni de la oscuridad",
    citation: "1 Tesalonicenses 5: 5",
    icon: <Sparkles className="w-12 h-12 text-indigo-400" />,
    bg: "bg-indigo-50",
    accent: "#3949AB",
    story: "Aunque todo estaba oscuro, los hijos de Dios tenían luz. ¡Tú eres un niño de la luz!"
  },
  {
    id: 11,
    title: "La columna de nube y de fuego",
    verse: "El Señor los acompañaba en una columna de nube, para señalarles el camino; y de noche, en una columna de fuego, para alumbrarlos",
    citation: "Éxodo 13: 21",
    icon: <Cloud className="w-12 h-12 text-orange-500" />,
    bg: "bg-orange-50",
    accent: "#F57C00",
    story: "Dios nunca dejó solo a su pueblo en el desierto; los guiaba con una nube de día y fuego de noche."
  },
  {
    id: 12,
    title: "El mar Rojo se abre",
    verse: "No tengan miedo, manténganse firmes y fíjense en lo que el Señor va a hacer hoy para salvarlos",
    citation: "Éxodo 14: 13",
    icon: <Waves className="w-12 h-12 text-blue-600" />,
    bg: "bg-blue-50",
    accent: "#0277BD",
    story: "¡Un gran milagro! Dios abrió el mar en dos para que su pueblo cruzara en seco."
  },
  {
    id: 13,
    title: "La vara que floreció",
    verse: "Pero de ti, Dios nuestro, es propio el ser compasivo y perdonar. Nosotros nos hemos rebelado contra ti",
    citation: "Daniel 9: 9",
    icon: <Flower className="w-12 h-12 text-pink-500" />,
    bg: "bg-pink-50",
    accent: "#D81B60",
    story: "Dios hizo que la vara de Aarón diera flores para mostrar a quién había elegido. ¡Él es compasivo!"
  },
  {
    id: 14,
    title: "Las aguas se detienen",
    verse: "Confíen siempre en el Señor, porque él es refugio eterno",
    citation: "Isaías 26: 4",
    icon: <Waves className="w-12 h-12 text-blue-400" />,
    bg: "bg-blue-50",
    accent: "#0288D1",
    story: "Cuando los sacerdotes tocaron el río Jordán, ¡el agua se detuvo por completo! Dios siempre nos abre camino."
  },
  {
    id: 15,
    title: "El día que el sol se detuvo",
    verse: "El sol y la luna no salen de su escondite [...]. Has salido en ayuda de tu pueblo",
    citation: "Habacuc 3: 11, 13",
    icon: <Sun className="w-12 h-12 text-yellow-600" />,
    bg: "bg-cyan-50",
    accent: "#FFB300",
    story: "Josué oró y Dios hizo que el sol y la luna se detuvieran para ayudar a su pueblo. ¡Dios escucha nuestras oraciones!"
  }
];

const App = () => {
  const [view, setView] = useState<'welcome' | 'map' | 'study' | 'congrats'>('welcome'); 
  const [age, setAge] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState<MatutinaDay | null>(null);
  const [stars, setStars] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const handleStart = (selectedAge: string) => {
    setAge(selectedAge);
    playAdventureSfx('pop');
    setView('map');
  };

  const startLesson = (day: MatutinaDay) => {
    setCurrentDay(day);
    setCompletedSteps([]);
    setView('study');
    playAdventureSfx('pop');
  };

  const finishStep = (stepIdx: number) => {
    if (!completedSteps.includes(stepIdx)) {
      setCompletedSteps(prev => [...prev, stepIdx]);
      playAdventureSfx('success');
    }
  };

  return (
    <div className="min-h-screen bg-[#E0F7FA] font-sans text-[#263238] flex flex-col items-center select-none overflow-x-hidden">
      <style>{`
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes floatSlow {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    50% { transform: translateY(-12px) translateX(6px); }
  }

  @keyframes floatReverse {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    50% { transform: translateY(10px) translateX(-8px); }
  }

  @keyframes drift {
    0%, 100% { transform: translateX(0px); }
    50% { transform: translateX(12px); }
  }

  @keyframes driftReverse {
    0%, 100% { transform: translateX(0px); }
    50% { transform: translateX(-12px); }
  }

  @keyframes twinkleSoft {
    0%, 100% { opacity: 0.15; transform: scale(1); }
    50% { opacity: 0.35; transform: scale(1.08); }
  }

  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-float-slow { animation: floatSlow 6s ease-in-out infinite; }
  .animate-float-reverse { animation: floatReverse 7s ease-in-out infinite; }
  .animate-drift { animation: drift 8s ease-in-out infinite; }
  .animate-drift-reverse { animation: driftReverse 9s ease-in-out infinite; }
  .animate-twinkle-soft { animation: twinkleSoft 4s ease-in-out infinite; }

  .adventure-card {
    border-radius: 32px;
    box-shadow: 0 8px 0 #B2EBF2;
    transition: all 0.2s;
  }

  .adventure-card:active {
    transform: translateY(4px);
    box-shadow: 0 4px 0 #B2EBF2;
  }

  .mission-card {
    border-radius: 32px;
    box-shadow: 0 10px 0 rgba(178, 235, 242, 0.85);
    transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
  }

  .mission-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 0 rgba(178, 235, 242, 0.95);
    filter: brightness(1.01);
  }

  .mission-card:active {
    transform: translateY(3px);
    box-shadow: 0 6px 0 rgba(178, 235, 242, 0.85);
  }
`}</style>

      {/* --- PANTALLA BIENVENIDA --- */}
      {view === 'welcome' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-md w-full gap-8 relative overflow-hidden">
          {/* Fondo de Paisaje */}
          <div className="absolute bottom-0 w-full flex justify-around opacity-30 pointer-events-none">
            <Mountain className="w-48 h-48 text-[#A5D6A7]" />
            <Mountain className="w-64 h-64 text-[#81C784]" />
            <Mountain className="w-32 h-32 text-[#66BB6A]" />
          </div>
          <div className="absolute top-10 left-10"><Cloud className="text-white w-16 h-16 opacity-80" /></div>
          <div className="absolute top-24 right-10"><Cloud className="text-white w-12 h-12 opacity-60" /></div>
          
          <AdventurerCharacter />
          
          <div className="text-center space-y-2 z-10">
            <h1 className="text-4xl font-black text-[#00796B] drop-shadow-sm">CAMPAMENTO MATUTINA</h1>
            <p className="text-[#004D40] font-bold">¡Prepara tu mochila, vamos a explorar!</p>
          </div>
          
          <div className="w-full space-y-4 z-10">
            <button 
              onClick={() => handleStart('4-5')}
              className="w-full p-6 bg-[#66BB6A] text-white rounded-[40px] border-b-8 border-[#388E3C] font-black text-2xl flex items-center justify-center gap-4 hover:brightness-105 active:border-b-0 active:translate-y-2 transition-all shadow-lg"
            >
              <Telescope className="w-8 h-8" /> 4 - 5 AÑOS
            </button>
            <button 
              onClick={() => handleStart('6-9')}
              className="w-full p-6 bg-[#FFB74D] text-white rounded-[40px] border-b-8 border-[#F57C00] font-black text-2xl flex items-center justify-center gap-4 hover:brightness-105 active:border-b-0 active:translate-y-2 transition-all shadow-lg"
            >
              <Map className="w-8 h-8" /> 6 - 9 AÑOS
            </button>
          </div>
        </div>
      )}

      {/* --- CABECERA --- */}
      {view !== 'welcome' && (
        <header className={`w-full ${view === 'map' ? 'max-w-6xl' : 'max-w-md'} bg-white/80 backdrop-blur-md border-b-4 border-[#B2EBF2] p-4 flex justify-between items-center sticky top-0 z-50`}>
          <button onClick={() => setView(view === 'map' ? 'welcome' : 'map')} className="p-2 bg-[#E0F2F1] rounded-full shadow-sm text-[#00796B]">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-[#FFF9C4] px-3 py-1 rounded-full border-2 border-[#FBC02D]">
              <Star className="w-5 h-5 text-[#FBC02D] fill-[#FBC02D]" />
              <span className="font-black text-[#F57F17]">{stars}</span>
            </div>
            <Backpack className="w-8 h-8 text-[#0097A7]" />
          </div>
        </header>
      )}

      <main className={`w-full flex-1 p-6 pb-24 transition-all ${view === 'map' ? 'max-w-6xl' : 'max-w-md'}`}>
        
        {/* --- MAPA DE AVENTURA --- */}
{view === 'map' && (
  <div className="relative min-h-[70vh] py-4 md:py-8">
    <MapAmbientDecor />

    <div className="relative z-10 flex flex-col gap-6">
      <div className="bg-white/90 p-5 md:p-6 rounded-[40px] border-2 border-[#80DEEA] text-center shadow-sm w-full">
        <h2 className="text-xl md:text-2xl font-black text-[#00796B] flex items-center justify-center gap-2 uppercase tracking-tight">
          <Map className="text-[#009688]" /> Mi Gran Expedición
        </h2>
        <p className="text-sm md:text-base text-[#546E7A] font-semibold mt-2">
          Elige una misión del día y explora la creación y los milagros de Dios.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/90 rounded-[32px] border-2 border-[#B2EBF2] p-5 shadow-sm">
          <p className="text-xs font-black text-[#80DEEA] uppercase tracking-widest">Ruta</p>
          <h3 className="text-2xl font-black text-[#00796B] mt-2">15 misiones para descubrir</h3>
          <p className="text-sm text-[#546E7A] font-semibold mt-2">
            Cada día tiene un título, un versículo y una cita bíblica con audio.
          </p>
        </div>

        <div className="bg-white/90 rounded-[32px] border-2 border-[#B2EBF2] p-5 shadow-sm">
          <p className="text-xs font-black text-[#80DEEA] uppercase tracking-widest">Progreso</p>
          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-3xl font-black text-[#00796B]">{stars}</p>
              <p className="text-sm text-[#546E7A] font-bold">Estrellas ganadas</p>
            </div>
            <div className="w-16 h-16 rounded-[24px] bg-[#FFF9C4] border-2 border-[#FBC02D] flex items-center justify-center shadow-sm">
              <Trophy className="w-8 h-8 text-[#FBC02D]" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pb-28">
        {MATUTINA_DATA.map((day) => (
          <button
            key={day.id}
            onClick={() => startLesson(day)}
            className="mission-card group relative overflow-hidden bg-white/95 border-2 border-[#B2EBF2] p-5 md:p-6 text-left"
          >
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                background: `linear-gradient(135deg, ${day.accent} 0%, transparent 62%)`
              }}
            />

            <div className="absolute -right-6 -top-6 opacity-10 scale-125 pointer-events-none animate-float-slow">
              <DayIllustration id={day.id} />
            </div>

            <div className="relative flex items-start gap-4">
              <div
                className="w-20 h-20 shrink-0 bg-white rounded-[28px] border-[3px] flex items-center justify-center shadow-sm"
                style={{ borderColor: day.accent }}
              >
                {day.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center rounded-full bg-[#00796B] text-white px-4 py-1 text-xs font-black shadow-md">
                  DÍA {day.id}
                </div>

                <h3 className="mt-3 text-lg md:text-xl font-black text-[#263238] leading-tight">
                  {day.title}
                </h3>

                <p className="mt-2 text-sm text-[#546E7A] font-semibold leading-snug">
                  {day.story}
                </p>
              </div>
            </div>

            <div className="relative mt-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#009688] font-black text-sm uppercase tracking-wide">
                <Compass className="w-4 h-4" />
                Explorar
              </div>

              <div className="w-11 h-11 rounded-full bg-[#E0F7FA] flex items-center justify-center shadow-inner group-hover:translate-x-1 transition-transform">
                <Telescope className="w-5 h-5 text-[#009688]" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
)}

        {/* --- ESTUDIO / GRANDES BOTONES --- */}
        {view === 'study' && currentDay && (
          <div className="flex flex-col gap-6 animate-in zoom-in duration-300">
            {/* Ilustración de la Misión */}
            <div className="bg-white p-8 rounded-[48px] border-b-8 border-[#B2EBF2] flex flex-col items-center gap-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-[-20px] left-[-20px] opacity-10"><TreeIcon className="w-24 h-24" /></div>
              <DayIllustration id={currentDay.id} />
              <div className="text-center">
                <h2 className="text-2xl font-black text-[#00796B]">Misión de Hoy</h2>
                <p className="text-lg font-bold italic text-gray-500 mt-2">"{currentDay.story}"</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* BOTÓN TÍTULO */}
              <button 
                onClick={() => { playMatutinaAudio(currentDay.id, 'titulo', `Día ${currentDay.id}, Título: ${currentDay.title}`); finishStep(0); }}
                className={`w-full p-7 flex items-center justify-between rounded-[40px] border-b-8 transition-all active:translate-y-1 active:border-b-4 ${completedSteps.includes(0) ? 'bg-[#C8E6C9] border-[#81C784]' : 'bg-white border-[#B2EBF2]'}`}
              >
                <div className="text-left">
                  <p className="text-xs font-black text-[#80DEEA] uppercase tracking-widest">Título</p>
                  <p className="text-2xl font-black text-[#263238]">{currentDay.title}</p>
                </div>
                <div className="bg-white p-3 rounded-full shadow-inner"><Volume2 className={completedSteps.includes(0) ? 'text-[#2E7D32]' : 'text-[#80DEEA]'} /></div>
              </button>

              {/* BOTÓN VERSÍCULO */}
              <button 
                onClick={() => { playMatutinaAudio(currentDay.id, 'versiculo', `Versículo: ${currentDay.verse}`); finishStep(1); }}
                className={`w-full p-7 flex items-center justify-between rounded-[40px] border-b-8 transition-all active:translate-y-1 active:border-b-4 ${completedSteps.includes(1) ? 'bg-[#C8E6C9] border-[#81C784]' : 'bg-white border-[#B2EBF2]'}`}
              >
                <div className="text-left">
                  <p className="text-xs font-black text-[#80DEEA] uppercase tracking-widest">Versículo</p>
                  <p className="text-xl font-bold leading-tight text-[#263238]">{currentDay.verse}</p>
                </div>
                <div className="bg-white p-3 rounded-full shadow-inner"><Volume2 className={completedSteps.includes(1) ? 'text-[#2E7D32]' : 'text-[#80DEEA]'} /></div>
              </button>

              {/* BOTÓN CITA */}
              <button 
                onClick={() => { playMatutinaAudio(currentDay.id, 'cita', `Cita: ${currentDay.citation}`); finishStep(2); }}
                className={`w-full p-7 flex items-center justify-between rounded-[40px] border-b-8 transition-all active:translate-y-1 active:border-b-4 ${completedSteps.includes(2) ? 'bg-[#C8E6C9] border-[#81C784]' : 'bg-white border-[#B2EBF2]'}`}
              >
                <div className="text-left">
                  <p className="text-xs font-black text-[#80DEEA] uppercase tracking-widest">Cita Bíblica</p>
                  <p className="text-2xl font-black text-[#EF5350]">{currentDay.citation}</p>
                </div>
                <div className="bg-white p-3 rounded-full shadow-inner"><Volume2 className={completedSteps.includes(2) ? 'text-[#2E7D32]' : 'text-[#80DEEA]'} /></div>
              </button>
            </div>

            <button 
              disabled={completedSteps.length < 3}
              onClick={() => { playAdventureSfx('pop'); setView('congrats'); setStars(s => s + 25); }}
              className={`w-full py-6 rounded-[40px] font-black text-2xl border-b-8 transition-all shadow-xl ${completedSteps.length >= 3 ? 'bg-[#009688] text-white border-[#00695C] active:translate-y-2 active:border-b-0' : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'}`}
            >
              {completedSteps.length >= 3 ? '¡LISTO, EXPLORADOR! 🎒' : 'TERMINA LA MISIÓN'}
            </button>
          </div>
        )}

        {/* --- FELICIDADES --- */}
        {view === 'congrats' && (
          <div className="flex flex-col items-center justify-center py-12 gap-8 text-center animate-in bounce-in duration-1000">
            <div className="relative">
              <Tent className="w-48 h-48 text-[#009688] animate-float drop-shadow-lg" />
              <div className="absolute top-0 right-0 animate-pulse"><Sparkles className="text-yellow-400 w-12 h-12" /></div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-[#00796B]">¡MISIÓN CUMPLIDA!</h2>
              <p className="text-xl font-bold text-[#004D40]">Has ganado una nueva insignia</p>
            </div>

            <div className="bg-white p-8 rounded-[48px] border-b-8 border-[#B2EBF2] w-full flex items-center justify-around shadow-lg">
               <div className="flex flex-col items-center gap-1">
                  <Star className="text-[#FBC02D] fill-[#FBC02D] w-10 h-10" />
                  <span className="text-2xl font-black text-[#F57F17]">+25</span>
               </div>
               <div className="h-16 w-1 bg-[#B2EBF2] rounded-full"></div>
               <div className="flex flex-col items-center gap-1">
                  <Trophy className="text-[#0097A7] w-10 h-10" />
                  <span className="text-2xl font-black text-[#006064]">DÍA {currentDay?.id}</span>
               </div>
            </div>

            <button 
              onClick={() => setView('map')}
              className="w-full py-6 bg-[#66BB6A] text-white rounded-[40px] border-b-8 border-[#388E3C] font-black text-2xl active:translate-y-2 active:border-b-0 transition-all shadow-xl"
            >
              CONTINUAR RUTA ➔
            </button>
          </div>
        )}
      </main>

      {/* --- NAV INFERIOR --- */}
      {view === 'map' && (
        <footer className="w-full max-w-6xl bg-white border-t-4 border-[#B2EBF2] p-4 fixed bottom-0 z-40 flex justify-around items-center rounded-t-[48px] shadow-2xl">
          <button className="flex flex-col items-center gap-1 text-[#009688]">
            <Map className="w-8 h-8" />
            <span className="text-[10px] font-black uppercase tracking-widest">Mapa</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#80DEEA]">
            <Trophy className="w-8 h-8" />
            <span className="text-[10px] font-black uppercase tracking-widest">Insignias</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-[#80DEEA]">
            <Users className="w-8 h-8" />
            <span className="text-[10px] font-black uppercase tracking-widest">Club</span>
          </button>
        </footer>
      )}
    </div>
  );
};

export default App;
