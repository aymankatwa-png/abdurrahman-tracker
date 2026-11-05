/* ============================================================
   ديوان عبد الرحمن — Abdurrahman's diwan
   Moomken Media Center · Photography Unit · 8 Nov → 31 Dec 2026
   Edit content here. The engine (engine.js) and the look (theme.js) read it.
   ============================================================ */
(function () {
var AJP = 'https://institute.aljazeera.net/sites/default/files/';
var AJ = 'https://elearning.aljazeera.net/ar/courses/';
var MAG = 'https://magnumphotos.com/learn';

window.TRACKER = {
  id: 'abdurrahmanDark',
  name: 'عبد الرحمن',
  file: 'abdurrahman-progress.json',
  pin: '2001',
  start: new Date(2026, 10, 8),
  end: new Date(2026, 11, 31, 23, 59),
  weeks: 8,
  studyGoal: 10,
  doneLabel: 'أنجزتُها',
  pendingToast: 'أحسنت! المهمة الآن بانتظار مراجعة المشرف',
  welcome: 'أهلًا عبد الرحمن — الديوان مفتوح، والقلم في يدك',
  confetti: ['#A8322A', '#234A8C', '#B08A3E', '#1E1A16', '#F5EEDC'],

  chapters: [
    { id: 'P', n: 0, pre: true, badge: '✎', name: 'قبل الصفحة الأولى', en: 'Before the first page', weeks: null, color: '#6C737C',
      desc: 'حوارك مع نفسك «أنا أحدّث أنا» هو مقدّمة هذا الديوان: طفل خطواته محدّدة، ثم تمرّد، ثم رجل اختار طريقه بنفسه. من هنا نبدأ.',
      tasks: [{ id: 'p1', k: 'write', w: 1, pre: 1, t: 'أنا أحدّث أنا — الحوار الأول' }] },

    { id: 'C1', n: 1, badge: '1', name: 'النيّة: صورة تعرف لماذا وُجدت', en: 'Chapter 1 · Intention', weeks: [1, 2], color: '#A8322A',
      quote: '«إنّما الأعمالُ بالنيّات» — حديث شريف، رواه البخاري ومسلم',
      desc: 'هذا أول حديث في صحيح البخاري، وبه يبدأ كثير من العلماء كتبهم — لأن كل عمل يبدأ بسؤال «لماذا؟». والصورة كذلك. أنت تعرف الكاميرا جيدًا — هذا لم يعد السؤال. السؤال الآن: ماذا تريد أن يشعر به من يرى صورتك؟ في هذا الفصل تكتب ميثاقك بنفسك، وتختار ما ستخسره إن لم تفِ به، وتبدأ مع مصوّرة من Magnum تعلّمك كيف تكسب ثقة الغرباء.',
      tasks: [
        { id: 'a1', k: 'mission', w: 1, sub: 1, t: 'الميثاق: أكتب أهدافي بنفسي (أختار من أهدافي الثمانية ما يخدم هذين الشهرين) وما سأخسره إن لم أفِ — صدقة أحدّدها أنا — وأضيف موادّي ومواعيد امتحاناتي في قسم «الدراسة»' },
        { id: 'a2', k: 'course', w: 1, lang: 'EN', t: 'Jimmy Chin Teaches Adventure Photography · الدروس 1 – 3 (في الموقع، والبورتريه بالضوء الطبيعي، وتصوير ما تحبّه)', why: 'من مكتبة المركز: مصوّر يصوّر ما يؤمن به — وهذا ما يجعل صورته صادقة.' },
        { id: 'a3', k: 'read', w: 1, lang: 'AR', t: 'لماذا تعجز صور الذكاء الاصطناعي عن منافسة عدسة الحقيقة؟ — الجزيرة نت', url: 'https://www.aljazeera.net/media/2025/11/4/%d9%84%d9%85%d8%a7%d8%b0%d8%a7-%d9%84%d8%a7-%d9%8a%d9%85%d9%83%d9%86-%d8%a3%d9%86-%d8%aa%d8%ad%d9%84-%d8%b5%d9%88%d8%b1-%d8%a7%d9%84%d8%b0%d9%83%d8%a7%d8%a1' },
        { id: 'a4', k: 'course', w: 2, lang: 'EN', t: 'Magnum Learn · Get Started in Photography — قسما «الصوت» مع Cristina de Middel وRafał Milach', url: MAG, why: 'كيف يصنع المصوّر صوته الخاص — وتمرين لغتك الإنجليزية.' },
        { id: 'a5', k: 'practice', w: 2, sub: 1, t: '«كلمة قبل الضغطة»: 20 صورة في مكان واحد — قبل كل صورة أكتب كلمة واحدة: الشعور الذي يجب أن تحمله. أختار أفضل 3' },
        { id: 'a6', k: 'write', w: 2, sub: 1, t: 'تعليق للصور الثلاث بالعربية والإنجليزية — جملة واحدة لكل صورة تقول ما لا تقوله الصورة' },
        { id: 'a7', k: 'review', w: 2, t: 'جلسة مع المشرف: هل وصلت الكلمة؟' }
      ] },

    { id: 'C2', n: 2, badge: '2', name: 'الاتصال: الكرامة والثقة', en: 'Chapter 2 · Dignity & Trust', weeks: [3, 4], color: '#234A8C',
      quote: 'لا تُطلب أصدق اللقطات… بل تُكسب بالثقة.',
      desc: 'أنت تعرف شعور أن يُصنع منك نسخة لا تشبهك. لذلك ستفهم أكثر من غيرك معنى أن تصوّر الإنسان كما هو، لا كما تريده الكاميرا. هنا تتعلّم الموافقة، والكرامة، ومتى تكون اللقطة الأقوى هي التي لا تُلتقط.',
      tasks: [
        { id: 'b1', k: 'course', w: 3, lang: 'AR', t: 'وراء كل لاجئ قصة.. السرد الصحفي للقضايا الإنسانية — معهد الجزيرة للإعلام', url: AJ + 'course-69' },
        { id: 'b2', k: 'read', w: 3, lang: 'AR', t: 'أخلاقيات الصورة الصحفية في تغطية قضايا اللجوء — مجلة معهد الجزيرة', url: 'https://institute.aljazeera.net/en/node/1808', why: 'الموافقة، والقُصّر، ولا تمثيل، ولا تضخيم للمعاناة.' },
        { id: 'b3', k: 'read', w: 3, lang: 'AR', t: 'الإعلام الإنساني بين المعايير الأخلاقية والمحاذير القانونية — IJNet', url: 'https://ijnet.org/en/node/13246', why: 'طرق عملية لحماية الكرامة: التصوير من الخلف، والمشهد الواسع، والموافقة المكتوبة.' },
        { id: 'b4', k: 'course', w: 3, lang: 'EN', t: 'Annie Leibovitz Teaches Photography · الدروس 1 – 8 (البورتريه، والفكرة، والضوء، والعمل مع الشخص، وتصوير المقرّبين)', why: 'من مكتبة المركز: كيف تكسب ثقة من تصوّره، وتُظهره كما هو.' },
        { id: 'b5', k: 'course', w: 4, lang: 'EN', t: 'Visual Journalism: Looking at the Other in the Age of Selfie — Knight Center · الوحدتان 1 و2', url: 'https://journalismcourses.org/product/visual-journalism-looking-at-the-other-in-the-age-of-selfie-march-4-march-31/' },
        { id: 'b6', k: 'practice', w: 4, sub: 1, t: '«خمسة وجوه»: 5 بورتريهات لأشخاص حقيقيين في أنشطة ممكن — بموافقتهم، شعور لا وقفة — مع جملة قصة لكل وجه' },
        { id: 'b7', k: 'review', w: 4, t: 'جلسة مع المشرف على البورتريهات' }
      ] },

    { id: 'C3', n: 3, badge: '3', name: 'الزاوية: لغة الصورة', en: 'Chapter 3 · The Angle', weeks: [5, 6], color: '#B08A3E',
      quote: 'الزاوية ليست مكان الكاميرا… بل موقفك من الإنسان الذي أمامها.',
      desc: 'كل زاوية تقول شيئًا: من الأسفل قوة، من الأعلى ضعف، على مستوى العين احترام وندّية، واللقطة القريبة حميمية. هنا تتعلّم أن تختار الزاوية بنيّة — ثم تبني القصة في المونتاج على DaVinci Resolve، هدفك الذي كتبته بنفسك.',
      tasks: [
        { id: 'c1', k: 'read', w: 5, lang: 'AR', t: 'أنواع اللقطات وزوايا الكاميرا ومعانيها النفسية — Adobe (عربي)', url: 'https://www.adobe.com/ae_ar/creativecloud/video/production/cinematography/camera-shots-and-angles.html' },
        { id: 'c2', k: 'read', w: 5, lang: 'EN', t: 'StudioBinder · The Ultimate Guide to Camera Shots', url: 'https://studiobinder.com/blog/types-of-camera-shots/' },
        { id: 'c3', k: 'practice', w: 5, sub: 1, t: '«زاوية واحدة، ثلاثة معانٍ»: الشخص نفسه من الأسفل، وعلى مستوى العين، ومن الأعلى + لقطة واسعة وأخرى قريبة — وأكتب ما تقوله كل صورة' },
        { id: 'c4', k: 'course', w: 5, lang: 'EN', t: 'DaVinci Resolve — التدريب الرسمي من Blackmagic: كتاب المونتاج، الفصول 1 – 4', url: 'https://www.blackmagicdesign.com/products/davinciresolve/training' },
        { id: 'c8', k: 'course', w: 6, lang: 'EN', t: 'Jimmy Chin · الدروس 13 – 15 (المونتاج والمعالجة: اختيار الصور وتحرير البورتريه)', why: 'من مكتبة المركز: المعالجة التي تخدم الحقيقة ولا تغيّرها.' },
        { id: 'c5', k: 'course', w: 6, lang: 'AR', t: 'المونتاج رؤية تقنية وإبداعية — معهد الجزيرة للإعلام', url: AJ + 'course-86', why: 'معرفة البرنامج شيء، وبناء القصة البصرية شيء آخر.' },
        { id: 'c6', k: 'practice', w: 6, sub: 1, t: 'مونتاج 60 ثانية على DaVinci من صوري ولقطاتي — الترتيب يخدم الشعور أولًا (قاعدة Walter Murch)' },
        { id: 'c7', k: 'review', w: 6, t: 'جلسة مع المشرف على الزوايا والمونتاج' }
      ] },

    { id: 'C4', n: 4, badge: '4', name: 'القصة: المقال المصوّر', en: 'Chapter 4 · The Photo Essay', weeks: [7, 8], color: '#3E7A55',
      quote: 'صورة واحدة تلفت النظر… وسلسلة صادقة تغيّر طريقة النظر.',
      desc: 'الآن تجمع كل شيء في مقال مصوّر: 8 إلى 12 صورة لها بداية ووسط ونهاية، بتعليقات بالعربية والإنجليزية، وتُعرض كما تُعرض أعمال المصوّرين المحترفين. ثم تبدأ بتسويق نفسك بعمل حقيقي تفخر به.',
      tasks: [
        { id: 'd1', k: 'read', w: 7, lang: 'AR', t: 'البرنامج العربي للتصوير الوثائقي — أدرس 3 مقالات مصوّرة (منها «زغلول الحمام» للينا خالد)', url: 'https://www.arabdocphotography.org/project/86', why: 'قصص مصوّرة عربية شخصية وعاطفية — ومنها أعمال لمصوّرين ليبيين.' },
        { id: 'd2', k: 'course', w: 7, lang: 'AR', t: 'صناعة الأفلام الوثائقية — معهد الجزيرة للإعلام', url: AJ + 'course-81' },
        { id: 'd3', k: 'review', w: 7, t: 'جلسة مع الفريق: الذكاء الاصطناعي في عملنا — نتناقش معًا فيما نستخدمه وما لا نستخدمه' },
        { id: 'd9', k: 'course', w: 8, lang: 'EN', t: 'Jimmy Chin · الدرسان 7 و18 (العمل مع العملاء، وبناء مجموعة أعمال) + Annie Leibovitz · الدرسان 9 و15 (مراجعة أعمالك، وتطوّر المصوّر)', why: 'من مكتبة المركز: كيف تسوّق نفسك وتبني دخلًا من عمل تفخر به — هدفان كتبتهما بنفسك.' },
        { id: 'd5', k: 'project', w: 8, sub: 1, t: 'المقال المصوّر: 8 – 12 صورة لقصة إنسانية حقيقية برحلة شعورية، بتعليقات عربية وإنجليزية، وعرض قصير على DaVinci بالصوت' },
        { id: 'd6', k: 'mission', w: 8, sub: 1, t: 'تسويق نفسي: صفحة أعمال (Behance أو إنستغرام) فيها المقال المصوّر + نبذة عنّي بالعربية والإنجليزية' },
        { id: 'd7', k: 'milestone', w: 8, t: 'عرض المقال المصوّر أمام فريق المركز الإعلامي' },
        { id: 'd8', k: 'write', w: 8, sub: 1, t: 'أنا أحدّث أنا — الحوار الثاني: عبد الرحمن في ديسمبر يحدّث عبد الرحمن في نوفمبر' }
      ] }
  ],

  checks: [
    { id: 'sport', t: 'لجسدك عليك حق', d: 'رياضة مرتين هذا الأسبوع — «إنّ لجسدك عليك حقًّا»' },
    { id: 'en', t: 'الإنجليزية', d: '3 جلسات × 20 دقيقة (قراءة أو استماع أو كتابة)' },
    { id: 'market', t: 'تسويق نفسي', d: 'نشرت عملًا أو حدّثت صفحة أعمالي' },
    { id: 'verse', t: 'بيت الأسبوع', d: 'كتبتُ بيت هذا الأسبوع في الديوان' }
  ],

  resources: [
    { h: '🎓 الدورات الأساسية', items: [
      { t: 'Get Started in Photography', by: 'Magnum Learn', lang: 'EN', url: MAG },
      { t: 'Visual Journalism: Looking at the Other', by: 'Knight Center', lang: 'EN', url: 'https://journalismcourses.org/product/visual-journalism-looking-at-the-other-in-the-age-of-selfie-march-4-march-31/' },
      { t: 'خلف الكاميرا.. مختبر التخطيط والإنتاج الوثائقي', by: 'معهد الجزيرة للإعلام', lang: 'AR', url: AJ + 'course-1936', d: 'من الفكرة إلى المعالجة والعرض — للمحترفين.' },
      { t: 'DaVinci Resolve — التدريب الرسمي', by: 'Blackmagic Design', lang: 'EN', url: 'https://www.blackmagicdesign.com/products/davinciresolve/training', d: 'كتب PDF رسمية للمونتاج والصوت والألوان.' }
    ] },
    { h: '📚 من مكتبة المركز', items: [
      { t: 'Jimmy Chin Teaches Adventure Photography', by: 'مكتبة دورات المركز · 20 درسًا', lang: 'EN', kind: 'مكتبة المركز', d: 'السرد المصوّر، والمعالجة، والعمل مع العملاء، وبناء مجموعة أعمال.' },
      { t: 'Annie Leibovitz Teaches Photography', by: 'مكتبة دورات المركز · 15 درسًا', lang: 'EN', kind: 'مكتبة المركز', d: 'البورتريه، والضوء، والعمل مع الشخص.' },
      { t: 'Ken Burns Teaches Documentary Filmmaking', by: 'مكتبة دورات المركز · اختياري', lang: 'EN', kind: 'مكتبة المركز', d: 'الدرسان 12 و13 عن السرد البصري — للقصص الطويلة.' }
    ] },
    { h: '🖼 قصص مصوّرة تتعلّم منها', items: [
      { t: 'البرنامج العربي للتصوير الوثائقي', by: 'AFAC · Magnum Foundation', lang: 'AR', url: 'https://arabdocphotography.org/', kind: 'أرشيف', d: 'ومنحة قادمة بقيمة 7,000$ مع إشراف Magnum — راقب الدورة القادمة.' },
      { t: 'World Press Photo · Joop Swart Masterclass', by: 'World Press Photo', lang: 'EN', url: 'https://worldpressphoto.org/education/programs/joop-swart-masterclass', kind: 'برنامج', d: 'دورة 2026 تركّز على منطقة الشرق الأوسط وشمال أفريقيا.' }
    ] },
    { h: '📖 كتب يمكنك تحميلها وقراءتها الآن', items: [
      { t: 'التصوير الوثائقي في العالم العربي', by: 'معهد الجزيرة للإعلام · 2025', lang: 'AR', kind: 'PDF', url: AJP + '2025/%D8%A7%D9%84%D8%AA%D8%B5%D9%88%D9%8A%D8%B1%20%D8%A7%D9%84%D9%88%D8%AB%D8%A7%D8%A6%D9%82%D9%8A%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%B9%D8%A7%D9%84%D9%85%20%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A_%D8%B2%D9%85%D8%A7%D9%84%D8%A9%20%D8%A7%D9%84%D8%AC%D8%B2%D9%8A%D8%B1%D8%A9_%20%D8%AE%D8%A7%D9%84%D8%AF%20%D8%A2%D9%8A%D8%AA%20%D9%86%D8%A7%D8%B5%D8%B1.pdf', d: 'تجارب مصوّرين عرب ومشاريعهم الوثائقية — الأقرب إلى عملك.' },
      { t: 'دليل إلى القصة الصحفية الإنسانية', by: 'معهد الجزيرة للإعلام · 2025', lang: 'AR', kind: 'PDF', url: AJP + '2025/%D8%AF%D9%84%D9%8A%D9%84%20%D8%A5%D9%84%D9%89%20%D8%A7%D9%84%D9%82%D8%B5%D9%91%D8%A9%20%D8%A7%D9%84%D8%B5%D8%AD%D9%81%D9%8A%D8%A9%20%D8%A7%D9%84%D8%A5%D9%86%D8%B3%D8%A7%D9%86%D9%8A%D9%91%D8%A9%20-%20Final%20-%20web.pdf', d: 'كيف تجد الإنسان داخل الخبر، وتحكي قصته بكرامة.' },
      { t: 'دليل أخلاقيات الصحافة في العصر الرقمي', by: 'معهد الجزيرة للإعلام · 2022', lang: 'AR', kind: 'PDF', url: AJP + '2022/%D8%AF%D9%84%D9%8A%D9%84%20%D8%A3%D8%AE%D9%84%D8%A7%D9%82%D9%8A%D8%A7%D8%AA%20%D8%A7%D9%84%D8%B5%D8%AD%D8%A7%D9%81%D8%A9%20%D8%A7%D9%84%D8%B5%D8%AD%D8%A7%D9%81%D8%A9%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%B9%D8%B5%D8%B1%20%D8%A7%D9%84%D8%B1%D9%82%D9%85%D9%8A.pdf', d: 'ما يجوز وما لا يجوز حين نصوّر الناس وننشر صورهم.' },
      { t: 'السرد في الصحافة', by: 'معهد الجزيرة للإعلام · 2021', lang: 'AR', kind: 'PDF', url: AJP + '2021/%D9%83%D8%AA%D8%A7%D8%A8%20%D8%A7%D9%84%D8%B3%D8%B1%D8%AF%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%B5%D8%AD%D8%A7%D9%81%D8%A9.pdf', d: 'المشهد والشخصية والتفاصيل التي تجعل القصة تُكمَل حتى النهاية.' },
      { t: 'الفيلم الوثائقي: مقدمة قصيرة جدًّا — باتريشيا أوفدرهايدي', by: 'مؤسسة هنداوي · كتاب مترجم', lang: 'AR', kind: 'كتاب', url: 'https://www.hindawi.org/books/37969426/', d: 'ما الذي يجعل العمل «وثائقيًا»؟ وكيف يحكي الحقيقة دون أن يكذب؟' },
      { t: 'الثقافة البصرية: مقدمة قصيرة جدًّا — ألكسيس بويلان', by: 'مؤسسة هنداوي · كتاب مترجم', lang: 'AR', kind: 'كتاب', url: 'https://www.hindawi.org/books/40597508/', d: 'كيف نرى الصور، ولماذا تؤثّر فينا بهذه القوة.' }
    ] },
    { h: '⏳ لاحقًا — بعد هذا الموسم', items: [
      { t: 'تدريب المدرّبين TOT بشهادة معتمدة', by: 'هدف من أهدافك — نختار البرنامج معًا في يناير', lang: 'AR', url: 'https://elearning.aljazeera.net/ar', kind: 'هدف' },
      { t: 'وثائقي الهاتف المحمول', by: 'معهد الجزيرة للإعلام', lang: 'AR', url: AJ + 'course-61' }
    ] }
  ]
};
})();
