import { create } from "zustand";

export type Sex = "male" | "female";
export type GoalDirection = "lose" | "gain";
export type ActivityLevel = "light" | "moderate" | "active";
export type UserLocation = "gym" | "home" | "office";
export type DayKey =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type MacroSet = {
  protein: number;
  carbs: number;
  fat: number;
};

export type HealthProfile = {
  name: string;
  sex: Sex;
  age: number;
  heightCm: number;
  currentWeightKg: number;
  goalWeightKg: number;
  activityLevel: ActivityLevel;
  goalDirection: GoalDirection;
};

export type FoodItem = {
  id: string;
  name: string;
  serving: string;
  kcal: number;
  macros: MacroSet;
  note: string;
};

export type FoodLog = {
  id: string;
  foodId: string;
  eatenAt: string;
};

export type PlannedMeal = {
  id: string;
  title: string;
  time: string;
  kcal: number;
  goal: string;
  foods: string[];
  macros: MacroSet;
};

export type WeeklyMealPlan = {
  day: DayKey;
  meals: PlannedMeal[];
};

export type WorkoutExercise = {
  name: string;
  sets: number;
  reps: string;
  note: string;
  googleUrl?: string;
  youtubeUrl?: string;
};

export type DailyWorkoutPlan = {
  id: string;
  day: DayKey;
  focus: string;
  durationMin: number;
  estimatedBurn: number;
  location: UserLocation;
  exercises: WorkoutExercise[];
};

export type WorkoutLog = {
  id: string;
  workoutId: string;
  completedAt: string;
};

export type WeightLog = {
  id: string;
  date: string;
  value: number;
};

type DataState = {
  profile: HealthProfile;
  preferredLocation: UserLocation;
  foodCatalog: FoodItem[];
  weeklyMealPlan: WeeklyMealPlan[];
  monthlyMealThemes: string[];
  workoutsByLocation: Record<UserLocation, DailyWorkoutPlan[]>;
  foodLogs: FoodLog[];
  workoutLogs: WorkoutLog[];
  weightLogs: WeightLog[];
  updateProfile: (updates: Partial<HealthProfile>) => void;
  setPreferredLocation: (location: UserLocation) => void;
  addFoodLog: (foodId: string) => void;
  completeWorkout: (workoutId: string) => void;
};

const activityMultipliers: Record<ActivityLevel, number> = {
  light: 1.375,
  moderate: 1.55,
  active: 1.725
};

const orderedDays: DayKey[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric"
});

const buildMeal = (
  id: string,
  title: string,
  time: string,
  kcal: number,
  goal: string,
  protein: number,
  carbs: number,
  fat: number,
  foods: string[]
): PlannedMeal => ({
  id,
  title,
  time,
  kcal,
  goal,
  foods,
  macros: { protein, carbs, fat }
});

const foodCatalog: FoodItem[] = [
  {
    id: "food-greek-yogurt",
    name: "Greek yogurt bowl",
    serving: "1 bowl",
    kcal: 280,
    macros: { protein: 24, carbs: 24, fat: 8 },
    note: "Good high-protein breakfast or snack."
  },
  {
    id: "food-chicken-rice",
    name: "Chicken rice plate",
    serving: "1 plate",
    kcal: 540,
    macros: { protein: 42, carbs: 58, fat: 14 },
    note: "Balanced lunch for training days."
  },
  {
    id: "food-salmon-salad",
    name: "Salmon salad",
    serving: "1 plate",
    kcal: 460,
    macros: { protein: 36, carbs: 18, fat: 24 },
    note: "Lower-carb dinner with healthy fats."
  },
  {
    id: "food-protein-shake",
    name: "Protein shake",
    serving: "1 shaker",
    kcal: 190,
    macros: { protein: 30, carbs: 8, fat: 4 },
    note: "Fast recovery option after exercise."
  },
  {
    id: "food-apple-almonds",
    name: "Apple and almonds",
    serving: "1 snack pack",
    kcal: 210,
    macros: { protein: 6, carbs: 22, fat: 11 },
    note: "Portable office-friendly snack."
  },
  {
    id: "food-oats-eggs",
    name: "Oats and eggs",
    serving: "1 breakfast set",
    kcal: 410,
    macros: { protein: 26, carbs: 38, fat: 16 },
    note: "Filling breakfast before a busy day."
  },
  {
    id: "food-banana",
    name: "Banana",
    serving: "1 medium",
    kcal: 105,
    macros: { protein: 1, carbs: 27, fat: 0 },
    note: "Fast pre-workout carbs."
  },
  {
    id: "food-egg",
    name: "Egg",
    serving: "1 large egg",
    kcal: 78,
    macros: { protein: 6, carbs: 1, fat: 5 },
    note: "Simple protein and fat source."
  },
  {
    id: "food-rice",
    name: "Cooked white rice",
    serving: "1 cup",
    kcal: 205,
    macros: { protein: 4, carbs: 45, fat: 0 },
    note: "Reliable carb source for training days."
  },
  {
    id: "food-chicken-breast",
    name: "Chicken breast",
    serving: "150 g cooked",
    kcal: 248,
    macros: { protein: 46, carbs: 0, fat: 5 },
    note: "Lean protein with high satiety."
  },
  {
    id: "food-beef-bowl",
    name: "Beef rice bowl",
    serving: "1 bowl",
    kcal: 610,
    macros: { protein: 35, carbs: 58, fat: 24 },
    note: "Higher-calorie lunch or dinner."
  },
  {
    id: "food-avocado-toast",
    name: "Avocado toast",
    serving: "2 slices",
    kcal: 320,
    macros: { protein: 8, carbs: 30, fat: 18 },
    note: "Popular breakfast with healthy fats."
  },
  {
    id: "food-turkey-wrap",
    name: "Turkey wrap",
    serving: "1 wrap",
    kcal: 390,
    macros: { protein: 28, carbs: 34, fat: 14 },
    note: "Portable balanced meal."
  },
  {
    id: "food-cottage-cheese",
    name: "Cottage cheese",
    serving: "200 g",
    kcal: 180,
    macros: { protein: 24, carbs: 8, fat: 5 },
    note: "High-protein snack with slow digestion."
  },
  {
    id: "food-protein-bar",
    name: "Protein bar",
    serving: "1 bar",
    kcal: 220,
    macros: { protein: 20, carbs: 23, fat: 7 },
    note: "Emergency protein for busy days."
  },
  {
    id: "food-caesar-salad",
    name: "Chicken Caesar salad",
    serving: "1 bowl",
    kcal: 430,
    macros: { protein: 32, carbs: 18, fat: 24 },
    note: "Lighter meal if dressing is controlled."
  },
  {
    id: "food-sushi-roll",
    name: "Salmon sushi roll",
    serving: "8 pieces",
    kcal: 300,
    macros: { protein: 15, carbs: 42, fat: 8 },
    note: "Moderate calories, easy to overeat if ordering multiple rolls."
  },
  {
    id: "food-pizza-slice",
    name: "Pepperoni pizza slice",
    serving: "1 slice",
    kcal: 285,
    macros: { protein: 12, carbs: 33, fat: 12 },
    note: "Useful for estimating takeout calories."
  },
  {
    id: "food-burger",
    name: "Cheeseburger",
    serving: "1 burger",
    kcal: 520,
    macros: { protein: 30, carbs: 40, fat: 26 },
    note: "Restaurant-style burger estimate."
  },
  {
    id: "food-fries",
    name: "French fries",
    serving: "1 medium serving",
    kcal: 365,
    macros: { protein: 4, carbs: 48, fat: 17 },
    note: "Calories rise quickly with sauces."
  },
  {
    id: "food-latte",
    name: "Cafe latte",
    serving: "1 medium",
    kcal: 140,
    macros: { protein: 8, carbs: 13, fat: 6 },
    note: "Liquid calories count too."
  },
  {
    id: "food-oatmeal",
    name: "Oatmeal",
    serving: "1 cooked bowl",
    kcal: 180,
    macros: { protein: 6, carbs: 30, fat: 3 },
    note: "Great base for a filling breakfast."
  },
  {
    id: "food-tuna-sandwich",
    name: "Tuna sandwich",
    serving: "1 sandwich",
    kcal: 340,
    macros: { protein: 24, carbs: 30, fat: 12 },
    note: "Balanced lunch option."
  },
  {
    id: "food-almonds",
    name: "Almonds",
    serving: "30 g",
    kcal: 174,
    macros: { protein: 6, carbs: 6, fat: 15 },
    note: "Healthy, but energy-dense."
  },
  {
    id: "food-apple",
    name: "Apple",
    serving: "1 medium",
    kcal: 95,
    macros: { protein: 0, carbs: 25, fat: 0 },
    note: "Simple lower-calorie snack."
  },
  {
    id: "food-ice-cream",
    name: "Ice cream",
    serving: "1 scoop",
    kcal: 140,
    macros: { protein: 2, carbs: 16, fat: 7 },
    note: "Good to log small treats accurately."
  }
];

const weeklyMealPlan: WeeklyMealPlan[] = [
  {
    day: "Monday",
    meals: [
      buildMeal("mon-1", "Protein breakfast", "07:30", 410, "Start full and steady", 26, 38, 16, [
        "Oats",
        "Eggs",
        "Berries"
      ]),
      buildMeal("mon-2", "Lean lunch", "12:30", 540, "Keep energy stable", 42, 58, 14, [
        "Chicken",
        "Rice",
        "Greens"
      ]),
      buildMeal("mon-3", "Smart snack", "16:00", 210, "Avoid evening overeating", 6, 22, 11, [
        "Apple",
        "Almonds"
      ]),
      buildMeal("mon-4", "Recovery dinner", "19:00", 460, "Hit protein before sleep", 36, 18, 24, [
        "Salmon",
        "Vegetables",
        "Olive oil"
      ])
    ]
  },
  {
    day: "Tuesday",
    meals: [
      buildMeal("tue-1", "Yogurt bowl", "08:00", 280, "Light but high-protein", 24, 24, 8, [
        "Greek yogurt",
        "Fruit",
        "Granola"
      ]),
      buildMeal("tue-2", "Chicken rice plate", "13:00", 540, "Main fuel block", 42, 58, 14, [
        "Chicken",
        "Rice",
        "Vegetables"
      ]),
      buildMeal("tue-3", "Protein shake", "17:00", 190, "Easy recovery", 30, 8, 4, [
        "Whey",
        "Milk",
        "Banana"
      ]),
      buildMeal("tue-4", "Fiber-heavy dinner", "20:00", 460, "End day with volume", 36, 18, 24, [
        "Fish",
        "Salad",
        "Beans"
      ])
    ]
  },
  {
    day: "Wednesday",
    meals: [
      buildMeal("wed-1", "Oats and eggs", "07:30", 410, "Morning satiety", 26, 38, 16, [
        "Oats",
        "Eggs"
      ]),
      buildMeal("wed-2", "Chicken rice plate", "12:30", 540, "Lunch anchor", 42, 58, 14, [
        "Chicken",
        "Rice"
      ]),
      buildMeal("wed-3", "Apple and almonds", "15:30", 210, "Snack before movement", 6, 22, 11, [
        "Apple",
        "Almonds"
      ]),
      buildMeal("wed-4", "Salmon salad", "19:30", 460, "Lower-carb finish", 36, 18, 24, [
        "Salmon",
        "Greens"
      ])
    ]
  },
  {
    day: "Thursday",
    meals: [
      buildMeal("thu-1", "Yogurt bowl", "08:00", 280, "Quick office breakfast", 24, 24, 8, [
        "Greek yogurt",
        "Fruit"
      ]),
      buildMeal("thu-2", "Chicken rice plate", "12:30", 540, "Core meal", 42, 58, 14, [
        "Chicken",
        "Rice"
      ]),
      buildMeal("thu-3", "Protein shake", "16:30", 190, "Keep protein high", 30, 8, 4, [
        "Whey"
      ]),
      buildMeal("thu-4", "Salmon salad", "19:30", 460, "Calmer evening meal", 36, 18, 24, [
        "Salmon",
        "Salad"
      ])
    ]
  },
  {
    day: "Friday",
    meals: [
      buildMeal("fri-1", "Oats and eggs", "07:30", 410, "Strong start", 26, 38, 16, [
        "Oats",
        "Eggs"
      ]),
      buildMeal("fri-2", "Chicken rice plate", "12:00", 540, "Pre-workout fuel", 42, 58, 14, [
        "Chicken",
        "Rice"
      ]),
      buildMeal("fri-3", "Protein shake", "16:00", 190, "Fast recovery", 30, 8, 4, [
        "Whey",
        "Milk"
      ]),
      buildMeal("fri-4", "Salmon salad", "19:00", 460, "Hit the weekly calorie cap", 36, 18, 24, [
        "Salmon",
        "Vegetables"
      ])
    ]
  },
  {
    day: "Saturday",
    meals: [
      buildMeal("sat-1", "Yogurt bowl", "09:00", 280, "Lighter late breakfast", 24, 24, 8, [
        "Greek yogurt",
        "Fruit"
      ]),
      buildMeal("sat-2", "Chicken rice plate", "13:30", 540, "Weekend main meal", 42, 58, 14, [
        "Chicken",
        "Rice"
      ]),
      buildMeal("sat-3", "Apple and almonds", "17:00", 210, "Portable snack", 6, 22, 11, [
        "Apple",
        "Almonds"
      ]),
      buildMeal("sat-4", "Salmon salad", "20:00", 460, "Controlled dinner", 36, 18, 24, [
        "Salmon",
        "Greens"
      ])
    ]
  },
  {
    day: "Sunday",
    meals: [
      buildMeal("sun-1", "Oats and eggs", "08:30", 410, "Reset for next week", 26, 38, 16, [
        "Oats",
        "Eggs"
      ]),
      buildMeal("sun-2", "Chicken rice plate", "13:00", 540, "Meal prep style lunch", 42, 58, 14, [
        "Chicken",
        "Rice"
      ]),
      buildMeal("sun-3", "Protein shake", "17:00", 190, "Simple protein bump", 30, 8, 4, [
        "Whey"
      ]),
      buildMeal("sun-4", "Salmon salad", "19:30", 460, "Finish the week clean", 36, 18, 24, [
        "Salmon",
        "Salad"
      ])
    ]
  }
];

const buildWorkout = (
  id: string,
  day: DayKey,
  focus: string,
  durationMin: number,
  estimatedBurn: number,
  location: UserLocation,
  exercises: WorkoutExercise[]
): DailyWorkoutPlan => ({
  id,
  day,
  focus,
  durationMin,
  estimatedBurn,
  location,
  exercises
});

const buildExercise = (
  name: string,
  sets: number,
  reps: string,
  note: string
): WorkoutExercise => ({
  name,
  sets,
  reps,
  note,
  googleUrl: `https://www.google.com/search?q=${encodeURIComponent(`${name} exercise form`)}`,
  youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${name} exercise tutorial`
  )}`
});

const workoutsByLocation: Record<UserLocation, DailyWorkoutPlan[]> = {
  gym: [
    buildWorkout("gym-mon", "Monday", "Lower body strength", 55, 360, "gym", [
      buildExercise("Back squat", 4, "6-8", "Controlled depth"),
      buildExercise("Romanian deadlift", 3, "8-10", "Slow eccentric"),
      buildExercise("Walking lunges", 3, "12 / leg", "Long stride"),
      buildExercise("Leg press", 3, "10-12", "Drive through full foot"),
      buildExercise("Standing calf raise", 3, "15-20", "Pause at the top")
    ]),
    buildWorkout("gym-tue", "Tuesday", "Upper push", 50, 320, "gym", [
      buildExercise("Bench press", 4, "6-8", "Pause first rep"),
      buildExercise("Incline dumbbell press", 3, "10-12", "Smooth tempo"),
      buildExercise("Seated dumbbell shoulder press", 3, "10-12", "Brace core"),
      buildExercise("Cable chest fly", 3, "12-15", "Hug motion"),
      buildExercise("Cable triceps pressdown", 3, "12-15", "Full lockout")
    ]),
    buildWorkout("gym-wed", "Wednesday", "Recovery cardio", 35, 240, "gym", [
      buildExercise("Incline treadmill walk", 1, "25 min", "Steady pace"),
      buildExercise("Stationary bike", 1, "10 min", "Easy spin cooldown"),
      buildExercise("Mobility circuit", 2, "8 min", "Hips and thoracic spine"),
      buildExercise("Foam rolling", 1, "8 min", "Calves, glutes, lats")
    ]),
    buildWorkout("gym-thu", "Thursday", "Upper pull", 50, 310, "gym", [
      buildExercise("Lat pulldown", 4, "8-10", "Drive elbows down"),
      buildExercise("Seated cable row", 3, "10-12", "Pause at torso"),
      buildExercise("Chest-supported dumbbell row", 3, "10-12", "Keep chest planted"),
      buildExercise("Face pull", 3, "12-15", "Lead with elbows"),
      buildExercise("Dumbbell curls", 3, "12-15", "No swing")
    ]),
    buildWorkout("gym-fri", "Friday", "Full body conditioning", 45, 380, "gym", [
      buildExercise("Kettlebell swings", 4, "15", "Explosive hips"),
      buildExercise("Goblet squat", 3, "12", "Tall chest"),
      buildExercise("Battle ropes", 4, "30 sec", "Fast but controlled"),
      buildExercise("Farmer carry", 4, "30 m", "Shoulders down and back"),
      buildExercise("Row erg", 5, "1 min hard", "1 min easy between rounds")
    ]),
    buildWorkout("gym-sat", "Saturday", "Core and mobility", 30, 180, "gym", [
      buildExercise("Cable chop", 3, "12 / side", "Brace midline"),
      buildExercise("Hanging knee raise", 3, "10-12", "No swing"),
      buildExercise("Pallof press", 3, "12 / side", "Anti-rotation focus"),
      buildExercise("Back extension", 3, "12-15", "Controlled range"),
      buildExercise("Stretch flow", 1, "12 min", "Slow breathing")
    ]),
    buildWorkout("gym-sun", "Sunday", "Full rest", 20, 90, "gym", [
      buildExercise("Easy walk", 1, "20 min", "Keep steps high"),
      buildExercise("Light mobility", 1, "10 min", "Relax hips and shoulders")
    ])
  ],
  home: [
    buildWorkout("home-mon", "Monday", "Legs and glutes", 35, 250, "home", [
      buildExercise("Bodyweight squat", 4, "15", "Constant tension"),
      buildExercise("Split squat", 3, "12 / leg", "Use chair for balance"),
      buildExercise("Glute bridge", 4, "20", "Pause at top"),
      buildExercise("Reverse lunge", 3, "10 / leg", "Step back softly"),
      buildExercise("Single-leg Romanian deadlift", 3, "10 / leg", "Reach hips back")
    ]),
    buildWorkout("home-tue", "Tuesday", "Push day", 30, 220, "home", [
      buildExercise("Push-up", 4, "8-15", "Elevate hands if needed"),
      buildExercise("Chair dip", 3, "10-12", "Controlled depth"),
      buildExercise("Pike push-up", 3, "8-10", "Shoulder focus"),
      buildExercise("Tempo push-up", 3, "6-8", "Three-second lower"),
      buildExercise("Plank shoulder tap", 3, "20 taps", "Keep hips level")
    ]),
    buildWorkout("home-wed", "Wednesday", "Walk and mobility", 30, 170, "home", [
      buildExercise("Brisk walk", 1, "20 min", "Go outside if possible"),
      buildExercise("Mobility flow", 2, "5 min", "Hips, hamstrings, shoulders"),
      buildExercise("World's greatest stretch", 2, "5 / side", "Slow rotation"),
      buildExercise("Cat-cow stretch", 2, "10 reps", "Move with breathing")
    ]),
    buildWorkout("home-thu", "Thursday", "Pull and posture", 30, 210, "home", [
      buildExercise("Backpack row", 4, "12", "Squeeze shoulder blades"),
      buildExercise("Reverse snow angel", 3, "15", "Slow tempo"),
      buildExercise("Bird dog", 3, "10 / side", "Keep spine neutral"),
      buildExercise("Doorway row", 3, "10-12", "Lean back with control"),
      buildExercise("Superman hold", 3, "20 sec", "Lift chest gently")
    ]),
    buildWorkout("home-fri", "Friday", "Conditioning", 28, 260, "home", [
      buildExercise("High knees", 5, "30 sec", "30 sec rest"),
      buildExercise("Mountain climber", 4, "30 sec", "Steady breathing"),
      buildExercise("Jump squat", 3, "12", "Soft landing"),
      buildExercise("Skater jump", 3, "16 total", "Jump side to side"),
      buildExercise("Burpee", 3, "10", "Smooth pace over speed")
    ]),
    buildWorkout("home-sat", "Saturday", "Core focus", 24, 180, "home", [
      buildExercise("Plank", 4, "40 sec", "Ribs down"),
      buildExercise("Dead bug", 3, "12 / side", "Move slowly"),
      buildExercise("Side plank", 3, "30 sec / side", "Keep hips high"),
      buildExercise("Russian twist", 3, "20 total", "Rotate through torso"),
      buildExercise("Hollow body hold", 3, "20 sec", "Lower back pressed down")
    ]),
    buildWorkout("home-sun", "Sunday", "Recovery", 20, 90, "home", [
      buildExercise("Easy walk", 1, "20 min", "Keep moving"),
      buildExercise("Stretch flow", 1, "10 min", "Release hips and chest")
    ])
  ],
  office: [
    buildWorkout("office-mon", "Monday", "Desk break lower body", 18, 110, "office", [
      buildExercise("Chair squat", 3, "15", "Stand fully tall"),
      buildExercise("Calf raise", 3, "20", "Slow lower"),
      buildExercise("Wall sit", 3, "30 sec", "Flat back"),
      buildExercise("Step-up", 3, "12 / leg", "Use sturdy step"),
      buildExercise("Standing hamstring curl", 3, "15 / leg", "Keep knees close")
    ]),
    buildWorkout("office-tue", "Tuesday", "Upper body reset", 16, 95, "office", [
      buildExercise("Desk incline push-up", 3, "12", "Hands on desk edge"),
      buildExercise("Band pull-apart", 3, "20", "If no band, do scap squeezes"),
      buildExercise("Shoulder circles", 2, "45 sec", "Forward and backward"),
      buildExercise("Wall push-up", 3, "15", "Tight body line"),
      buildExercise("Seated posture hold", 3, "30 sec", "Shoulders back and down")
    ]),
    buildWorkout("office-wed", "Wednesday", "Steps challenge", 20, 130, "office", [
      buildExercise("Stair climb", 6, "2 floors", "Walk back down"),
      buildExercise("Hallway walk", 2, "5 min", "After meals"),
      buildExercise("March in place", 3, "1 min", "Pump arms"),
      buildExercise("Standing calf stretch", 2, "30 sec / side", "Recover ankles")
    ]),
    buildWorkout("office-thu", "Thursday", "Posture and core", 15, 90, "office", [
      buildExercise("Standing knee drive", 3, "12 / side", "Brace abs"),
      buildExercise("Standing side bend", 3, "12 / side", "Slow control"),
      buildExercise("Wall angel", 3, "10", "Keep ribs tucked"),
      buildExercise("Standing oblique crunch", 3, "15 / side", "Controlled squeeze"),
      buildExercise("Seated knee tuck", 3, "12", "Sit tall at chair edge")
    ]),
    buildWorkout("office-fri", "Friday", "Energy circuit", 18, 120, "office", [
      buildExercise("March in place", 3, "1 min", "Raise knees high"),
      buildExercise("Desk squat", 3, "15", "Use desk for balance"),
      buildExercise("Fast stair walk", 4, "1 min", "Recover 1 min"),
      buildExercise("Desk mountain climber", 3, "30 sec", "Hands on desk"),
      buildExercise("Standing jumping jack", 3, "40 sec", "Low-impact pace if needed")
    ]),
    buildWorkout("office-sat", "Saturday", "Weekend mobility", 15, 80, "office", [
      buildExercise("Neck and shoulder mobility", 2, "4 min", "Gentle range"),
      buildExercise("Hip opener flow", 2, "4 min", "Slow breathing"),
      buildExercise("Seated spinal twist", 2, "30 sec / side", "Rotate gently"),
      buildExercise("Standing quad stretch", 2, "30 sec / side", "Use wall support")
    ]),
    buildWorkout("office-sun", "Sunday", "Light reset", 15, 70, "office", [
      buildExercise("Walk", 1, "15 min", "Easy pace"),
      buildExercise("Breathing reset", 1, "5 min", "Nasal breathing only")
    ])
  ]
};

const monthlyMealThemes = [
  "Week 1: establish meal timing and protein at every meal.",
  "Week 2: tighten snack quality and hydration habits.",
  "Week 3: rotate fish, chicken, eggs, yogurt, and legumes for variety.",
  "Week 4: review calorie accuracy and portion consistency."
];

const initialFoodLogs: FoodLog[] = [
  { id: "fl-1", foodId: "food-oats-eggs", eatenAt: "07:35" },
  { id: "fl-2", foodId: "food-protein-shake", eatenAt: "11:10" },
  { id: "fl-3", foodId: "food-chicken-rice", eatenAt: "13:05" }
];

const initialWorkoutLogs: WorkoutLog[] = [
  { id: "wl-1", workoutId: "home-mon", completedAt: "2026-04-07T19:10:00.000Z" },
  { id: "wl-2", workoutId: "home-tue", completedAt: "2026-04-08T18:40:00.000Z" }
];

const initialWeightLogs: WeightLog[] = [
  { id: "wt-1", date: "2026-03-12", value: 84.5 },
  { id: "wt-2", date: "2026-03-26", value: 83.7 },
  { id: "wt-3", date: "2026-04-09", value: 82.9 }
];

const today = new Date("2026-04-09T09:00:00.000Z");
const todayDay = orderedDays[(today.getUTCDay() + 6) % 7];

export const calculateBmr = (profile: HealthProfile) => {
  const base =
    10 * profile.currentWeightKg + 6.25 * profile.heightCm - 5 * profile.age;

  return profile.sex === "male" ? Math.round(base + 5) : Math.round(base - 161);
};

export const calculateMaintenanceCalories = (profile: HealthProfile) =>
  Math.round(calculateBmr(profile) * activityMultipliers[profile.activityLevel]);

export const calculateGoalCalories = (profile: HealthProfile) => {
  const maintenance = calculateMaintenanceCalories(profile);
  return profile.goalDirection === "lose" ? maintenance - 450 : maintenance + 250;
};

export const calculateBmi = (profile: HealthProfile) => {
  const heightInMeters = profile.heightCm / 100;
  return Number((profile.currentWeightKg / (heightInMeters * heightInMeters)).toFixed(1));
};

export const getBmiCategory = (bmi: number) => {
  if (bmi < 18.5) {
    return "Underweight";
  }

  if (bmi < 25) {
    return "Healthy";
  }

  if (bmi < 30) {
    return "Overweight";
  }

  return "Obesity range";
};

export const calculateMacroTargets = (profile: HealthProfile): MacroSet => {
  const calories = calculateGoalCalories(profile);
  const protein = Math.round(profile.currentWeightKg * 1.9);
  const fat = Math.round(profile.currentWeightKg * 0.8);
  const carbs = Math.max(80, Math.round((calories - protein * 4 - fat * 9) / 4));

  return { protein, carbs, fat };
};

export const getTodaysMealPlan = (plan: WeeklyMealPlan[]) =>
  plan.find((item) => item.day === todayDay) ?? plan[0];

export const getWorkoutPlanForLocation = (
  location: UserLocation,
  plans: Record<UserLocation, DailyWorkoutPlan[]>
) => plans[location];

export const calculateGoalProjection = (profile: HealthProfile) => {
  const weightDelta = Math.abs(profile.currentWeightKg - profile.goalWeightKg);
  const weeklyRate = profile.goalDirection === "lose" ? 0.45 : 0.25;
  const weeks = Math.max(1, Math.ceil(weightDelta / weeklyRate));
  const eta = new Date(today);

  eta.setUTCDate(eta.getUTCDate() + weeks * 7);

  return {
    weeklyRate,
    weeks,
    etaLabel: dateFormatter.format(eta)
  };
};

export const getConsumedNutrition = (foodLogs: FoodLog[], catalog: FoodItem[]) =>
  foodLogs.reduce(
    (acc, log) => {
      const food = catalog.find((item) => item.id === log.foodId);
      if (!food) {
        return acc;
      }

      acc.kcal += food.kcal;
      acc.macros.protein += food.macros.protein;
      acc.macros.carbs += food.macros.carbs;
      acc.macros.fat += food.macros.fat;
      return acc;
    },
    {
      kcal: 0,
      macros: { protein: 0, carbs: 0, fat: 0 }
    }
  );

export const getWorkoutCompletion = (
  location: UserLocation,
  plans: Record<UserLocation, DailyWorkoutPlan[]>,
  logs: WorkoutLog[]
) => {
  const plan = plans[location];
  const completedIds = new Set(logs.map((item) => item.workoutId));
  const completed = plan.filter((item) => completedIds.has(item.id)).length;

  return {
    completed,
    total: plan.length,
    percentage: completed / plan.length
  };
};

export const getCoachInsights = (
  profile: HealthProfile,
  foodLogs: FoodLog[],
  workoutLogs: WorkoutLog[],
  catalog: FoodItem[],
  location: UserLocation,
  plans: Record<UserLocation, DailyWorkoutPlan[]>
) => {
  const consumed = getConsumedNutrition(foodLogs, catalog);
  const targetCalories = calculateGoalCalories(profile);
  const macros = calculateMacroTargets(profile);
  const completion = getWorkoutCompletion(location, plans, workoutLogs);
  const calorieGap = targetCalories - consumed.kcal;
  const proteinGap = macros.protein - consumed.macros.protein;

  return [
    calorieGap > 250
      ? `You still have about ${calorieGap} kcal left today, so dinner can stay protein-heavy without overshooting your target.`
      : "Your calorie intake is close to target, which is a good setup for steady progress.",
    proteinGap > 20
      ? `Protein is short by roughly ${proteinGap}g, so add yogurt, eggs, chicken, or a shake later today.`
      : "Protein intake is on track, which supports recovery and appetite control.",
    completion.percentage >= 0.5
      ? "Workout consistency is building well this week, so the current plan looks sustainable."
      : "Workout consistency is still ramping up, so keep the sessions short and easy to repeat."
  ];
};

export const useDataStore = create<DataState>((set) => ({
  profile: {
    name: "Alex",
    sex: "male",
    age: 29,
    heightCm: 178,
    currentWeightKg: 82.9,
    goalWeightKg: 75,
    activityLevel: "moderate",
    goalDirection: "lose"
  },
  preferredLocation: "home",
  foodCatalog,
  weeklyMealPlan,
  monthlyMealThemes,
  workoutsByLocation,
  foodLogs: initialFoodLogs,
  workoutLogs: initialWorkoutLogs,
  weightLogs: initialWeightLogs,
  updateProfile: (updates) =>
    set((state) => {
      const nextProfile = {
        ...state.profile,
        ...updates
      };
      const weightChanged =
        typeof updates.currentWeightKg === "number" &&
        updates.currentWeightKg !== state.profile.currentWeightKg;

      return {
        profile: nextProfile,
        weightLogs: weightChanged
          ? [
              ...state.weightLogs,
              {
                id: `wt-${state.weightLogs.length + 1}`,
                date: new Date().toISOString().slice(0, 10),
                value: nextProfile.currentWeightKg
              }
            ]
          : state.weightLogs
      };
    }),
  setPreferredLocation: (location) => set({ preferredLocation: location }),
  addFoodLog: (foodId) =>
    set((state) => ({
      foodLogs: [
        ...state.foodLogs,
        {
          id: `fl-${state.foodLogs.length + 1}`,
          foodId,
          eatenAt: new Date().toISOString()
        }
      ]
    })),
  completeWorkout: (workoutId) =>
    set((state) => {
      if (state.workoutLogs.some((item) => item.workoutId === workoutId)) {
        return state;
      }

      return {
        workoutLogs: [
          ...state.workoutLogs,
          {
            id: `wl-${state.workoutLogs.length + 1}`,
            workoutId,
            completedAt: new Date().toISOString()
          }
        ]
      };
    })
}));
