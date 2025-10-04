import { PrismaClient, ExerciseCategory, ExerciseDifficulty } from '@prisma/client';

const prisma = new PrismaClient();

const exercises = [
  // CHEST exercises
  {
    name: 'Лег с щанга',
    nameEn: 'Bench Press',
    description: 'Основно упражнение за гърди с щанга на хorizontална пейка',
    category: ExerciseCategory.CHEST,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: ['гърди', 'трицепс', 'предни делти'],
    equipment: ['щанга', 'пейка', 'стойки'],
    videoUrl: 'gRVjAtPip0Y', // YouTube video ID
    instructions: [
      'Легнете на хоризонтална пейка',
      'Хванете щангата с хват на ширина на раменете',
      'Свалете щангата до гърдите',
      'Натиснете щангата нагоре до изправяне на ръцете'
    ],
    tips: [
      'Задържайте раменете назад и надолу',
      'Спрете дишането при спускане',
      'Поддържайте контакт между долния гръб и пейката'
    ]
  },
  {
    name: 'Лег с дъмбели',
    nameEn: 'Dumbbell Bench Press',
    description: 'Вариант на лега с дъмбели за по-голяма амплитуда',
    category: ExerciseCategory.CHEST,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: ['гърди', 'трицепс', 'предни делти'],
    equipment: ['дъмбели', 'пейка'],
    videoUrl: 'VmB1G1K7v94',
    instructions: [
      'Легнете на пейка с дъмбел в всяка ръка',
      'Започнете с дъмбелите над гърдите',
      'Спуснете дъмбелите до ниво на гърдите',
      'Натиснете нагоре до изходна позиция'
    ],
    tips: [
      'По-голяма амплитуда от щангата',
      'Контролирайте теглото в цялата амплитуда',
      'Избягвайте сблъскване на дъмбелите в горе'
    ]
  },
  {
    name: 'Коремни преси',
    nameEn: 'Push-ups',
    description: 'Базово упражнение с тегло на тялото',
    category: ExerciseCategory.CHEST,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: ['гърди', 'трицепс', 'коремни'],
    equipment: [],
    videoUrl: '_l3ySVKYVJ8',
    instructions: [
      'Започнете в позиция планк',
      'Спуснете тялото до земята',
      'Натиснете тялото нагоре',
      'Поддържайте права линия на тялото'
    ],
    tips: [
      'Стегнете коремните мускули',
      'Не повдигайте задника',
      'Пълна амплитуда на движението'
    ]
  },

  // BACK exercises
  {
    name: 'Мъртва тяга',
    nameEn: 'Deadlift',
    description: 'Основно упражнение за цялото тяло',
    category: ExerciseCategory.BACK,
    difficulty: ExerciseDifficulty.ADVANCED,
    muscleGroups: ['долен гръб', 'задни бедра', 'ягодици', 'трапец'],
    equipment: ['щанга', 'дискове'],
    videoUrl: 'ytGaGIn3SjE',
    instructions: [
      'Застанете с крака на ширина на тазобедрените стави',
      'Хванете щангата с двете ръце',
      'Задържайте гърба прав и вдигнете щангата',
      'Разправете тазобедрените и коленните стави'
    ],
    tips: [
      'Започвайте движението с тазобедрените',
      'Задържайте щангата близо до тялото',
      'Не заоблявайте гърба'
    ]
  },
  {
    name: 'Лицево опиране',
    nameEn: 'Pull-ups',
    description: 'Упражнение с тегло на тялото за гърба',
    category: ExerciseCategory.BACK,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: ['широчайши', 'ромбовидни', 'бицепс'],
    equipment: ['лост'],
    videoUrl: 'eGo4IYlbE5g',
    instructions: [
      'Хванете лоста с хват отгоре',
      'Виснете с изправени ръце',
      'Издърпайте тялото нагоре',
      'Спуснете се контролирано надолу'
    ],
    tips: [
      'Активирайте плешките',
      'Избягвайте клатене',
      'Пълна амплитуда на движението'
    ]
  },

  // LEGS exercises
  {
    name: 'Клекове',
    nameEn: 'Squats',
    description: 'Основно упражнение за долната част на тялото',
    category: ExerciseCategory.LEGS,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: ['квадрицепс', 'ягодици', 'задни бедра'],
    equipment: ['щанга', 'стойки'],
    videoUrl: 'ultWZbUMPL8',
    instructions: [
      'Поставете щангата на трапеца',
      'Краката на ширина на раменете',
      'Спуснете се като сядате на стол',
      'Вдигнете се до изходна позиция'
    ],
    tips: [
      'Коленете в посока на пръстите',
      'Тегло на петите',
      'Гърдите нагоре и напред'
    ]
  },

  // SHOULDERS exercises
  {
    name: 'Военна преса',
    nameEn: 'Military Press',
    description: 'Натискане на щанга над главата',
    category: ExerciseCategory.SHOULDERS,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: ['предни делти', 'средни делти', 'трицепс'],
    equipment: ['щанга'],
    videoUrl: 'wol7Hko8LuY',
    instructions: [
      'Хванете щангата на ниво рамене',
      'Краката на ширина на тазобедрените',
      'Натиснете щангата над главата',
      'Спуснете контролирано до рамене'
    ],
    tips: [
      'Стегнете коремните мускули',
      'Не отклонявайте гърба назад',
      'Пълно разправяне на ръцете'
    ]
  },

  // ARMS exercises
  {
    name: 'Сгъвания с щанга',
    nameEn: 'Barbell Curls',
    description: 'Изолация на бицепса със щанга',
    category: ExerciseCategory.ARMS,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: ['бицепс', 'предмишници'],
    equipment: ['щанга'],
    videoUrl: 'ykJmrZ5v0Oo',
    instructions: [
      'Застанете изправени със щанга',
      'Хванете със супинирал хват',
      'Сгънете лактите нагоре',
      'Спуснете контролирано надолу'
    ],
    tips: [
      'Не клатете тялото',
      'Лактите близо до тялото',
      'Контрол в цялата амплитуда'
    ]
  },

  // Additional CHEST exercises
  {
    name: 'Наклонен лег',
    nameEn: 'Incline Bench Press',
    description: 'Лег на наклонена пейка за горна част на гърдите',
    category: ExerciseCategory.CHEST,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: ['горни гърди', 'предни делти', 'трицепс'],
    equipment: ['щанга', 'наклонена пейка'],
    videoUrl: 'DbFgADa2PL8',
    instructions: [
      'Настройте пейката на 30-45 градуса',
      'Хванете щангата с хват малко по-широк от раменете',
      'Спуснете щангата до горната част на гърдите',
      'Натиснете нагоре в контролирано движение'
    ],
    tips: [
      'Не използвайте твърде стръмен ъгъл',
      'Фокусирайте се върху горната част на гърдите',
      'Поддържайте стабилна позиция'
    ]
  },
  {
    name: 'Флайс с дъмбели',
    nameEn: 'Dumbbell Flyes',
    description: 'Изолация на гърдите с дъмбели',
    category: ExerciseCategory.CHEST,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: ['гърди', 'предни делти'],
    equipment: ['дъмбели', 'пейка'],
    videoUrl: 'eozdVDA78K0',
    instructions: [
      'Легнете на пейка с дъмбел в всяка ръка',
      'Започнете с ръце над гърдите, леко сгънати в лактите',
      'Спуснете дъмбелите встрани в широка дъга',
      'Върнете дъмбелите в изходна позиция'
    ],
    tips: [
      'Поддържайте лека сгъватост в лактите',
      'Усетете разтягането в гърдите',
      'Контролирайте теглото'
    ]
  },
  {
    name: 'Дипс',
    nameEn: 'Dips',
    description: 'Упражнение с тегло на тялото за долна част на гърдите',
    category: ExerciseCategory.CHEST,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: ['долни гърди', 'трицепс', 'предни делти'],
    equipment: ['паралелни лостове'],
    videoUrl: '2z8JmkrPmYE',
    instructions: [
      'Хванете паралелните лостове',
      'Повдигнете тялото с изправени ръце',
      'Спуснете се докато раменете са под лактите',
      'Натиснете се нагоре до изходна позиция'
    ],
    tips: [
      'Наклонете тялото напред за повече активиране на гърдите',
      'Контролирайте спускането',
      'Не спускайте твърде ниско'
    ]
  },

  // Additional BACK exercises
  {
    name: 'Тяга с щанга',
    nameEn: 'Barbell Row',
    description: 'Тяга с щанга в наклон за гърба',
    category: ExerciseCategory.BACK,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: ['широчайши', 'ромбовидни', 'задни делти'],
    equipment: ['щанга'],
    videoUrl: 'FWJR5Ve8bnQ',
    instructions: [
      'Застанете с крака на ширина на тазобедрените',
      'Наклонете се напред с прав гръб',
      'Хванете щангата с хват отгоре',
      'Издърпайте щангата към корема'
    ],
    tips: [
      'Поддържайте прав гръб',
      'Стегнете плешките в горе',
      'Контролирайте движението'
    ]
  },
  {
    name: 'Тяга с дъмбел',
    nameEn: 'Single-Arm Dumbbell Row',
    description: 'Еднократна тяга с дъмбел',
    category: ExerciseCategory.BACK,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: ['широчайши', 'ромбовидни', 'бицепс'],
    equipment: ['дъмбел', 'пейка'],
    videoUrl: 'pYcpY20QaE8',
    instructions: [
      'Поставете коляно и ръка на пейката',
      'Хванете дъмбела с другата ръка',
      'Издърпайте дъмбела към тазобедрената област',
      'Спуснете контролирано'
    ],
    tips: [
      'Поддържайте прав гръб',
      'Не завъртайте тялото',
      'Фокусирайте се върху плешките'
    ]
  },
  {
    name: 'Lat Pulldown',
    nameEn: 'Lat Pulldown',
    description: 'Тяга на въже за широчайшите мускули',
    category: ExerciseCategory.BACK,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: ['широчайши', 'ромбовидни', 'бицепс'],
    equipment: ['въжен тренажор'],
    videoUrl: 'CAwf7n6Luuc',
    instructions: [
      'Седнете на тренажора и хванете лоста широко',
      'Наклонете се леко назад',
      'Издърпайте лоста към гърдите',
      'Контролирайте връщането нагоре'
    ],
    tips: [
      'Не използвайте инерция',
      'Стегнете плешките',
      'Поддържайте изправена стойка'
    ]
  },

  // Additional LEGS exercises
  {
    name: 'Румънска мъртва тяга',
    nameEn: 'Romanian Deadlift',
    description: 'Вариант на мъртвата тяга за задните бедра',
    category: ExerciseCategory.LEGS,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: ['задни бедра', 'ягодици', 'долен гръб'],
    equipment: ['щанга'],
    videoUrl: 'jEy_czb3RKA',
    instructions: [
      'Застанете с щангата в ръцете',
      'Започнете движението с тазобедрените назад',
      'Спуснете щангата по краката',
      'Върнете се в изходна позиция'
    ],
    tips: [
      'Фокусирайте се върху тазобедрените',
      'Усетете разтягането в задните бедра',
      'Поддържайте прав гръб'
    ]
  },
  {
    name: 'Напади',
    nameEn: 'Lunges',
    description: 'Упражнение за крака с една нога напред',
    category: ExerciseCategory.LEGS,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: ['квадрицепс', 'ягодици', 'задни бедра'],
    equipment: ['дъмбели'],
    videoUrl: 'QOVaHwm-Q6U',
    instructions: [
      'Застанете изправени с дъмбели в ръцете',
      'Направете голяма крачка напред',
      'Спуснете се докато задното коляно почти докосне земята',
      'Върнете се в изходна позиция'
    ],
    tips: [
      'Поддържайте изправен торс',
      'Не позволявайте на коляното да излезе пред пръстите',
      'Контролирайте движението'
    ]
  },
  {
    name: 'Leg Press',
    nameEn: 'Leg Press',
    description: 'Натискане с крака на тренажор',
    category: ExerciseCategory.LEGS,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: ['квадрицепс', 'ягодици', 'задни бедра'],
    equipment: ['leg press тренажор'],
    videoUrl: 'IZxyjW7MPJQ',
    instructions: [
      'Седнете на тренажора с краката на платформата',
      'Спуснете теглото контролирано',
      'Натиснете платформата нагоре',
      'Не заключвайте коленете напълно'
    ],
    tips: [
      'Поддържайте цялото ходило на платформата',
      'Не спускайте твърде ниско',
      'Дишайте правилно'
    ]
  },
  {
    name: 'Calf Raises',
    nameEn: 'Calf Raises',
    description: 'Повдигания на пръсти за прасците',
    category: ExerciseCategory.LEGS,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: ['прасци'],
    equipment: ['дъмбели'],
    videoUrl: 'gwLzBJYoWlI',
    instructions: [
      'Застанете с дъмбели в ръцете',
      'Повдигнете се на пръсти',
      'Задържайте за секунда',
      'Спуснете се контролирано'
    ],
    tips: [
      'Пълна амплитуда на движението',
      'Задържайте равновесието',
      'Бавни контролирани движения'
    ]
  },

  // Additional SHOULDERS exercises
  {
    name: 'Странични вдигания',
    nameEn: 'Lateral Raises',
    description: 'Изолация на средните делти с дъмбели',
    category: ExerciseCategory.SHOULDERS,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: ['средни делти'],
    equipment: ['дъмбели'],
    videoUrl: '3VcKaXpzqRo',
    instructions: [
      'Застанете с дъмбели встрани от тялото',
      'Вдигнете ръцете встрани до ниво на раменете',
      'Спуснете контролирано',
      'Поддържайте лека сгъватост в лактите'
    ],
    tips: [
      'Не използвайте инерция',
      'Контролирайте теглото',
      'Фокусирайте се върху делтите'
    ]
  },
  {
    name: 'Задни делти с дъмбели',
    nameEn: 'Rear Delt Flyes',
    description: 'Изолация на задните делти',
    category: ExerciseCategory.SHOULDERS,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: ['задни делти'],
    equipment: ['дъмбели'],
    videoUrl: 'T1nDJ8bw2V8',
    instructions: [
      'Наклонете се напред с дъмбели в ръцете',
      'Вдигнете ръцете встрани',
      'Стегнете плешките',
      'Спуснете контролирано'
    ],
    tips: [
      'Не използвайте твърде голямо тегло',
      'Фокусирайте се върху задните делти',
      'Поддържайте прав гръб'
    ]
  },
  {
    name: 'Предни вдигания',
    nameEn: 'Front Raises',
    description: 'Изолация на предните делти',
    category: ExerciseCategory.SHOULDERS,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: ['предни делти'],
    equipment: ['дъмбели'],
    videoUrl: 'qEwKCR5JCog',
    instructions: [
      'Застанете с дъмбели пред тялото',
      'Вдигнете ръцете напред до ниво на раменете',
      'Спуснете контролирано',
      'Алтернирайте ръцете'
    ],
    tips: [
      'Не клатете тялото',
      'Контролирайте движението',
      'Не вдигайте над раменете'
    ]
  },
  {
    name: 'Арнолд прес',
    nameEn: 'Arnold Press',
    description: 'Комбинирано упражнение за раменете',
    category: ExerciseCategory.SHOULDERS,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: ['предни делти', 'средни делти', 'задни делти'],
    equipment: ['дъмбели'],
    videoUrl: 'VwGhJ0Vhvgc',
    instructions: [
      'Започнете с дъмбелите пред гърдите',
      'Завъртете ръцете навън',
      'Натиснете нагоре',
      'Върнете в обратен ред'
    ],
    tips: [
      'Плавни завъртания',
      'Контролирайте цялото движение',
      'Не използвайте инерция'
    ]
  },

  // Additional ARMS exercises
  {
    name: 'Трицепс разширения',
    nameEn: 'Tricep Extensions',
    description: 'Изолация на трицепса с дъмбел',
    category: ExerciseCategory.ARMS,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: ['трицепс'],
    equipment: ['дъмбел'],
    videoUrl: 'YbX7Wd8jQ-Q',
    instructions: [
      'Седнете с дъмбел над главата',
      'Спуснете дъмбела зад главата',
      'Разправете ръцете нагоре',
      'Поддържайте лактите на място'
    ],
    tips: [
      'Лактите близо до главата',
      'Не двигайте плечите',
      'Контролирайте теглото'
    ]
  },
  {
    name: 'Хамър сгъвания',
    nameEn: 'Hammer Curls',
    description: 'Сгъвания с неутрален хват',
    category: ExerciseCategory.ARMS,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: ['бицепс', 'предмишници'],
    equipment: ['дъмбели'],
    videoUrl: 'zC3nLlEvin4',
    instructions: [
      'Застанете с дъмбели с неутрален хват',
      'Сгънете ръцете нагоре',
      'Спуснете контролирано',
      'Лактите близо до тялото'
    ],
    tips: [
      'Не клатете тялото',
      'Задържайте неутралния хват',
      'Пълна амплитуда'
    ]
  },
  {
    name: 'Трицепс дипс на стол',
    nameEn: 'Chair Dips',
    description: 'Дипс за трицепс със стол',
    category: ExerciseCategory.ARMS,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: ['трицепс', 'предни делти'],
    equipment: ['стол'],
    videoUrl: '0326dy_-CzM',
    instructions: [
      'Седнете на ръба на стола',
      'Поставете ръцете на стола',
      'Спуснете тялото надолу',
      'Натиснете се нагоре'
    ],
    tips: [
      'Краката могат да бъдат огънати или прави',
      'Не спускайте твърде ниско',
      'Фокусирайте се върху трицепса'
    ]
  },

  // Additional CORE exercises
  {
    name: 'Планк',
    nameEn: 'Plank',
    description: 'Статично упражнение за коремните мускули',
    category: ExerciseCategory.CORE,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: ['коремни', 'долен гръб', 'рамене'],
    equipment: [],
    videoUrl: 'pSHjTRCQxIw',
    instructions: [
      'Легнете по корем',
      'Повдигнете тялото на лакти и пръсти',
      'Направете права линия от глава до пети',
      'Задържайте позицията'
    ],
    tips: [
      'Не повдигайте задника',
      'Дишайте нормално',
      'Стегнете коремните мускули'
    ]
  },
  {
    name: 'Коремни преси',
    nameEn: 'Crunches',
    description: 'Класически коремни преси',
    category: ExerciseCategory.CORE,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: ['горни коремни'],
    equipment: [],
    videoUrl: 'Xyd_fa5zoEU',
    instructions: [
      'Легнете по гръб с огънати колене',
      'Поставете ръцете зад главата',
      'Повдигнете главата и раменете',
      'Спуснете се контролирано'
    ],
    tips: [
      'Не дърпайте врата',
      'Фокусирайте се върху коремните',
      'Не се повдигайте напълно'
    ]
  },
  {
    name: 'Велосипед',
    nameEn: 'Bicycle Crunches',
    description: 'Динамично упражнение за коремните мускули',
    category: ExerciseCategory.CORE,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: ['коремни', 'странични коремни'],
    equipment: [],
    videoUrl: '9FGilxCbdz8',
    instructions: [
      'Легнете по гръб с ръце зад главата',
      'Повдигнете краката и раменете',
      'Докоснете лакет до противоположното коляно',
      'Алтернирайте страните'
    ],
    tips: [
      'Контролирайте движението',
      'Не дърпайте врата',
      'Поддържайте постоянно напрежение'
    ]
  },
  {
    name: 'Планк на страни',
    nameEn: 'Side Plank',
    description: 'Странични планк за страничните коремни',
    category: ExerciseCategory.CORE,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: ['странични коремни', 'коремни'],
    equipment: [],
    videoUrl: 'XeN_hKJhSLU',
    instructions: [
      'Легнете на страни',
      'Повдигнете тялото на лакет',
      'Направете права линия от глава до крака',
      'Задържайте позицията'
    ],
    tips: [
      'Не оставяйте тазобедрените да падат',
      'Дишайте нормално',
      'Стегнете страничните коремни'
    ]
  },
  {
    name: 'Mountain Climbers',
    nameEn: 'Mountain Climbers',
    description: 'Динамично кардио упражнение',
    category: ExerciseCategory.CORE,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: ['коремни', 'крака', 'рамене'],
    equipment: [],
    videoUrl: 'nmwgirgXLYM',
    instructions: [
      'Започнете в позиция планк',
      'Доведете едното коляно към гърдите',
      'Бързо сменете краката',
      'Поддържайте бърз ритъм'
    ],
    tips: [
      'Поддържайте планк позицията',
      'Не повдигайте задника',
      'Бързи крачни движения'
    ]
  },

  // CARDIO exercises
  {
    name: 'Скачащи джакове',
    nameEn: 'Jumping Jacks',
    description: 'Кардио упражнение за цялото тяло',
    category: ExerciseCategory.CARDIO,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: ['цяло тяло'],
    equipment: [],
    videoUrl: 'c4DAnQ6DtF8',
    instructions: [
      'Застанете с крака заедно и ръце встрани',
      'Скочете разтваряйки крака и вдигайки ръце',
      'Скочете връщайки в изходна позиция',
      'Повторете в бърз ритъм'
    ],
    tips: [
      'Запазете постоянен ритъм',
      'Кацайте меко',
      'Поддържайте изправена стойка'
    ]
  },
  {
    name: 'Високи колене',
    nameEn: 'High Knees',
    description: 'Кардио упражнение с високи колене',
    category: ExerciseCategory.CARDIO,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: ['крака', 'коремни'],
    equipment: [],
    videoUrl: 'OAJ_J2yK_q0',
    instructions: [
      'Застанете изправени',
      'Вдигайте коленете към гърдите',
      'Алтернирайте краката бързо',
      'Помагайте с ръцете'
    ],
    tips: [
      'Вдигайте коленете високо',
      'Поддържайте изправена стойка',
      'Бърз ритъм'
    ]
  },
  {
    name: 'Burpees',
    nameEn: 'Burpees',
    description: 'Комплексно упражнение за цялото тяло',
    category: ExerciseCategory.CARDIO,
    difficulty: ExerciseDifficulty.ADVANCED,
    muscleGroups: ['цяло тяло'],
    equipment: [],
    videoUrl: 'TU8QYVW0gDU',
    instructions: [
      'Започнете в изправена позиция',
      'Клекнете и поставете ръцете на земята',
      'Скочете назад в планк',
      'Направете коремна преса, скочете напред и нагоре'
    ],
    tips: [
      'Контролирайте движението',
      'Модифицирайте ако е необходимо',
      'Поддържайте добра форма'
    ]
  },

  // FULL_BODY exercises
  {
    name: 'Thrusters',
    nameEn: 'Thrusters',
    description: 'Комбинация от клек и военна преса',
    category: ExerciseCategory.FULL_BODY,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: ['крака', 'рамене', 'коремни'],
    equipment: ['дъмбели'],
    videoUrl: 'L219ltL15zk',
    instructions: [
      'Застанете с дъмбели на раменете',
      'Направете клек',
      'Станете и натиснете дъмбелите над главата',
      'Спуснете и повторете'
    ],
    tips: [
      'Плавно преминаване между движенията',
      'Поддържайте добра форма',
      'Дишайте правилно'
    ]
  },
  {
    name: 'Турска стойка',
    nameEn: 'Turkish Get-Up',
    description: 'Комплексно функционално упражнение',
    category: ExerciseCategory.FULL_BODY,
    difficulty: ExerciseDifficulty.ADVANCED,
    muscleGroups: ['цяло тяло', 'стабилизация'],
    equipment: ['кетълбел'],
    videoUrl: '0bWRPC49-KI',
    instructions: [
      'Легнете с кетълбел в ръка',
      'Станете стъпка по стъпка',
      'Поддържайте кетълбела над главата',
      'Върнете се надолу в контролирано движение'
    ],
    tips: [
      'Започнете с лекло тегло',
      'Фокусирайте се върху техниката',
      'Бавни контролирани движения'
    ]
  },
  {
    name: 'Man Makers',
    nameEn: 'Man Makers',
    description: 'Комплексно упражнение с дъмбели',
    category: ExerciseCategory.FULL_BODY,
    difficulty: ExerciseDifficulty.ADVANCED,
    muscleGroups: ['цяло тяло'],
    equipment: ['дъмбели'],
    videoUrl: 'Pzlm3pnHH10',
    instructions: [
      'Започнете с дъмбели в ръцете',
      'Направете burpee с тяга',
      'Станете и направете thruster',
      'Комбинирайте всички движения'
    ],
    tips: [
      'Сложно упражнение - започнете бавно',
      'Поддържайте добра форма',
      'Модифицирайте ако е необходимо'
    ]
  }
];

async function main() {
  console.log('Start seeding exercises...');

  for (const exercise of exercises) {
    await prisma.exercise.create({
      data: {
        ...exercise,
        muscleGroups: JSON.stringify(exercise.muscleGroups),
        equipment: JSON.stringify(exercise.equipment),
        instructions: JSON.stringify(exercise.instructions),
        tips: JSON.stringify(exercise.tips),
      },
    });
  }

  console.log('Seeding exercises completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });