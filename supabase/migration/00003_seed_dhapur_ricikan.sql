-- =========================================================================
-- RUMAH PUSAKA BANYUMAS - SEED DATA MASTER RICIKAN & DHAPUR
-- Source of Truth: Materi Website RPB.pdf
-- Database: Supabase PostgreSQL
-- =========================================================================

-- 1. INSERT MASTER RICIKAN (23 BAGIAN UTAMA DARI PDF)
INSERT INTO public.ricikan (name, slug, description) VALUES
  ('Ada-ada', 'ada-ada', 'Peninggian berbentuk tulang di tengah-tengah bilah keris.'),
  ('Kruwingan', 'kruwingan', 'Lekukan memanjang di samping kiri dan kanan ada-ada.'),
  ('Lis-lisan', 'lis-lisan', 'List tipis atau garis pinggir pada bilah keris.'),
  ('Gusen', 'gusen', 'Dataran sempit di tepi kruwingan.'),
  ('Landep', 'landep', 'Bagian tajam pada tepi bilah keris.'),
  ('Pudhak Sategal', 'pudhak-sategal', 'Ricikan berbentuk lipatan atau tonjolan dekat pangkal bilah.'),
  ('Sogokan depan', 'sogokan-depan', 'Alur lekukan di bagian depan pangkal bilah.'),
  ('Sogokan belakang', 'sogokan-belakang', 'Alur lekukan di bagian belakang pangkal bilah.'),
  ('Janur', 'janur', 'Bentuk garis memanjang seperti daun kelapa muda.'),
  ('Tikel alis', 'tikel-alis', 'Lekukan melengkung seperti alis di atas pejetan.'),
  ('Jenggot', 'jenggot', 'Duri-duri halus di dekat kembang kacang.'),
  ('Kembang kacang', 'kembang-kacang', 'Ricikan melengkung menyerupai tunas kembang kacang pada gandhik.'),
  ('Jalen', 'jalen', 'Tonjolan kecil di bawah kembang kacang.'),
  ('Lambe gajah', 'lambe-gajah', 'Tonjolan tajam menyerupai bibir gajah di bawah kembang kacang.'),
  ('Pejetan', 'pejetan', 'Cekungan seperti bekas tekanan ibu jari pada pangkal bilah.'),
  ('Bungkul', 'bungkul', 'Bentuk tonjolan bulat pada sor-soran.'),
  ('Ganja', 'ganja', 'Bagian alas bilah keris yang menempel pada pesi.'),
  ('Pesi', 'pesi', 'Tangkai besi di bagian bawah keris yang masuk ke hulu/gaman.'),
  ('Greneng', 'greneng', 'Gerigi berbentuk huruf Jawa Dha atau Ron Dha di wadidang/ganja.'),
  ('Ron dha Nunut', 'ron-dha-nunut', 'Variasi bentuk greneng yang menumpang pada ganja.'),
  ('Sraweyan', 'sraweyan', 'Dataran melandai di belakang sogokan menuju wadidang.'),
  ('Wadidang', 'wadidang', 'Bagian belakang pangkal bilah keris di atas ganja.')
ON CONFLICT (name) DO NOTHING;


-- 2. INSERT DHAPUR KERIS LURUS (63 DHAPUR)
WITH cat AS (SELECT id FROM public.categories WHERE slug = 'keris'),
     typ AS (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'lurus')
INSERT INTO public.dhapurs (category_id, type_id, luk, name, slug) VALUES
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Bethok', 'bethok'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Brojol', 'brojol'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Tilam Upih', 'tilam-upih'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Jalak', 'jalak'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Panji Nom', 'panji-nom'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Jaka Upa', 'jaka-upa'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Semar Betak', 'semar-betak'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Regol', 'regol'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Karna Tinanding', 'karna-tinanding'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Kebo Teki', 'kebo-teki'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Kebo Lajer', 'kebo-lajer'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Jalak nguwuh', 'jalak-nguwuh'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Sempaner', 'sempaner'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Jamang Murub', 'jamang-murub'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Tumenggung', 'tumenggung'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Patrem', 'patrem'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Sinom Worawari', 'sinom-worawari'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Condong Campur', 'condong-campur'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Kalamisani', 'kalamisani'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Pasupati', 'pasupati'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Jalak Dinding', 'jalak-dinding'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Jalak Sumelang Gandring', 'jalak-sumelang-gandring'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Jalak Ngucup Madu', 'jalak-ngucup-madu'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Jalak Sangu Tumpeng', 'jalak-sangu-tumpeng'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Jalak Ngore', 'jalak-ngore'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Mundarang', 'mundarang'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Yuyurumpung', 'yuyurumpung'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Mesem', 'mesem'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Semar Tinandu', 'semar-tinandu'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Ron Teki', 'ron-teki'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Dungkul', 'dungkul'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Kelap Lintah', 'kelap-lintah'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Sujen Ampel', 'sujen-ampel'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Lar Ngantap', 'lar-ngantap'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Mayat', 'mayat-lurus'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Kanda Basuki', 'kanda-basuki'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Putut dan Putut Kembar', 'putut-dan-putut-kembar'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Mangkurat', 'mangkurat'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Sinom', 'sinom'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Kala Munyeng', 'kala-munyeng'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Pinarak', 'pinarak'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Tilam Sari', 'tilam-sari'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Jalak Tilam Sari', 'jalak-tilam-sari'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Wora-wari', 'wora-wari'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Marak', 'marak'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Damar Murub', 'damar-murub'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Jaka Lola', 'jaka-lola'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Sepang', 'sepang'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Cundrik', 'cundrik'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Cengkrong', 'cengkrong'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Naga Tapa/Naga Pasa', 'naga-tapa-naga-pasa'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Jalak Ngoceh', 'jalak-ngoceh'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Kala Nadah', 'kala-nadah-lurus'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Balebang', 'balebang-lurus'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Pedak Sategal', 'pedak-sategal'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Kala Dite', 'kala-dite'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Pandan Sarawa', 'pandan-sarawa'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Jalak Barong', 'jalak-barong'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Bango Dolog Leres', 'bango-dolog-leres'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Singa Barong Leres', 'singa-barong-leres'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Kikik', 'kikik-lurus'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Mahesa Kantong', 'mahesa-kantong'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Maraseba', 'maraseba');


-- 3. INSERT DHAPUR KERIS LUK (LUK 3 SAMPAI LUK 29)
WITH cat AS (SELECT id FROM public.categories WHERE slug = 'keris'),
     typ AS (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'luk')
INSERT INTO public.dhapurs (category_id, type_id, luk, name, slug) VALUES
  -- Luk 3
  ((SELECT id FROM cat), (SELECT id FROM typ), 3, 'Jangkung Pacar', 'jangkung-pacar'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 3, 'Jangkung Mangkurat', 'jangkung-mangkurat'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 3, 'Mahesa Nempuh', 'mahesa-nempuh'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 3, 'Mahesa Soka', 'mahesa-soka'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 3, 'Segara Winotan', 'segara-winotan'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 3, 'Jangkung', 'jangkung'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 3, 'Campur Bawur', 'campur-bawur'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 3, 'Tebu Sauyun', 'tebu-sauyun'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 3, 'Bango Dolog', 'bango-dolog'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 3, 'Lar Monga', 'lar-monga'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 3, 'Pudak Sategal Luk 3', 'pudak-sategal-luk-3'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 3, 'Singa Barong Luk 3', 'singa-barong-luk-3'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 3, 'Kikik / Gana Kikik Luk 3', 'kikik-gana-kikik-luk-3'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 3, 'Mayat', 'mayat-luk-3'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 3, 'Wuwung', 'wuwung'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 3, 'Mahesa Nabrang', 'mahesa-nabrang-luk-3'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 3, 'Anggrek Sumelang Gandring', 'anggrek-sumelang-gandring'),

  -- Luk 5
  ((SELECT id FROM cat), (SELECT id FROM typ), 5, 'Pandawa', 'pandawa'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 5, 'Pandawa Cinarita', 'pandawa-cinarita'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 5, 'Pulanggeni', 'pulanggeni'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 5, 'Anoman', 'anoman'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 5, 'Kebo Dengen', 'kebo-dengen'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 5, 'Pandawa Lare', 'pandawa-lare'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 5, 'Pundak sategal Luk 5', 'pundak-sategal-luk-5'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 5, 'Urap-Urap', 'urap-urap'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 5, 'Nagasalira', 'nagasalira'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 5, 'Naga Siluman', 'naga-siluman-luk-5'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 5, 'Bakung', 'bakung'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 5, 'Rara Siduwa / Rara Sidupa', 'rara-siduwa-rara-sidupa'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 5, 'Gana Kikik Luk 5', 'gana-kikik-luk-5'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 5, 'Kala Nadah Luk 5', 'kala-nadah-luk-5'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 5, 'Singa Barong Luk 5', 'singa-barong-luk-5'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 5, 'Pandawa Ulap', 'pandawa-ulap'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 5, 'Pnadawa Pudak Sategal', 'pnadawa-pudak-sategal'),

  -- Luk 7
  ((SELECT id FROM cat), (SELECT id FROM typ), 7, 'Carubuk', 'carubuk'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 7, 'Sempana Bungkem', 'sempana-bungkem'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 7, 'Balebang Luk 7', 'balebang-luk-7'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 7, 'Murna Malela', 'murna-malela'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 7, 'Naga Keras', 'naga-keras'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 7, 'Sempana Panjul', 'sempana-panjul'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 7, 'Jaran Guyang', 'jaran-guyang'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 7, 'Singa Barong Luk 7', 'singa-barong-luk-7'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 7, 'Megantara', 'megantara'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 7, 'Carita Kasapta', 'carita-kasapta'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 7, 'Naga Kikik Luk 7', 'naga-kikik-luk-7'),

  -- Luk 9
  ((SELECT id FROM cat), (SELECT id FROM typ), 9, 'Sempana', 'sempana'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 9, 'Kidang Soka', 'kidang-soka'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 9, 'Carang Soka', 'carang-soka'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 9, 'Kidang Mas', 'kidang-mas'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 9, 'Panji Sekar', 'panji-sekar'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 9, 'Jurudeh', 'jurudeh'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 9, 'Paniwen', 'paniwen'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 9, 'Panimbal', 'panimbal'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 9, 'Sempana Kalentang', 'sempana-kalentang'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 9, 'Jaruman', 'jaruman'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 9, 'Sabuk Tampar', 'sabuk-tampar'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 9, 'Singa Barong Luk 9', 'singa-barong-luk-9'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 9, 'Buta Ijo', 'buta-ijo'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 9, 'Carita Kanawa Luk 9', 'carita-kanawa-luk-9'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 9, 'Kidang Milar', 'kidang-milar'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 9, 'Klika Benda', 'klika-benda'),

  -- Luk 11
  ((SELECT id FROM cat), (SELECT id FROM typ), 11, 'Carita', 'carita'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 11, 'Carita Daleman', 'carita-daleman'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 11, 'Carita Keprabon', 'carita-keprabon'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 11, 'Carita Bungkem', 'carita-bungkem'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 11, 'Carita Gandu', 'carita-gandu'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 11, 'Carita Prasaja', 'carita-prasaja'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 11, 'Carita Genengan', 'carita-genengan'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 11, 'Sabuk Tali', 'sabuk-tali'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 11, 'Jaka Wuru', 'jaka-wuru'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 11, 'Balebang Luk 11', 'balebang-luk-11'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 11, 'Sempana Luk 11', 'sempana-luk-11'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 11, 'Santan', 'santan'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 11, 'Singa Barong Luk 11', 'singa-barong-luk-11'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 11, 'Naga Siluman Luk 11', 'naga-siluman-luk-11'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 11, 'Sabuk Inten', 'sabuk-inten'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 11, 'Jaka Rumeksa', 'jaka-rumeksa'),

  -- Luk 13
  ((SELECT id FROM cat), (SELECT id FROM typ), 13, 'Sengkelat', 'sengkelat'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 13, 'Parung Sari', 'parung-sari'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 13, 'Caluring', 'caluring'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 13, 'Johan Mangan Kala', 'johan-mangan-kala'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 13, 'Kuantar', 'kuantar'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 13, 'Sepokal', 'sepokal'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 13, 'Lo Gandu / Long Gandu', 'lo-gandu-long-gandu'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 13, 'Naga Sasra', 'naga-sasra'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 13, 'Singa Barong Luk 13', 'singa-barong-luk-13'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 13, 'Carita Luk 13', 'carita-luk-13'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 13, 'Naga Siluman Luk 13', 'naga-siluman-luk-13'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 13, 'Mangkunegoro', 'mangkunegoro'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 13, 'Bima Kurda Luk 13', 'bima-kurda-luk-13'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 13, 'Karawelang Luk 13', 'karawelang-luk-13'),

  -- Luk 15
  ((SELECT id FROM cat), (SELECT id FROM typ), 15, 'Carang Butala', 'carang-butala'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 15, 'Sedet', 'sedet'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 15, 'Ragawilah', 'ragawilah'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 15, 'Raga Pasung', 'raga-pasung'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 15, 'Mahesa Nabrang', 'mahesa-nabrang-luk-15'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 15, 'Carita Buntala Luk 15', 'carita-buntala-luk-15'),

  -- Luk 17
  ((SELECT id FROM cat), (SELECT id FROM typ), 17, 'Carita Kalentang', 'carita-kalentang'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 17, 'Sepokal Luk 17', 'sepokal-luk-17'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 17, 'Ngamper Buta', 'ngamper-buta'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 17, 'Lancingan', 'lancingan'),

  -- Luk 19
  ((SELECT id FROM cat), (SELECT id FROM typ), 19, 'Tri Murda', 'tri-murda'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 19, 'Karancan', 'karancan'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 19, 'Bima Kurda Luk 19', 'bima-kurda-luk-19'),

  -- Luk 21
  ((SELECT id FROM cat), (SELECT id FROM typ), 21, 'Kala Tinanding', 'kala-tinanding'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 21, 'Trisirah', 'trisirah'),
  ((SELECT id FROM cat), (SELECT id FROM typ), 21, 'Drajid', 'drajid'),

  -- Luk 25
  ((SELECT id FROM cat), (SELECT id FROM typ), 25, 'Bima Kurda Luk 25', 'bima-kurda-luk-25'),

  -- Luk 27
  ((SELECT id FROM cat), (SELECT id FROM typ), 27, 'Tagawirun', 'tagawirun'),

  -- Luk 29
  ((SELECT id FROM cat), (SELECT id FROM typ), 29, 'Kala Bendu Luk 29', 'kala-bendu-luk-29');


-- 4. INSERT DHAPUR TOMBAK
WITH cat AS (SELECT id FROM public.categories WHERE slug = 'tombak')
INSERT INTO public.dhapurs (category_id, type_id, luk, name, slug) VALUES
  -- Tombak Lurus
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-lurus'), NULL, 'Baru', 'tombak-baru'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-lurus'), NULL, 'Baru Tropong', 'tombak-baru-tropong'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-lurus'), NULL, 'Baru Kuping atau Sipat Kelor', 'tombak-baru-kuping-sipat-kelor'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-lurus'), NULL, 'Buta Meler', 'tombak-buta-meler'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-lurus'), NULL, 'Pandu', 'tombak-pandu'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-lurus'), NULL, 'Panggang Lele', 'tombak-panggang-lele'),

  -- Tombak Kala Wijan
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-kala-wijan'), NULL, 'Tunjung Astra', 'tombak-tunjung-astra'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-kala-wijan'), NULL, 'Narendra', 'tombak-narendra'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-kala-wijan'), NULL, 'Wulan Tumanggal', 'tombak-wulan-tumanggal'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-kala-wijan'), NULL, 'Dwisula', 'tombak-dwisula'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-kala-wijan'), NULL, 'Trisula', 'tombak-trisula'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-kala-wijan'), NULL, 'Catursula', 'tombak-catursula'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-kala-wijan'), NULL, 'Pancasula', 'tombak-pancasula'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-kala-wijan'), NULL, 'Rosan Dita', 'tombak-rosan-dita'),

  -- Tombak Luk 5
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-luk-lima'), 5, 'Daradasih', 'tombak-daradasih'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-luk-lima'), 5, 'Rangga', 'tombak-rangga'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-luk-lima'), 5, 'Panggang Welut', 'tombak-panggang-welut'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-luk-lima'), 5, 'Dora Menggala', 'tombak-dora-menggala'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-luk-lima'), 5, 'Sladang Hasta', 'tombak-sladang-hasta'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-luk-lima'), 5, 'Daradasih Menggah', 'tombak-daradasih-menggah'),

  -- Tombak Luk 7
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-luk-tujuh'), 7, 'Kracan oder Karacan', 'tombak-kracan-oder-karacan'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-luk-tujuh'), 7, 'Megantara', 'tombak-megantara'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-luk-tujuh'), 7, 'Lung Gandu', 'tombak-lung-gandu'),

  -- Tombak Luk 9
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-luk-sembilan'), 9, 'Bandota', 'tombak-bandota'),

  -- Tombak Luk 11
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-luk-sebelas'), 11, 'Carita Anoman', 'tombak-carita-anoman'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-luk-sebelas'), 11, 'Carita Blandongan', 'tombak-carita-blandongan'),

  -- Tombak Luk Khusus
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-luk-khusus'), NULL, 'Cacing Kamil (Luk 3, 5 atau 7)', 'tombak-cacing-kamil'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-luk-khusus'), NULL, 'Banyak Angrem', 'tombak-banyak-angrem'),
  ((SELECT id FROM cat), (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'tombak-luk-khusus'), NULL, 'Kuntul Nglangak', 'tombak-kuntul-nglangak');


-- 5. INSERT DHAPUR PEDANG JAWA (9 DHAPUR DARI PDF)
WITH cat AS (SELECT id FROM public.categories WHERE slug = 'pedang-jawa'),
     typ AS (SELECT id FROM public.types WHERE category_id = (SELECT id FROM cat) AND slug = 'pedang-jawa')
INSERT INTO public.dhapurs (category_id, type_id, luk, name, slug) VALUES
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Lameng', 'pedang-lameng'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Bandol', 'pedang-bandol'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Luwuk', 'pedang-luwuk'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Lar Bango', 'pedang-lar-bango'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Sada', 'pedang-sada'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Tebalung', 'pedang-tebalung'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Suduk Maru', 'pedang-suduk-maru'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Sokayana', 'pedang-sokayana'),
  ((SELECT id FROM cat), (SELECT id FROM typ), NULL, 'Sabe', 'pedang-sabe');