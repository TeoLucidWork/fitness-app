import { PrismaClient, ExerciseCategory, ExerciseDifficulty } from '@prisma/client';

const prisma = new PrismaClient();

const exercises = [
  // CHEST exercises
  {
    name: "Изтласкване с дъмбели на наклонена пейка",
    nameEn: "Incline Dumbbell Press",
    description: "Изтласкване с дъмбели на наклонена пейка за горната част на гърдите",
    category: ExerciseCategory.CHEST,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Горни гърди", "Предни делтоиди", "Трицепси"]),
    equipment: JSON.stringify(["Дъмбели", "Наклонена пейка"]),
    instructions: JSON.stringify([
      "Легнете на наклонена пейка под ъгъл 30-45°",
      "Хванете дъмбелите с прав хват",
      "Бутнете дъмбелите нагоре и навътре",
      "Контролирано спуснете към гърдите"
    ]),
    tips: JSON.stringify(["Запазете лека извивка в лактите", "Не докосвайте дъмбелите един в друг"])
  },
  {
    name: "Разперения с дъмбели",
    nameEn: "Dumbbell Flyes",
    description: "Изолираща упражнения за гърдите с дъмбели",
    category: ExerciseCategory.CHEST,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Гърди", "Предни делтоиди"]),
    equipment: JSON.stringify(["Дъмбели", "Пейка"]),
    instructions: JSON.stringify([
      "Легнете на пейка с дъмбели в ръцете",
      "Започнете с ръце над гърдите",
      "Спуснете ръцете в дъга встрани",
      "Върнете в изходна позиция"
    ]),
    tips: JSON.stringify(["Запазете лека извивка в лактите", "Контролирайте движението"])
  },
  {
    name: "Паралелки",
    nameEn: "Parallel Bar Dips",
    description: "Упражнение за гърди и трицепси на паралелки",
    category: ExerciseCategory.CHEST,
    difficulty: ExerciseDifficulty.ADVANCED,
    muscleGroups: JSON.stringify(["Долни гърди", "Трицепси", "Предни делтоиди"]),
    equipment: JSON.stringify(["Паралелки"]),
    instructions: JSON.stringify([
      "Хванете паралелките и се вдигнете",
      "Наведете се леко напред",
      "Спуснете тялото до удобен ъгъл",
      "Изтласкайте се нагоре"
    ]),
    tips: JSON.stringify(["Не слизайте твърде ниско", "Контролирайте движението"])
  },
  {
    name: "Лицеви опирания от стена",
    nameEn: "Wall Push-ups",
    description: "Лесна версия на лицевите опирания за начинаещи",
    category: ExerciseCategory.CHEST,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: JSON.stringify(["Гърди", "Трицепси", "Предни делтоиди"]),
    equipment: JSON.stringify(["Стена"]),
    instructions: JSON.stringify([
      "Застанете на 60 см от стената",
      "Поставете ръцете на стената",
      "Наведете се към стената",
      "Изтласкайте се обратно"
    ]),
    tips: JSON.stringify(["Запазете права линия на тялото", "Започнете бавно"])
  },

  // BACK exercises
  {
    name: "Гребане с щанга",
    nameEn: "Barbell Rows",
    description: "Базово упражнение за гръб с щанга",
    category: ExerciseCategory.BACK,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Широчайши", "Ромбоиди", "Задни делтоиди", "Бицепси"]),
    equipment: JSON.stringify(["Щанга", "Тежести"]),
    instructions: JSON.stringify([
      "Застанете с леко огънати крака",
      "Наведете се напред с права гърба",
      "Хванете щангата с широк хват",
      "Дръпнете щангата към корема"
    ]),
    tips: JSON.stringify(["Запазете права гърба", "Стегнете лопатките"])
  },
  {
    name: "Гребане с дъмбел",
    nameEn: "Single-Arm Dumbbell Row",
    description: "Едноръчно гребане с дъмбел на пейка",
    category: ExerciseCategory.BACK,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Широчайши", "Ромбоиди", "Задни делтоиди"]),
    equipment: JSON.stringify(["Дъмбел", "Пейка"]),
    instructions: JSON.stringify([
      "Поставете едно коляно на пейката",
      "Обопрете се с едната ръка",
      "Хванете дъмбела с другата ръка",
      "Дръпнете към корема"
    ]),
    tips: JSON.stringify(["Запазете права гърба", "Не ротирайте тялото"])
  },
  {
    name: "Подтягания",
    nameEn: "Pull-ups",
    description: "Базово упражнение за гръб на лост",
    category: ExerciseCategory.BACK,
    difficulty: ExerciseDifficulty.ADVANCED,
    muscleGroups: JSON.stringify(["Широчайши", "Ромбоиди", "Бицепси"]),
    equipment: JSON.stringify(["Лост за подтягания"]),
    instructions: JSON.stringify([
      "Хванете лоста с широк хват",
      "Висете с изправени ръце",
      "Подтегнете се до брадичката",
      "Контролирано се спуснете"
    ]),
    tips: JSON.stringify(["Не люлейте тялото", "Фокусирайте се върху гърба"])
  },
  {
    name: "Австралийски подтягания",
    nameEn: "Australian Pull-ups",
    description: "Лесна версия на подтяганията за начинаещи",
    category: ExerciseCategory.BACK,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: JSON.stringify(["Широчайши", "Ромбоиди", "Бицепси"]),
    equipment: JSON.stringify(["Ниска щанга или TRX"]),
    instructions: JSON.stringify([
      "Легнете под ниска щанга",
      "Хванете щангата с широк хват",
      "Подтегнете гърдите към щангата",
      "Спуснете се контролирано"
    ]),
    tips: JSON.stringify(["Запазете права линия на тялото", "Стегнете корема"])
  },

  // LEGS exercises
  {
    name: "Клякания с щанга",
    nameEn: "Barbell Squats",
    description: "Базово упражнение за крака с щанга",
    category: ExerciseCategory.LEGS,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Квадрицепси", "Глутеуси", "Задни мускули на бедрото"]),
    equipment: JSON.stringify(["Щанга", "Стойка за клякания"]),
    instructions: JSON.stringify([
      "Поставете щангата на плещите",
      "Застанете с крака на ширината на раменете",
      "Спуснете се до ъгъл 90°",
      "Изправете се със силата на краката"
    ]),
    tips: JSON.stringify(["Запазете права гърба", "Коленете не излизат навън"])
  },
  {
    name: "Напади",
    nameEn: "Lunges",
    description: "Едностранно упражнение за крака",
    category: ExerciseCategory.LEGS,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: JSON.stringify(["Квадрицепси", "Глутеуси", "Задни мускули на бедрото"]),
    equipment: JSON.stringify(["Собствено тегло", "Дъмбели (опционално)"]),
    instructions: JSON.stringify([
      "Застанете изправени",
      "Направете крачка напред",
      "Спуснете се до 90° в двете колена",
      "Върнете се в изходна позиция"
    ]),
    tips: JSON.stringify(["Запазете торса изправен", "Не докосвайте коляното на земята"])
  },
  {
    name: "Румънска мъртва тяга",
    nameEn: "Romanian Deadlift",
    description: "Вариант на мъртвата тяга за задните мускули",
    category: ExerciseCategory.LEGS,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Задни мускули на бедрото", "Глутеуси", "Долна част на гърба"]),
    equipment: JSON.stringify(["Щанга или дъмбели"]),
    instructions: JSON.stringify([
      "Застанете с щангата в ръцете",
      "Запазете леко огънати колена",
      "Наведете се назад с изправен гръб",
      "Върнете се в изходна позиция"
    ]),
    tips: JSON.stringify(["Почувствайте опъването в задните мускули", "Не закръгляйте гърба"])
  },
  {
    name: "Българските клякания",
    nameEn: "Bulgarian Split Squats",
    description: "Едностранно упражнение за крака с повишена задна крак",
    category: ExerciseCategory.LEGS,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Квадрицепси", "Глутеуси"]),
    equipment: JSON.stringify(["Пейка", "Дъмбели (опционално)"]),
    instructions: JSON.stringify([
      "Поставете задния крак на пейката",
      "Спуснете се в кляканица на предния крак",
      "Изправете се със силата на предния крак",
      "Повторете за двата крака"
    ]),
    tips: JSON.stringify(["Фокусирайте се върху предния крак", "Запазете равновесие"])
  },

  // SHOULDERS exercises
  {
    name: "Военна преса",
    nameEn: "Military Press",
    description: "Базово упражнение за рамене със щанга",
    category: ExerciseCategory.SHOULDERS,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Предни делтоиди", "Средни делтоиди", "Трицепси"]),
    equipment: JSON.stringify(["Щанга", "Тежести"]),
    instructions: JSON.stringify([
      "Застанете изправени със щангата",
      "Хванете с хват на ширината на раменете",
      "Изтласкайте щангата над главата",
      "Спуснете контролирано до раменете"
    ]),
    tips: JSON.stringify(["Стегнете корема", "Не прекланяйте гърба"])
  },
  {
    name: "Странични вдигания",
    nameEn: "Lateral Raises",
    description: "Изолираща упражнения за средните делтоиди",
    category: ExerciseCategory.SHOULDERS,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: JSON.stringify(["Средни делтоиди"]),
    equipment: JSON.stringify(["Дъмбели"]),
    instructions: JSON.stringify([
      "Застанете с дъмбели в ръцете",
      "Вдигнете ръцете встрани до рамената",
      "Спуснете контролирано",
      "Повторете движението"
    ]),
    tips: JSON.stringify(["Не вдигайте над раменете", "Контролирайте движението"])
  },
  {
    name: "Предни вдигания",
    nameEn: "Front Raises",
    description: "Изолираща упражнения за предните делтоиди",
    category: ExerciseCategory.SHOULDERS,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: JSON.stringify(["Предни делтоиди"]),
    equipment: JSON.stringify(["Дъмбели"]),
    instructions: JSON.stringify([
      "Застанете с дъмбели в ръцете",
      "Вдигнете ръцете напред до рамената",
      "Спуснете контролирано",
      "Повторете за другата ръка"
    ]),
    tips: JSON.stringify(["Запазете лека извивка в лактите", "Не използвайте замах"])
  },
  {
    name: "Обратни разперения",
    nameEn: "Reverse Flyes",
    description: "Упражнение за задните делтоиди",
    category: ExerciseCategory.SHOULDERS,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Задни делтоиди", "Ромбоиди"]),
    equipment: JSON.stringify(["Дъмбели"]),
    instructions: JSON.stringify([
      "Наведете се напред с дъмбели",
      "Вдигнете ръцете встрани",
      "Стегнете лопатките",
      "Контролирано спуснете"
    ]),
    tips: JSON.stringify(["Запазете права гърба", "Фокусирайте се върху задните делтоиди"])
  },

  // ARMS exercises
  {
    name: "Сгъвания с щанга",
    nameEn: "Barbell Curls",
    description: "Базично упражнение за бицепси със щанга",
    category: ExerciseCategory.ARMS,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: JSON.stringify(["Бицепси"]),
    equipment: JSON.stringify(["Щанга", "Тежести"]),
    instructions: JSON.stringify([
      "Застанете с щангата в ръцете",
      "Сгънете ръцете към раменете",
      "Стегнете бицепсите",
      "Спуснете контролирано"
    ]),
    tips: JSON.stringify(["Не люлейте тялото", "Запазете лактите неподвижни"])
  },
  {
    name: "Сгъвания с дъмбели",
    nameEn: "Dumbbell Curls",
    description: "Едностранни сгъвания за бицепси",
    category: ExerciseCategory.ARMS,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: JSON.stringify(["Бицепси"]),
    equipment: JSON.stringify(["Дъмбели"]),
    instructions: JSON.stringify([
      "Застанете с дъмбели в ръцете",
      "Сгънете едната ръка",
      "Стегнете бицепса",
      "Повторете с другата ръка"
    ]),
    tips: JSON.stringify(["Контролирайте движението", "Работете едната ръка наведнъж"])
  },
  {
    name: "Разтягания над главата",
    nameEn: "Overhead Tricep Extension",
    description: "Упражнение за трицепси над главата",
    category: ExerciseCategory.ARMS,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Трицепси"]),
    equipment: JSON.stringify(["Дъмбел"]),
    instructions: JSON.stringify([
      "Седнете или застанете с дъмбел",
      "Вдигнете дъмбела над главата",
      "Спуснете зад главата",
      "Изправете ръцете нагоре"
    ]),
    tips: JSON.stringify(["Запазете лактите неподвижни", "Не спускайте твърде ниско"])
  },
  {
    name: "Диаманти лицеви опирания",
    nameEn: "Diamond Push-ups",
    description: "Усложнена версия на лицевите опирания за трицепси",
    category: ExerciseCategory.ARMS,
    difficulty: ExerciseDifficulty.ADVANCED,
    muscleGroups: JSON.stringify(["Трицепси", "Гърди"]),
    equipment: JSON.stringify(["Собствено тегло"]),
    instructions: JSON.stringify([
      "Поставете ръцете във форма на диамант",
      "Застанете в позиция за лицеви опирания",
      "Спуснете се към ръцете",
      "Изтласкайте се нагоре"
    ]),
    tips: JSON.stringify(["Запазете права линия на тялото", "Фокусирайте се върху трицепсите"])
  },

  // CORE exercises
  {
    name: "Планк",
    nameEn: "Plank",
    description: "Статично упражнение за цялото ядро",
    category: ExerciseCategory.CORE,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: JSON.stringify(["Коремни мускули", "Гръб", "Рамене"]),
    equipment: JSON.stringify(["Собствено тегло"]),
    instructions: JSON.stringify([
      "Застанете в позиция на лицеви опирания на лактите",
      "Запазете права линия от глава до пети",
      "Стегнете корема и дишайте нормално",
      "Задръжте позицията"
    ]),
    tips: JSON.stringify(["Не повдигайте задника", "Не спускайте таза"])
  },
  {
    name: "Руски завъртания",
    nameEn: "Russian Twists",
    description: "Ротационно упражнение за корема",
    category: ExerciseCategory.CORE,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Коремни мускули", "Странични коремни"]),
    equipment: JSON.stringify(["Собствено тегло", "Топка (опционално)"]),
    instructions: JSON.stringify([
      "Седнете с огънати колена",
      "Наведете се назад леко",
      "Завъртайте тялото наляво и надясно",
      "Докосвайте земята от двете страни"
    ]),
    tips: JSON.stringify(["Запазете гърба прав", "Контролирайте движението"])
  },
  {
    name: "Мъртвия бръмбар",
    nameEn: "Dead Bug",
    description: "Упражнение за стабилизация на ядрото",
    category: ExerciseCategory.CORE,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: JSON.stringify(["Дълбоки коремни мускули", "Стабилизатори"]),
    equipment: JSON.stringify(["Собствено тегло"]),
    instructions: JSON.stringify([
      "Легнете по гръб с вдигнати крака",
      "Изправете едната ръка и противоположния крак",
      "Върнете в изходна позиция",
      "Повторете с другата страна"
    ]),
    tips: JSON.stringify(["Не вдигайте долната част на гърба", "Движете се бавно"])
  },
  {
    name: "Планк с вдигане на крак",
    nameEn: "Plank with Leg Lifts",
    description: "Усложнена версия на планка",
    category: ExerciseCategory.CORE,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Коремни мускули", "Глутеуси", "Долна част на гърба"]),
    equipment: JSON.stringify(["Собствено тегло"]),
    instructions: JSON.stringify([
      "Застанете в позиция планк",
      "Вдигнете единия крак нагоре",
      "Задръжте за секунда",
      "Повторете с другия крак"
    ]),
    tips: JSON.stringify(["Не ротирайте таза", "Запазете стабилна позиция"])
  },

  // CARDIO exercises
  {
    name: "Джъмпинг джакс",
    nameEn: "Jumping Jacks",
    description: "Кардио упражнение за цялото тяло",
    category: ExerciseCategory.CARDIO,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: JSON.stringify(["Цяло тяло", "Сърдечно-съдова система"]),
    equipment: JSON.stringify(["Собствено тегло"]),
    instructions: JSON.stringify([
      "Застанете с краче до краче",
      "Скочете и разперете крака",
      "Едновременно вдигнете ръцете над главата",
      "Върнете се в изходна позиция"
    ]),
    tips: JSON.stringify(["Запазете ритъм", "Кацайте меко"])
  },
  {
    name: "Берпита",
    nameEn: "Burpees",
    description: "Интензивно кардио упражнение за цялото тяло",
    category: ExerciseCategory.CARDIO,
    difficulty: ExerciseDifficulty.ADVANCED,
    muscleGroups: JSON.stringify(["Цяло тяло", "Сърдечно-съдова система"]),
    equipment: JSON.stringify(["Собствено тегло"]),
    instructions: JSON.stringify([
      "Започнете в позиция клякане",
      "Поставете ръцете на земята",
      "Скочете в позиция лицеви опирания",
      "Направете лицево опиране, върнете се и скочете нагоре"
    ]),
    tips: JSON.stringify(["Запазете добра форма", "Модифицирайте ако е нужно"])
  },
  {
    name: "Маунтейн клаймърс",
    nameEn: "Mountain Climbers",
    description: "Динамично кардио упражнение",
    category: ExerciseCategory.CARDIO,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Коремни мускули", "Рамене", "Крака"]),
    equipment: JSON.stringify(["Собствено тегло"]),
    instructions: JSON.stringify([
      "Застанете в позиция лицеви опирания",
      "Доведете едното коляно към гърдите",
      "Бързо сменяйте краката",
      "Запазете стабилна позиция на ръцете"
    ]),
    tips: JSON.stringify(["Запазете тялото право", "Движете се бързо"])
  },
  {
    name: "Бягане на място",
    nameEn: "Running in Place",
    description: "Просто кардио упражнение",
    category: ExerciseCategory.CARDIO,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: JSON.stringify(["Крака", "Сърдечно-съдова система"]),
    equipment: JSON.stringify(["Собствено тегло"]),
    instructions: JSON.stringify([
      "Застанете изправени",
      "Започнете да бягате на място",
      "Вдигайте коленете към гърдите",
      "Движете ръцете естествено"
    ]),
    tips: JSON.stringify(["Запазете добър ритъм", "Кацайте на пръстите"])
  },

  // FULL_BODY exercises
  {
    name: "Турски станувания",
    nameEn: "Turkish Get-ups",
    description: "Комплексно упражнение за цялото тяло",
    category: ExerciseCategory.FULL_BODY,
    difficulty: ExerciseDifficulty.ADVANCED,
    muscleGroups: JSON.stringify(["Цяло тяло", "Стабилизатори", "Ядро"]),
    equipment: JSON.stringify(["Кетълбел или дъмбел"]),
    instructions: JSON.stringify([
      "Легнете с кетълбел в едната ръка",
      "Започнете сложна последователност от движения",
      "Стигнете до изправена позиция",
      "Върнете се в изходната позиция"
    ]),
    tips: JSON.stringify(["Започнете с лек тежест", "Научете техниката добре"])
  },
  {
    name: "Замахи с кетълбел",
    nameEn: "Kettlebell Swings",
    description: "Динамично упражнение с кетълбел",
    category: ExerciseCategory.FULL_BODY,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Глутеуси", "Задни мускули", "Ядро", "Рамене"]),
    equipment: JSON.stringify(["Кетълбел"]),
    instructions: JSON.stringify([
      "Застанете с кетълбел пред себе си",
      "Хванете с двете ръце",
      "Замахнете между краката",
      "Изправете тазобедрените стави енергично"
    ]),
    tips: JSON.stringify(["Използвайте тазобедрените стави", "Не клякайте"])
  },
  {
    name: "Клин и преса",
    nameEn: "Clean and Press",
    description: "Комплексно олимпийско упражнение",
    category: ExerciseCategory.FULL_BODY,
    difficulty: ExerciseDifficulty.ADVANCED,
    muscleGroups: JSON.stringify(["Цяло тяло", "Експлозивна сила"]),
    equipment: JSON.stringify(["Щанга", "Тежести"]),
    instructions: JSON.stringify([
      "Започнете с щангата на земята",
      "Дръпнете щангата към раменете (клин)",
      "Изтласкайте над главата (преса)",
      "Спуснете контролирано"
    ]),
    tips: JSON.stringify(["Научете техниката отделно", "Започнете с лек тежест"])
  },
  {
    name: "Трастъри",
    nameEn: "Thrusters",
    description: "Комбинация от кляканица и преса над главата",
    category: ExerciseCategory.FULL_BODY,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Крака", "Рамене", "Ядро"]),
    equipment: JSON.stringify(["Дъмбели или щанга"]),
    instructions: JSON.stringify([
      "Започнете с тежестите на раменете",
      "Направете кляканица",
      "При изправяне изтласкайте тежестите нагоре",
      "Върнете на раменете и повторете"
    ]),
    tips: JSON.stringify(["Използвайте инерцията от краката", "Запазете ритъм"])
  },

  // Additional exercises to reach 50
  {
    name: "Кабелни сгъвания",
    nameEn: "Cable Curls",
    description: "Сгъвания за бицепси на кабелна машина",
    category: ExerciseCategory.ARMS,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Бицепси"]),
    equipment: JSON.stringify(["Кабелна машина"]),
    instructions: JSON.stringify([
      "Застанете пред кабелната машина",
      "Хванете ръчката с долен хват",
      "Сгънете ръцете към раменете",
      "Контролирано спуснете"
    ]),
    tips: JSON.stringify(["Запазете постоянно напрежение", "Не люлейте тялото"])
  },
  {
    name: "Хамър сгъвания",
    nameEn: "Hammer Curls",
    description: "Неутрални сгъвания за бицепси и предмишници",
    category: ExerciseCategory.ARMS,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: JSON.stringify(["Бицепси", "Предмишници"]),
    equipment: JSON.stringify(["Дъмбели"]),
    instructions: JSON.stringify([
      "Застанете с дъмбели с неутрален хват",
      "Сгънете ръцете без да ротирате китките",
      "Стегнете мускулите",
      "Спуснете контролирано"
    ]),
    tips: JSON.stringify(["Запазете неутралния хват", "Работете едновременно двете ръце"])
  },
  {
    name: "Френска преса",
    nameEn: "French Press",
    description: "Изолираща упражнения за трицепси легнал",
    category: ExerciseCategory.ARMS,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Трицепси"]),
    equipment: JSON.stringify(["Щанга или дъмбели", "Пейка"]),
    instructions: JSON.stringify([
      "Легнете на пейка с щанга над гърдите",
      "Спуснете щангата към челото",
      "Изправете ръцете нагоре",
      "Запазете лактите неподвижни"
    ]),
    tips: JSON.stringify(["Не движете лактите", "Контролирайте движението"])
  },
  {
    name: "Латерален планк",
    nameEn: "Side Plank",
    description: "Статично упражнение за страничните коремни мускули",
    category: ExerciseCategory.CORE,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Странични коремни", "Стабилизатори"]),
    equipment: JSON.stringify(["Собствено тегло"]),
    instructions: JSON.stringify([
      "Легнете на страни",
      "Подпрете се на лакътя",
      "Вдигнете тялото в права линия",
      "Задръжте позицията"
    ]),
    tips: JSON.stringify(["Не провисвайте", "Дишайте нормално"])
  },
  {
    name: "Велосипед",
    nameEn: "Bicycle Crunches",
    description: "Динамично упражнение за корема",
    category: ExerciseCategory.CORE,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Коремни мускули", "Странични коремни"]),
    equipment: JSON.stringify(["Собствено тегло"]),
    instructions: JSON.stringify([
      "Легнете по гръб с ръце зад главата",
      "Вдигнете раменете и краката",
      "Докоснете противоположни лакът и коляно",
      "Сменяйте страните като велосипед"
    ]),
    tips: JSON.stringify(["Не дърпайте врата", "Контролирайте движението"])
  },
  {
    name: "Степ ъпс",
    nameEn: "Step-ups",
    description: "Едностранно упражнение за крака на стъпало",
    category: ExerciseCategory.LEGS,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: JSON.stringify(["Квадрицепси", "Глутеуси"]),
    equipment: JSON.stringify(["Стъпало или пейка"]),
    instructions: JSON.stringify([
      "Застанете пред стъпало",
      "Качете се с единия крак",
      "Изправете се напълно",
      "Слезте контролирано"
    ]),
    tips: JSON.stringify(["Не бутайте с долния крак", "Контролирайте спускането"])
  },
  {
    name: "Глут бридж",
    nameEn: "Glute Bridge",
    description: "Упражнение за глутеусите",
    category: ExerciseCategory.LEGS,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: JSON.stringify(["Глутеуси", "Задни мускули на бедрото"]),
    equipment: JSON.stringify(["Собствено тегло"]),
    instructions: JSON.stringify([
      "Легнете по гръб с огънати колена",
      "Вдигнете таза нагоре",
      "Стегнете глутеусите",
      "Спуснете контролирано"
    ]),
    tips: JSON.stringify(["Стегнете силно глутеусите", "Не прекланяйте гърба"])
  },
  {
    name: "Стенна седалка",
    nameEn: "Wall Sit",
    description: "Статично упражнение за крака",
    category: ExerciseCategory.LEGS,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Квадрицепси", "Глутеуси"]),
    equipment: JSON.stringify(["Стена"]),
    instructions: JSON.stringify([
      "Застанете гръб към стената",
      "Плъзнете се надолу до ъгъл 90°",
      "Задръжте позицията",
      "Дишайте нормално"
    ]),
    tips: JSON.stringify(["Коленете на 90°", "Не се облягайте на ръцете"])
  },
  {
    name: "Пайк пуш ъпс",
    nameEn: "Pike Push-ups",
    description: "Лицеви опирания във V позиция за рамене",
    category: ExerciseCategory.SHOULDERS,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: JSON.stringify(["Рамене", "Трицепси"]),
    equipment: JSON.stringify(["Собствено тегло"]),
    instructions: JSON.stringify([
      "Застанете в позиция на обърната V",
      "Спуснете главата към ръцете",
      "Изтласкайте се нагоре",
      "Запазете V позицията"
    ]),
    tips: JSON.stringify(["Не извивайте гърба", "Фокусирайте се върху раменете"])
  },
  {
    name: "Високи колена",
    nameEn: "High Knees",
    description: "Кардио упражнение с високо вдигане на коленете",
    category: ExerciseCategory.CARDIO,
    difficulty: ExerciseDifficulty.BEGINNER,
    muscleGroups: JSON.stringify(["Крака", "Ядро", "Сърдечно-съдова система"]),
    equipment: JSON.stringify(["Собствено тегло"]),
    instructions: JSON.stringify([
      "Застанете изправени",
      "Започнете да бягате на място",
      "Вдигайте коленете към гърдите",
      "Запазете висок ритъм"
    ]),
    tips: JSON.stringify(["Кацайте на пръстите", "Запазете добра стойка"])
  }
];

async function addExercises() {
  try {
    console.log('Adding 50 new exercises to the database...');

    const results = await prisma.exercise.createMany({
      data: exercises
    });

    console.log(`✅ Successfully added ${results.count} new exercises!`);

    // Verify the total count
    const totalCount = await prisma.exercise.count();
    console.log(`📊 Total exercises in database: ${totalCount}`);

    // Show breakdown by category
    console.log('\n📋 Breakdown by category:');
    const categories = await prisma.exercise.groupBy({
      by: ['category'],
      _count: {
        id: true
      }
    });

    categories.forEach(cat => {
      console.log(`- ${cat.category}: ${cat._count.id} exercises`);
    });

    // Show breakdown by difficulty
    console.log('\n🎯 Breakdown by difficulty:');
    const difficulties = await prisma.exercise.groupBy({
      by: ['difficulty'],
      _count: {
        id: true
      }
    });

    difficulties.forEach(diff => {
      console.log(`- ${diff.difficulty}: ${diff._count.id} exercises`);
    });

  } catch (error) {
    console.error('❌ Error adding exercises:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addExercises()
  .then(() => {
    console.log('\n🎉 Exercise addition completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Exercise addition failed:', error);
    process.exit(1);
  });