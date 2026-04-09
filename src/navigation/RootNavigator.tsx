import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/home/HomeScreen";
import {
  NutritionScreen,
  NutritionStackParams
} from "../screens/nutrition/NutritionScreen";
import { RecipeDetailScreen } from "../screens/nutrition/RecipeDetailScreen";
import { ProfileScreen, ProfileStackParams } from "../screens/profile/ProfileScreen";
import { SettingsScreen } from "../screens/profile/SettingsScreen";
import {
  WorkoutsScreen,
  WorkoutsStackParams
} from "../screens/workouts/WorkoutsScreen";
import { WorkoutDetailScreen } from "../screens/workouts/WorkoutDetailScreen";
import { colors } from "../theme/colors";

type RootTabsParams = {
  Home: undefined;
  Nutrition: undefined;
  Workouts: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabsParams>();
const NutritionStack = createNativeStackNavigator<NutritionStackParams>();
const WorkoutsStack = createNativeStackNavigator<WorkoutsStackParams>();
const ProfileStack = createNativeStackNavigator<ProfileStackParams>();

const sharedScreenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.textPrimary,
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.background }
};

const NutritionNavigator = () => (
  <NutritionStack.Navigator screenOptions={sharedScreenOptions}>
    <NutritionStack.Screen
      name="NutritionMain"
      component={NutritionScreen}
      options={{ headerShown: false }}
    />
    <NutritionStack.Screen
      name="RecipeDetail"
      component={RecipeDetailScreen}
      options={{ title: "Meal plan details" }}
    />
  </NutritionStack.Navigator>
);

const WorkoutsNavigator = () => (
  <WorkoutsStack.Navigator screenOptions={sharedScreenOptions}>
    <WorkoutsStack.Screen
      name="WorkoutsMain"
      component={WorkoutsScreen}
      options={{ headerShown: false }}
    />
    <WorkoutsStack.Screen
      name="WorkoutDetail"
      component={WorkoutDetailScreen}
      options={{ title: "Workout details" }}
    />
  </WorkoutsStack.Navigator>
);

const ProfileNavigator = () => (
  <ProfileStack.Navigator screenOptions={sharedScreenOptions}>
    <ProfileStack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen name="Settings" component={SettingsScreen} />
  </ProfileStack.Navigator>
);

export const RootNavigator = () => {
  const theme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.background,
      card: colors.background,
      text: colors.textPrimary,
      border: colors.border,
      primary: colors.accent
    }
  };

  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#0F172A",
            borderTopColor: colors.border,
            height: 72,
            paddingTop: 8
          },
          tabBarActiveTintColor: colors.accent2,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarIcon: ({ color, size }) => {
            const iconName: Record<keyof RootTabsParams, keyof typeof Ionicons.glyphMap> =
              {
                Home: "home-outline",
                Nutrition: "restaurant-outline",
                Workouts: "barbell-outline",
                Profile: "person-outline"
              };

            return <Ionicons name={iconName[route.name]} size={size} color={color} />;
          }
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Nutrition" component={NutritionNavigator} />
        <Tab.Screen name="Workouts" component={WorkoutsNavigator} />
        <Tab.Screen name="Profile" component={ProfileNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
