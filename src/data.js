export const RUANG_BUDAYA_CATEGORIES = [
  'Semua Kategori',
  'Seni Rupa',
  'Seni Tari',
  'Seni Musik',
  'Seni Teater/Pertunjukan',
  'Seni Tradisional & Budaya',
  'Seni Kriya',
  'Sastra & Seni Bahasa',
  'Seni Modern & Digital',
];

// Nilai kategori yang berarti "tampilkan seluruh data" (tidak difilter)
const ALL_CATEGORY_ALIASES = ['semua', 'all', 'semua kategori', 'semua-kategori', '-', 'none'];

const normalizeCategory = (value) => String(value ?? '').trim().toLowerCase();

export const isAllCategories = (value) => {
  if (value === null || value === undefined) return true;
  const normalized = normalizeCategory(value);
  return normalized === '' || ALL_CATEGORY_ALIASES.includes(normalized);
};

export const getArtCategory = (item) =>
  normalizeCategory(item?.category ?? item?.kategori ?? '');

// Pencocokan kategori yang toleran: case-insensitive, tahan spasi berlebih,
// dan tetap menerima data yang field kategorinya kosong dari database.
export const matchesArtCategory = (item, selectedCategory) => {
  if (isAllCategories(selectedCategory)) return true;

  const selected = normalizeCategory(selectedCategory);
  const itemCategory = getArtCategory(item);

  // Item tanpa kategori tidak boleh ikut saat kategori spesifik dipilih
  if (!selected || !itemCategory) return false;

  return (
    itemCategory === selected ||
    itemCategory.includes(selected) ||
    selected.includes(itemCategory)
  );
};

export const filterArtsByCategory = (arts, selectedCategory) =>
  (Array.isArray(arts) ? arts : []).filter((item) =>
    matchesArtCategory(item, selectedCategory)
  );

export const DEFAULT_ARTS = [
  {
    id: 1,
    title: 'Angklung Sunda',
    origin: 'Jawa Barat',
    category: 'Seni Musik',
    bahan: 'Bambu Hitam / Wulung',
    nada: 'Pentatonis & Diatonis',
    image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500',
    description: 'Angklung adalah alat musik multitonal yang berkembang secara tradisional di masyarakat Sunda.',
    full_spec: 'Angklung telah diakui UNESCO sebagai Masterpiece of the Oral and Intangible Heritage of Humanity pada tahun 2010.',
  },
  {
    id: 2,
    title: 'Gamelan Jawa',
    origin: 'Jawa Tengah',
    category: 'Seni Musik',
    bahan: 'Perunggu & Kayu Ukir',
    nada: 'Slendro & Pelog',
    image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500',
    description: 'Ensembel musik tradisional Jawa yang terdiri dari saron, demung, bonang, kendang, dan gong besar.',
    full_spec: 'Gamelan memadukan tangga nada pentatonis Slendro dan Pelog.',
  },
  {
    id: 3,
    title: 'Tari Saman',
    origin: 'Aceh',
    category: 'Seni Tari',
    bahan: 'Kostum Tenun Gayo',
    nada: 'Irama Tepukan Dada & Tangan',
    image_url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=500',
    description: 'Tarian khas suku Gayo yang mengutamakan kekompakan gerakan tangan, dada, dan irama nyanyian.',
    full_spec: 'Tari Saman ditarikan oleh puluhan penari pria atau wanita secara berjajar.',
  },
];

/* ==========================================
   BANK SOAL KUIS INTERAKTIF
   ========================================== */
export const QUIZ_DIFFICULTIES = ['Tingkat Dasar', 'Tingkat Menengah', 'Tingkat Lanjutan'];

export const DEFAULT_QUIZ_QUESTIONS = [
  {
    id: 'dummy-1',
    question: 'Alat musik tradisional dari Jawa Barat yang terbuat dari bambu dan dimainkan dengan cara digoyangkan adalah...',
    option_a: 'Angklung',
    option_b: 'Sasando',
    option_c: 'Kolintang',
    option_d: 'Tifa',
    correct_answer: 'a',
    difficulty: 'Tingkat Dasar',
  },
  {
    id: 'dummy-2',
    question: 'Alat musik petik Sasando berasal dari daerah...',
    option_a: 'Nusa Tenggara Timur',
    option_b: 'Sumatera Barat',
    option_c: 'Kalimantan Selatan',
    option_d: 'Sulawesi Utara',
    correct_answer: 'a',
    difficulty: 'Tingkat Dasar',
  },
  {
    id: 'dummy-3',
    question: 'Gamelan Jawa umumnya menggunakan dua tangga nada, yaitu...',
    option_a: 'Mayor dan Minor',
    option_b: 'Slendro dan Pelog',
    option_c: 'Diatonis dan Kromatis',
    option_d: 'Pentatonis dan Heksatonis',
    correct_answer: 'b',
    difficulty: 'Tingkat Dasar',
  },
  {
    id: 'dummy-4',
    question: 'Tari Saman yang mengutamakan kekompakan gerakan berasal dari provinsi...',
    option_a: 'Aceh',
    option_b: 'Riau',
    option_c: 'Bali',
    option_d: 'Papua',
    correct_answer: 'a',
    difficulty: 'Tingkat Dasar',
  },
  {
    id: 'dummy-5',
    question: 'Kain batik Indonesia telah diakui oleh UNESCO sebagai warisan budaya. Batik termasuk karya seni...',
    option_a: 'Seni Rupa',
    option_b: 'Seni Musik',
    option_c: 'Seni Tari',
    option_d: 'Seni Teater',
    correct_answer: 'a',
    difficulty: 'Tingkat Dasar',
  },
  {
    id: 'dummy-6',
    question: 'Alat musik Tifa merupakan alat musik tradisional yang berasal dari...',
    option_a: 'Papua',
    option_b: 'Jawa Tengah',
    option_c: 'Sumatera Utara',
    option_d: 'Bali',
    correct_answer: 'a',
    difficulty: 'Tingkat Dasar',
  },
  {
    id: 'dummy-7',
    question: 'Reog Ponorogo merupakan kesenian tradisional yang berasal dari provinsi...',
    option_a: 'Jawa Timur',
    option_b: 'Jawa Barat',
    option_c: 'Jawa Tengah',
    option_d: 'Banten',
    correct_answer: 'a',
    difficulty: 'Tingkat Dasar',
  },
  {
    id: 'dummy-8',
    question: 'Alat musik Kolintang yang terbuat dari kayu dan dipukul berasal dari daerah...',
    option_a: 'Sulawesi Utara',
    option_b: 'Nusa Tenggara Barat',
    option_c: 'Maluku',
    option_d: 'Aceh',
    correct_answer: 'a',
    difficulty: 'Tingkat Dasar',
  },
  {
    id: 'dummy-9',
    question: 'Tari Kecak dengan ciri khas suara "cak-cak-cak" berasal dari provinsi...',
    option_a: 'Bali',
    option_b: 'Jawa Timur',
    option_c: 'Lampung',
    option_d: 'Nusa Tenggara Timur',
    correct_answer: 'a',
    difficulty: 'Tingkat Menengah',
  },
  {
    id: 'dummy-10',
    question: 'Angklung diakui UNESCO sebagai Masterpiece of the Oral and Intangible Heritage of Humanity pada tahun...',
    option_a: '1995',
    option_b: '2005',
    option_c: '2010',
    option_d: '2015',
    correct_answer: 'c',
    difficulty: 'Tingkat Menengah',
  },
];

const QUIZ_OPTION_LETTERS = ['a', 'b', 'c', 'd'];

export const getQuestionDifficulty = (question) =>
  question?.difficulty ||
  question?.tingkat ||
  question?.category ||
  question?.kategori ||
  'Tingkat Dasar';

export const normalizeQuestionAnswer = (value) => {
  const raw = String(value ?? '').trim().toLowerCase();
  if (QUIZ_OPTION_LETTERS.includes(raw)) return raw;

  const asIndex = Number(raw);
  if (Number.isInteger(asIndex) && asIndex >= 0 && asIndex <= 3) {
    return QUIZ_OPTION_LETTERS[asIndex];
  }

  return 'a';
};

// Menyeragamkan bentuk data soal dari Supabase/Dummy agar aman dibaca komponen.
export const normalizeQuizQuestion = (question, index = 0) => ({
  id: question?.id ?? `q-${index}`,
  question: question?.question || question?.pertanyaan || '',
  option_a: question?.option_a || question?.opsi_a || question?.opsiA || '',
  option_b: question?.option_b || question?.opsi_b || question?.opsiB || '',
  option_c: question?.option_c || question?.opsi_c || question?.opsiC || '',
  option_d: question?.option_d || question?.opsi_d || question?.opsiD || '',
  correct_answer: normalizeQuestionAnswer(
    question?.correct_answer ?? question?.kunci ?? question?.answer
  ),
  difficulty: getQuestionDifficulty(question),
});

// Mengelompokkan soal berdasarkan tingkat kesulitan agar tiap tingkat menjadi satu kartu kuis.
export const groupQuestionsByDifficulty = (questions) => {
  const map = new Map();

  (Array.isArray(questions) ? questions : []).forEach((question) => {
    const difficulty = getQuestionDifficulty(question);
    if (!map.has(difficulty)) map.set(difficulty, []);
    map.get(difficulty).push(question);
  });

  const orderOf = (value) => {
    const index = QUIZ_DIFFICULTIES.indexOf(value);
    return index === -1 ? QUIZ_DIFFICULTIES.length : index;
  };

  return Array.from(map.entries())
    .map(([difficulty, items]) => ({ difficulty, items }))
    .sort((a, b) => orderOf(a.difficulty) - orderOf(b.difficulty));
};

export const QUIZ_DIFFICULTY_DESCRIPTIONS = {
  'Tingkat Dasar': 'Uji wawasan dasar kamu seputar kesenian dan kebudayaan Nusantara.',
  'Tingkat Menengah': 'Tantang pengetahuanmu dengan soal kebudayaan tingkat menengah.',
  'Tingkat Lanjutan': 'Soal lanjutan untuk menguji pemahaman mendalam budaya Nusantara.',
};