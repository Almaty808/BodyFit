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

const today = new Date("2026-04-10T09:00:00.000Z");
const todayDay = orderedDays[(today.getUTCDay() + 6) % 7];
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

const meal = (
  id: string,
  title: string,
  time: string,
  kcal: number,
  goal: string,
  macros: MacroSet,
  foods: string[]
): PlannedMeal => ({ id, title, time, kcal, goal, macros, foods });

const workout = (
  id: string,
  day: DayKey,
  focus: string,
  durationMin: number,
  estimatedBurn: number,
  location: UserLocation,
  exercises: WorkoutExercise[]
): DailyWorkoutPlan => ({ id, day, focus, durationMin, estimatedBurn, location, exercises });

const foodCatalog: FoodItem[] = [
  { id: "food-oats-eggs", name: "Oats and eggs", serving: "1 breakfast", kcal: 410, macros: { protein: 26, carbs: 38, fat: 16 }, note: "Filling breakfast before a busy day." },
  { id: "food-yogurt", name: "Greek yogurt bowl", serving: "1 bowl", kcal: 280, macros: { protein: 24, carbs: 24, fat: 8 }, note: "Quick high-protein option." },
  { id: "food-chicken-rice", name: "Chicken rice plate", serving: "1 plate", kcal: 540, macros: { protein: 42, carbs: 58, fat: 14 }, note: "Balanced lunch for training days." },
  { id: "food-protein-shake", name: "Protein shake", serving: "1 shaker", kcal: 190, macros: { protein: 30, carbs: 8, fat: 4 }, note: "Easy recovery snack." },
  { id: "food-apple-almonds", name: "Apple and almonds", serving: "1 snack", kcal: 210, macros: { protein: 6, carbs: 22, fat: 11 }, note: "Portable snack." },
  { id: "food-salmon-salad", name: "Salmon salad", serving: "1 plate", kcal: 460, macros: { protein: 36, carbs: 18, fat: 24 }, note: "Lower-carb dinner." }
];

const weeklyMealPlan: WeeklyMealPlan[] = orderedDays.map((day, index) => ({
  day,
  meals: [
    meal(`${day}-1`, index % 2 === 0 ? "Oats and eggs" : "Yogurt bowl", "08:00", index % 2 === 0 ? 410 : 280, "Start the day with protein.", index % 2 === 0 ? { protein: 26, carbs: 38, fat: 16 } : { protein: 24, carbs: 24, fat: 8 }, index % 2 === 0 ? ["Oats", "Eggs"] : ["Greek yogurt", "Fruit"]),
    meal(`${day}-2`, "Chicken rice plate", "13:00", 540, "Main fuel block for the day.", { protein: 42, carbs: 58, fat: 14 }, ["Chicken", "Rice", "Vegetables"]),
    meal(`${day}-3`, index % 3 === 0 ? "Protein shake" : "Apple and almonds", "16:30", index % 3 === 0 ? 190 : 210, "Keep hunger under control.", index % 3 === 0 ? { protein: 30, carbs: 8, fat: 4 } : { protein: 6, carbs: 22, fat: 11 }, index % 3 === 0 ? ["Whey", "Milk"] : ["Apple", "Almonds"]),
    meal(`${day}-4`, "Salmon salad", "19:30", 460, "Finish with protein and fiber.", { protein: 36, carbs: 18, fat: 24 }, ["Salmon", "Greens"])
  ]
}));

const workoutsByLocation: Record<UserLocation, DailyWorkoutPlan[]> = {
  gym: [
    workout("gym-mon", "Monday", "Lower body strength", 55, 360, "gym", [
      { name: "Back squat", sets: 4, reps: "6-8", note: "Controlled depth" },
      { name: "Romanian deadlift", sets: 3, reps: "8-10", note: "Slow eccentric" }
    ]),
    workout("gym-tue", "Tuesday", "Upper push", 50, 320, "gym", [
      { name: "Bench press", sets: 4, reps: "6-8", note: "Pause first rep" },
      { name: "Incline dumbbell press", sets: 3, reps: "10-12", note: "Smooth tempo" }
    ]),
    workout("gym-wed", "Wednesday", "Recovery cardio", 35, 240, "gym", [
      { name: "Incline treadmill walk", sets: 1, reps: "25 min", note: "Steady pace" },
      { name: "Mobility circuit", sets: 2, reps: "8 min", note: "Hips and thoracic spine" }
    ]),
    workout("gym-thu", "Thursday", "Upper pull", 50, 310, "gym", [
      { name: "Lat pulldown", sets: 4, reps: "8-10", note: "Drive elbows down" },
      { name: "Seated cable row", sets: 3, reps: "10-12", note: "Pause at torso" }
    ]),
    workout("gym-fri", "Friday", "Full body conditioning", 45, 380, "gym", [
      { name: "Kettlebell swings", sets: 4, reps: "15", note: "Explosive hips" },
      { name: "Goblet squat", sets: 3, reps: "12", note: "Tall chest" }
    ]),
    workout("gym-sat", "Saturday", "Core and mobility", 30, 180, "gym", [
      { name: "Cable chop", sets: 3, reps: "12 / side", note: "Brace midline" },
      { name: "Stretch flow", sets: 1, reps: "12 min", note: "Slow breathing" }
    ]),
    workout("gym-sun", "Sunday", "Full rest", 20, 90, "gym", [
      { name: "Easy walk", sets: 1, reps: "20 min", note: "Keep steps high" }
    ])
  ],
  home: [
    workout("home-mon", "Monday", "Legs and glutes", 35, 250, "home", [
      { name: "Bodyweight squat", sets: 4, reps: "15", note: "Constant tension" },
      { name: "Glute bridge", sets: 4, reps: "20", note: "Pause at top" }
    ]),
    workout("home-tue", "Tuesday", "Push day", 30, 220, "home", [
      { name: "Push-up", sets: 4, reps: "8-15", note: "Elevate hands if needed" },
      { name: "Chair dip", sets: 3, reps: "10-12", note: "Controlled depth" }
    ]),
    workout("home-wed", "Wednesday", "Walk and mobility", 30, 170, "home", [
      { name: "Brisk walk", sets: 1, reps: "20 min", note: "Go outside if possible" },
      { name: "Mobility flow", sets: 2, reps: "5 min", note: "Hips and shoulders" }
    ]),
    workout("home-thu", "Thursday", "Pull and posture", 30, 210, "home", [
      { name: "Backpack row", sets: 4, reps: "12", note: "Squeeze shoulder blades" },
      { name: "Bird dog", sets: 3, reps: "10 / side", note: "Keep spine neutral" }
    ]),
    workout("home-fri", "Friday", "Conditioning", 28, 260, "home", [
      { name: "High knees", sets: 5, reps: "30 sec", note: "30 sec rest" },
      { name: "Mountain climber", sets: 4, reps: "30 sec", note: "Steady breathing" }
    ]),
    workout("home-sat", "Saturday", "Core focus", 24, 180, "home", [
      { name: "Plank", sets: 4, reps: "40 sec", note: "Ribs down" },
      { name: "Dead bug", sets: 3, reps: "12 / side", note: "Move slowly" }
    ]),
    workout("home-sun", "Sunday", "Recovery", 20, 90, "home", [
      { name: "Easy walk", sets: 1, reps: "20 min", note: "Keep moving" }
    ])
  ],
  office: [
    workout("office-mon", "Monday", "Desk break lower body", 18, 110, "office", [
      { name: "Chair squat", sets: 3, reps: "15", note: "Stand fully tall" },
      { name: "Wall sit", sets: 3, reps: "30 sec", note: "Flat back" }
    ]),
    workout("office-tue", "Tuesday", "Upper body reset", 16, 95, "office", [
      { name: "Desk incline push-up", sets: 3, reps: "12", note: "Hands on desk edge" },
      { name: "Shoulder circles", sets: 2, reps: "45 sec", note: "Forward and backward" }
    ]),
    workout("office-wed", "Wednesday", "Steps challenge", 20, 130, "office", [
      { name: "Stair climb", sets: 6, reps: "2 floors", note: "Walk back down" },
      { name: "Hallway walk", sets: 2, reps: "5 min", note: "After meals" }
    ]),
    workout("office-thu", "Thursday", "Posture and core", 15, 90, "office", [
      { name: "Standing knee drive", sets: 3, reps: "12 / side", note: "Brace abs" },
      { name: "Wall angel", sets: 3, reps: "10", note: "Keep ribs tucked" }
    ]),
    workout("office-fri", "Friday", "Energy circuit", 18, 120, "office", [
      { name: "March in place", sets: 3, reps: "1 min", note: "Raise knees high" },
      { name: "Desk squat", sets: 3, reps: "15", note: "Use desk for balance" }
    ]),
    workout("office-sat", "Saturday", "Weekend mobility", 15, 80, "office", [
      { name: "Neck mobility", sets: 2, reps: "4 min", note: "Gentle range" },
      { name: "Hip opener flow", sets: 2, reps: "4 min", note: "Slow breathing" }
    ]),
    workout("office-sun", "Sunday", "Light reset", 15, 70, "office", [
      { name: "Walk", sets: 1, reps: "15 min", note: "Easy pace" }
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

export const calculateBmr = (profile: HealthProfile) => {
  const base = 10 * profile.currentWeightKg + 6.25 * profile.heightCm - 5 * profile.age;
  return profile.sex === "male" ? Math.round(base + 5) : Math.round(base - 161);
};

export const calculateMaintenanceCalories = (profile: HealthProfile) => Math.round(calculateBmr(profile) * activityMultipliers[profile.activityLevel]);

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

export const getTodaysMealPlan = (plan: WeeklyMealPlan[]) => plan.find((item) => item.day === todayDay) ?? plan[0];

export const getWorkoutPlanForLocation = (location: UserLocation, plans: Record<UserLocation, DailyWorkoutPlan[]>) => plans[location];

export const calculateGoalProjection = (profile: HealthProfile) => {
  const weightDelta = Math.abs(profile.currentWeightKg - profile.goalWeightKg);
  const weeklyRate = profile.goalDirection === "lose" ? 0.45 : 0.25;
  const weeks = Math.max(1, Math.ceil(weightDelta / weeklyRate));
  const eta = new Date(today);
  eta.setUTCDate(eta.getUTCDate() + weeks * 7);
  return { weeklyRate, weeks, etaLabel: dateFormatter.format(eta) };
};

export const getConsumedNutrition = (foodLogs: FoodLog[], catalog: FoodItem[]) =>
  foodLogs.reduce(
    (acc, log) => {
      const food = catalog.find((item) => item.id === log.foodId);
      if (!food) return acc;
      acc.kcal += food.kcal;
      acc.macros.protein += food.macros.protein;
      acc.macros.carbs += food.macros.carbs;
      acc.macros.fat += food.macros.fat;
      return acc;
    },
    { kcal: 0, macros: { protein: 0, carbs: 0, fat: 0 } }
  );

export const getWorkoutCompletion = (location: UserLocation, plans: Record<UserLocation, DailyWorkoutPlan[]>, logs: WorkoutLog[]) => {
  const plan = plans[location];
  const completedIds = new Set(logs.map((item) => item.workoutId));
  const completed = plan.filter((item) => completedIds.has(item.id)).length;
  return { completed, total: plan.length, percentage: completed / plan.length };
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
    calorieGap > 250 ? `You still have about ${calorieGap} kcal left today, so dinner can stay protein-heavy without overshooting your target.` : "Your calorie intake is close to target, which is a good setup for steady progress.",
    proteinGap > 20 ? `Protein is short by roughly ${proteinGap}g, so add yogurt, eggs, chicken, or a shake later today.` : "Protein intake is on track, which supports recovery and appetite control.",
    completion.percentage >= 0.5 ? "Workout consistency is building well this week, so the current plan looks sustainable." : "Workout consistency is still ramping up, so keep the sessions short and easy to repeat."
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
  addFoodLog: (foodId) => set((state) => ({
    foodLogs: [...state.foodLogs, { id: `fl-${state.foodLogs.length + 1}`, foodId, eatenAt: new Date().toISOString() }]
  })),
  completeWorkout: (workoutId) => set((state) => {
    if (state.workoutLogs.some((item) => item.workoutId === workoutId)) return state;
    return {
      workoutLogs: [...state.workoutLogs, { id: `wl-${state.workoutLogs.length + 1}`, workoutId, completedAt: new Date().toISOString() }]
    };
  })
}));
