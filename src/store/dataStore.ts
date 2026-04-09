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
  }
];

const weeklyMealPlan: WeeklyMealPlan[] = [
  {
    day: "Monday",
    meals: [
      buildMeal("mon-1", "Protein breakfast", "07:30", 410, "Start full and steady", 26, 38, 16, ["Oats", "Eggs", "Berries"]),
      buildMeal("mon-2", "Lean lunch", "12:30", 540, "Keep energy stable", 42, 58, 14, ["Chicken", "Rice", "Greens"]),
      buildMeal("mon-3", "Smart snack", "16:00", 210, "Avoid evening overeating", 6, 22, 11, ["Apple", "Almonds"]),
      buildMeal("mon-4", "Recovery dinner", "19:00", 460, "Hit protein before sleep", 36, 18, 24, ["Salmon", "Vegetables", "Olive oil"])
    ]
  },
  {
    day: "Tuesday",
    meals: [
      buildMeal("tue-1", "Yogurt bowl", "08:00", 280, "Light but high-protein", 24, 24, 8, ["Greek yogurt", "Fruit", "Granola"]),
      buildMeal("tue-2", "Chicken rice plate", "13:00", 540, "Main fuel block", 42, 58, 14, ["Chicken", "Rice", "Vegetables"]),
      buildMeal("tue-3", "Protein shake", "17:00", 190, "Easy recovery", 30, 8, 4, ["Whey", "Milk", "Banana"]),
      buildMeal("tue-4", "Fiber-heavy dinner", "20:00", 460, "End day with volume", 36, 18, 24, ["Fish", "Salad", "Beans"])
    ]
  },
  {
    day: "Wednesday",
    meals: [
      buildMeal("wed-1", "Oats and eggs", "07:30", 410, "Morning satiety", 26, 38, 16, ["Oats", "Eggs"]),
      buildMeal("wed-2", "Chicken rice plate", "12:30", 540, "Lunch anchor", 42, 58, 14, ["Chicken", "Rice"]),
      buildMeal("wed-3", "Apple and almonds", "15:30", 210, "Snack before movement", 6, 22, 11, ["Apple", "Almonds"]),
      buildMeal("wed-4", "Salmon salad", "19:30", 460, "Lower-carb finish", 36, 18, 24, ["Salmon", "Greens"])
    ]
  },
  {
    day: "Thursday",
    meals: [
      buildMeal("thu-1", "Yogurt bowl", "08:00", 280, "Quick office breakfast", 24, 24, 8, ["Greek yogurt", "Fruit"]),
      buildMeal("thu-2", "Chicken rice plate", "12:30", 540, "Core meal", 42, 58, 14, ["Chicken", "Rice"]),
      buildMeal("thu-3", "Protein shake", "16:30", 190, "Keep protein high", 30, 8, 4, ["Whey"]),
      buildMeal("thu-4", "Salmon salad", "19:30", 460, "Calmer evening meal", 36, 18, 24, ["Salmon", "Salad"])
    ]
  },
  {
    day: "Friday",
    meals: [
      buildMeal("fri-1", "Oats and eggs", "07:30", 410, "Strong start", 26, 38, 16, ["Oats", "Eggs"]),
      buildMeal("fri-2", "Chicken rice plate", "12:00", 540, "Pre-workout fuel", 42, 58, 14, ["Chicken", "Rice"]),
      buildMeal("fri-3", "Protein shake", "16:00", 190, "Fast recovery", 30, 8, 4, ["Whey", "Milk"]),
      buildMeal("fri-4", "Salmon salad", "19:00", 460, "Hit the weekly calorie cap", 36, 18, 24, ["Salmon", "Vegetables"])
    ]
  },
  {
    day: "Saturday",
    meals: [
      buildMeal("sat-1", "Yogurt bowl", "09:00", 280, "Lighter late breakfast", 24, 24, 8, ["Greek yogurt", "Fruit"]),
      buildMeal("sat-2", "Chicken rice plate", "13:30", 540, "Weekend main meal", 42, 58, 14, ["Chicken", "Rice"]),
      buildMeal("sat-3", "Apple and almonds", "17:00", 210, "Portable snack", 6, 22, 11, ["Apple", "Almonds"]),
      buildMeal("sat-4", "Salmon salad", "20:00", 460, "Controlled dinner", 36, 18, 24, ["Salmon", "Greens"])
    ]
  },
  {
    day: "Sunday",
    meals: [
      buildMeal("sun-1", "Oats and eggs", "08:30", 410, "Reset for next week", 26, 38, 16, ["Oats", "Eggs"]),
      buildMeal("sun-2", "Chicken rice plate", "13:00", 540, "Meal prep style lunch", 42, 58, 14, ["Chicken", "Rice"]),
      buildMeal("sun-3", "Protein shake", "17:00", 190, "Simple protein bump", 30, 8, 4, ["Whey"]),
      buildMeal("sun-4", "Salmon salad", "19:30", 460, "Finish the week clean", 36, 18, 24, ["Salmon", "Salad"])
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

const workoutsByLocation: Record<UserLocation, DailyWorkoutPlan[]> = {
  gym: [
    buildWorkout("gym-mon", "Monday", "Lower body strength", 55, 360, "gym", [
      { name: "Back squat", sets: 4, reps: "6-8", note: "Controlled depth" },
      { name: "Romanian deadlift", sets: 3, reps: "8-10", note: "Slow eccentric" },
      { name: "Walking lunges", sets: 3, reps: "12 / leg", note: "Long stride" }
    ]),
    buildWorkout("gym-tue", "Tuesday", "Upper push", 50, 320, "gym", [
      { name: "Bench press", sets: 4, reps: "6-8", note: "Pause first rep" },
      { name: "Incline dumbbell press", sets: 3, reps: "10-12", note: "Smooth tempo" },
      { name: "Cable triceps pressdown", sets: 3, reps: "12-15", note: "Full lockout" }
    ]),
    buildWorkout("gym-wed", "Wednesday", "Recovery cardio", 35, 240, "gym", [
      { name: "Incline treadmill walk", sets: 1, reps: "25 min", note: "Steady pace" },
      { name: "Mobility circuit", sets: 2, reps: "8 min", note: "Hips and thoracic spine" }
    ]),
    buildWorkout("gym-thu", "Thursday", "Upper pull", 50, 310, "gym", [
      { name: "Lat pulldown", sets: 4, reps: "8-10", note: "Drive elbows down" },
      { name: "Seated cable row", sets: 3, reps: "10-12", note: "Pause at torso" },
      { name: "Dumbbell curls", sets: 3, reps: "12-15", note: "No swing" }
    ]),
    buildWorkout("gym-fri", "Friday", "Full body conditioning", 45, 380, "gym", [
      { name: "Kettlebell swings", sets: 4, reps: "15", note: "Explosive hips" },
      { name: "Goblet squat", sets: 3, reps: "12", note: "Tall chest" },
      { name: "Row erg", sets: 5, reps: "1 min hard", note: "1 min easy between rounds" }
    ]),
    buildWorkout("gym-sat", "Saturday", "Core and mobility", 30, 180, "gym", [
      { name: "Cable chop", sets: 3, reps: "12 / side", note: "Brace midline" },
      { name: "Hanging knee raise", sets: 3, reps: "10-12", note: "No swing" },
      { name: "Stretch flow", sets: 1, reps: "12 min", note: "Slow breathing" }
    ]),
    buildWorkout("gym-sun", "Sunday", "Full rest", 20, 90, "gym", [
      { name: "Easy walk", sets: 1, reps: "20 min", note: "Keep steps high" }
    ])
  ],
  home: [
    buildWorkout("home-mon", "Monday", "Legs and glutes", 35, 250, "home", [
      { name: "Bodyweight squat", sets: 4, reps: "15", note: "Constant tension" },
      { name: "Split squat", sets: 3, reps: "12 / leg", note: "Use chair for balance" },
      { name: "Glute bridge", sets: 4, reps: "20", note: "Pause at top" }
    ]),
    buildWorkout("home-tue", "Tuesday", "Push day", 30, 220, "home", [
      { name: "Push-up", sets: 4, reps: "8-15", note: "Elevate hands if needed" },
      { name: "Chair dip", sets: 3, reps: "10-12", note: "Controlled depth" },
      { name: "Pike push-up", sets: 3, reps: "8-10", note: "Shoulder focus" }
    ]),
    buildWorkout("home-wed", "Wednesday", "Walk and mobility", 30, 170, "home", [
      { name: "Brisk walk", sets: 1, reps: "20 min", note: "Go outside if possible" },
      { name: "Mobility flow", sets: 2, reps: "5 min", note: "Hips, hamstrings, shoulders" }
    ]),
    buildWorkout("home-thu", "Thursday", "Pull and posture", 30, 210, "home", [
      { name: "Backpack row", sets: 4, reps: "12", note: "Squeeze shoulder blades" },
      { name: "Reverse snow angel", sets: 3, reps: "15", note: "Slow tempo" },
      { name: "Bird dog", sets: 3, reps: "10 / side", note: "Keep spine neutral" }
    ]),
    buildWorkout("home-fri", "Friday", "Conditioning", 28, 260, "home", [
      { name: "High knees", sets: 5, reps: "30 sec", note: "30 sec rest" },
      { name: "Mountain climber", sets: 4, reps: "30 sec", note: "Steady breathing" },
      { name: "Jump squat", sets: 3, reps: "12", note: "Soft landing" }
    ]),
    buildWorkout("home-sat", "Saturday", "Core focus", 24, 180, "home", [
      { name: "Plank", sets: 4, reps: "40 sec", note: "Ribs down" },
      { name: "Dead bug", sets: 3, reps: "12 / side", note: "Move slowly" },
      { name: "Side plank", sets: 3, reps: "30 sec / side", note: "Keep hips high" }
    ]),
    buildWorkout("home-sun", "Sunday", "Recovery", 20, 90, "home", [
      { name: "Easy walk", sets: 1, reps: "20 min", note: "Keep moving" }
    ])
  ],
  office: [
    buildWorkout("office-mon", "Monday", "Desk break lower body", 18, 110, "office", [
      { name: "Chair squat", sets: 3, reps: "15", note: "Stand fully tall" },
      { name: "Calf raise", sets: 3, reps: "20", note: "Slow lower" },
      { name: "Wall sit", sets: 3, reps: "30 sec", note: "Flat back" }
    ]),
    buildWorkout("office-tue", "Tuesday", "Upper body reset", 16, 95, "office", [
      { name: "Desk incline push-up", sets: 3, reps: "12", note: "Hands on desk edge" },
      { name: "Band pull-apart", sets: 3, reps: "20", note: "If no band, do scap squeezes" },
      { name: "Shoulder circles", sets: 2, reps: "45 sec", note: "Forward and backward" }
    ]),
    buildWorkout("office-wed", "Wednesday", "Steps challenge", 20, 130, "office", [
      { name: "Stair climb", sets: 6, reps: "2 floors", note: "Walk back down" },
      { name: "Hallway walk", sets: 2, reps: "5 min", note: "After meals" }
    ]),
    buildWorkout("office-thu", "Thursday", "Posture and core", 15, 90, "office", [
      { name: "Standing knee drive", sets: 3, reps: "12 / side", note: "Brace abs" },
      { name: "Standing side bend", sets: 3, reps: "12 / side", note: "Slow control" },
      { name: "Wall angel", sets: 3, reps: "10", note: "Keep ribs tucked" }
    ]),
    buildWorkout("office-fri", "Friday", "Energy circuit", 18, 120, "office", [
      { name: "March in place", sets: 3, reps: "1 min", note: "Raise knees high" },
      { name: "Desk squat", sets: 3, reps: "15", note: "Use desk for balance" },
      { name: "Fast stair walk", sets: 4, reps: "1 min", note: "Recover 1 min" }
    ]),
    buildWorkout("office-sat", "Saturday", "Weekend mobility", 15, 80, "office", [
      { name: "Neck and shoulder mobility", sets: 2, reps: "4 min", note: "Gentle range" },
      { name: "Hip opener flow", sets: 2, reps: "4 min", note: "Slow breathing" }
    ]),
    buildWorkout("office-sun", "Sunday", "Light reset", 15, 70, "office", [
      { name: "Walk", sets: 1, reps: "15 min", note: "Easy pace" }
    ])
  }
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

export const calculateMacroTargets = (profile: HealthProfile): MacroSet => {
  const calories = calculateGoalCalories(profile);
  const protein = Math.round(profile.currentWeightKg * 1.9);
  const fat = Math.round(profile.currentWeightKg * 0.8);
  const carbs = Math.max(80, Math.round((calories - protein * 4 - fat * 9) / 4));

  return { protein, carbs, fat };
};

export const getTodaysMealPlan = (plan: WeeklyMealPlan[]) =>
  plan.find((item) => item.day === todayDay) ?? plan[0];

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
