// =============================================
// controllers/aiController.js
// Enhanced AI Health Suggestion Engine
// =============================================

import BMI      from '../models/BMI.js';
import Water    from '../models/Water.js';
import Calories from '../models/Calories.js';
import Workout  from '../models/Workout.js';

const getToday = () => new Date().toISOString().split('T')[0];

// =============================================
// WORKOUT PLANS based on BMI + activity level
// =============================================
const getWorkoutPlan = (bmiCategory, workoutsThisWeek) => {
  const plans = {
    Underweight: {
      goal: 'Build muscle mass and strength',
      weeklyTarget: '3-4 sessions',
      plan: [
        { day: 'Monday',    workout: 'Full Body Strength',   exercises: ['Push-ups 3×12', 'Squats 3×15', 'Dumbbell rows 3×12', 'Plank 3×30s'],             duration: '40 mins', intensity: 'Medium' },
        { day: 'Tuesday',   workout: 'Rest / Light Walk',    exercises: ['20-min walk', 'Stretching 10 mins'],                                              duration: '30 mins', intensity: 'Low'    },
        { day: 'Wednesday', workout: 'Upper Body Focus',     exercises: ['Dumbbell curls 3×12', 'Shoulder press 3×12', 'Chest press 3×12', 'Tricep dips 3×10'], duration: '40 mins', intensity: 'Medium' },
        { day: 'Thursday',  workout: 'Rest / Yoga',          exercises: ['Yoga 20 mins', 'Deep breathing'],                                                  duration: '25 mins', intensity: 'Low'    },
        { day: 'Friday',    workout: 'Lower Body Focus',     exercises: ['Lunges 3×12', 'Leg press 3×15', 'Calf raises 3×20', 'Glute bridges 3×15'],        duration: '40 mins', intensity: 'Medium' },
        { day: 'Saturday',  workout: 'Light Cardio',         exercises: ['30-min jog', 'Jump rope 5 mins'],                                                   duration: '35 mins', intensity: 'Low'    },
        { day: 'Sunday',    workout: 'Complete Rest',        exercises: ['Sleep well', 'Eat nutritious food'],                                                 duration: '—',       intensity: 'Rest'   },
      ],
    },
    Normal: {
      goal: 'Maintain fitness and build endurance',
      weeklyTarget: '4-5 sessions',
      plan: [
        { day: 'Monday',    workout: 'Cardio + Core',        exercises: ['30-min run', 'Plank 3×45s', 'Crunches 3×20', 'Mountain climbers 3×20'],           duration: '50 mins', intensity: 'Medium' },
        { day: 'Tuesday',   workout: 'Strength Training',    exercises: ['Bench press 3×12', 'Deadlift 3×10', 'Pull-ups 3×8', 'Shoulder press 3×12'],      duration: '50 mins', intensity: 'High'   },
        { day: 'Wednesday', workout: 'Yoga / Flexibility',   exercises: ['Yoga flow 30 mins', 'Hip stretch', 'Hamstring stretch'],                           duration: '35 mins', intensity: 'Low'    },
        { day: 'Thursday',  workout: 'HIIT Workout',         exercises: ['Burpees 3×15', 'Jump squats 3×15', 'High knees 3×30s', 'Push-ups 3×15'],         duration: '30 mins', intensity: 'High'   },
        { day: 'Friday',    workout: 'Lower Body Strength',  exercises: ['Squats 4×12', 'Romanian deadlift 3×12', 'Leg curl 3×12', 'Calf raises 3×20'],    duration: '45 mins', intensity: 'High'   },
        { day: 'Saturday',  workout: 'Outdoor Activity',     exercises: ['Cycling 45 mins OR Swimming 30 mins OR Hiking'],                                    duration: '45 mins', intensity: 'Medium' },
        { day: 'Sunday',    workout: 'Active Rest',          exercises: ['15-min walk', 'Stretching', 'Foam rolling'],                                        duration: '20 mins', intensity: 'Low'    },
      ],
    },
    Overweight: {
      goal: 'Burn fat and improve cardiovascular health',
      weeklyTarget: '5 sessions',
      plan: [
        { day: 'Monday',    workout: 'Brisk Walking + Core', exercises: ['40-min brisk walk', 'Plank 3×20s', 'Standing crunches 3×15'],                    duration: '55 mins', intensity: 'Medium' },
        { day: 'Tuesday',   workout: 'Low Impact Cardio',    exercises: ['Cycling 30 mins', 'Swimming 20 mins OR water aerobics'],                           duration: '50 mins', intensity: 'Medium' },
        { day: 'Wednesday', workout: 'Strength + Cardio',    exercises: ['Bodyweight squats 3×15', 'Modified push-ups 3×10', '20-min walk'],                duration: '50 mins', intensity: 'Medium' },
        { day: 'Thursday',  workout: 'Yoga / Flexibility',   exercises: ['Yoga 30 mins', 'Breathing exercises', 'Light stretching'],                         duration: '35 mins', intensity: 'Low'    },
        { day: 'Friday',    workout: 'Cardio Blast',         exercises: ['30-min jog/walk intervals', 'Jump rope 5×1 min', 'Step-ups 3×15'],                duration: '50 mins', intensity: 'Medium' },
        { day: 'Saturday',  workout: 'Outdoor Walk',         exercises: ['45-min nature walk', 'Stair climbing 10 mins'],                                    duration: '55 mins', intensity: 'Low'    },
        { day: 'Sunday',    workout: 'Complete Rest',        exercises: ['Hydrate well', 'Meal prep for week', 'Light stretching'],                          duration: '—',       intensity: 'Rest'   },
      ],
    },
    Obese: {
      goal: 'Gentle movement and gradual progress',
      weeklyTarget: '3-4 sessions (start slow)',
      plan: [
        { day: 'Monday',    workout: 'Gentle Walk',          exercises: ['15-20 min slow walk', 'Seated stretches', 'Deep breathing 5 mins'],               duration: '25 mins', intensity: 'Low'    },
        { day: 'Tuesday',   workout: 'Rest',                 exercises: ['Rest', 'Stay hydrated', 'Light stretching at home'],                               duration: '—',       intensity: 'Rest'   },
        { day: 'Wednesday', workout: 'Chair Exercises',      exercises: ['Seated leg raises 3×10', 'Arm circles', 'Seated marching 5 mins'],                duration: '20 mins', intensity: 'Low'    },
        { day: 'Thursday',  workout: 'Short Walk',           exercises: ['20-min walk', 'Stop and rest as needed', 'Gentle stretching'],                    duration: '25 mins', intensity: 'Low'    },
        { day: 'Friday',    workout: 'Water Exercise',       exercises: ['Water walking 20 mins OR', 'Chair yoga 20 mins'],                                  duration: '25 mins', intensity: 'Low'    },
        { day: 'Saturday',  workout: 'Gentle Movement',      exercises: ['25-min walk', 'Breathing exercises'],                                              duration: '30 mins', intensity: 'Low'    },
        { day: 'Sunday',    workout: 'Rest',                 exercises: ['Complete rest', 'Plan meals for week', 'Doctor consultation recommended'],          duration: '—',       intensity: 'Rest'   },
      ],
    },
  };
  return plans[bmiCategory] || plans['Normal'];
};

// =============================================
// DIET PLANS — Veg & Non-Veg
// =============================================
const getDietPlan = (bmiCategory, totalCalories, calorieGoal) => {
  const plans = {
    Underweight: {
      goal: 'High calorie, high protein diet to gain healthy weight',
      targetCalories: '2500 - 3000 kcal/day',
      keyNutrients: ['Protein', 'Complex Carbs', 'Healthy Fats', 'Vitamins'],
      veg: {
        breakfast: ['Oats with banana + peanut butter + milk (450 kcal)', 'Whole wheat toast 2 slices + avocado + boiled eggs (veg: paneer) (380 kcal)', 'Smoothie: banana + mango + milk + protein powder (400 kcal)'],
        lunch:     ['Dal + rice + roti + sabzi + curd (600 kcal)', 'Rajma chawal + raita + salad (550 kcal)', 'Paneer butter masala + naan + dal soup (650 kcal)'],
        dinner:    ['Palak paneer + roti + rice + dal (580 kcal)', 'Mixed vegetable curry + brown rice + curd (520 kcal)', 'Chana masala + jeera rice + raita (560 kcal)'],
        snacks:    ['Peanut butter on whole wheat bread (200 kcal)', 'Mixed nuts + banana (250 kcal)', 'Paneer tikka (200 kcal)', 'Mango lassi (200 kcal)'],
        avoid:     ['Diet foods', 'Low-fat versions', 'Skipping meals', 'Excessive caffeine'],
      },
      nonVeg: {
        breakfast: ['Eggs 3 (boiled/scrambled) + whole wheat toast + milk (450 kcal)', 'Chicken sandwich + orange juice (480 kcal)', 'Omelette 3 eggs + vegetables + toast (420 kcal)'],
        lunch:     ['Chicken curry + rice + roti + salad (650 kcal)', 'Fish curry + brown rice + dal + sabzi (620 kcal)', 'Egg curry + rice + curd + roti (580 kcal)'],
        dinner:    ['Grilled chicken 200g + sweet potato + salad (580 kcal)', 'Fish tikka + jeera rice + raita (550 kcal)', 'Mutton curry + roti + dal (620 kcal)'],
        snacks:    ['Boiled eggs 2 (160 kcal)', 'Chicken sandwich (300 kcal)', 'Mixed nuts (200 kcal)', 'Tuna on crackers (180 kcal)'],
        avoid:     ['Skipping meals', 'Excessive junk food', 'Soft drinks', 'Processed meats'],
      },
    },
    Normal: {
      goal: 'Balanced diet to maintain weight and energy',
      targetCalories: '1800 - 2200 kcal/day',
      keyNutrients: ['Balanced Macros', 'Fiber', 'Vitamins', 'Minerals'],
      veg: {
        breakfast: ['Poha + green tea + 1 fruit (320 kcal)', 'Idli 3 + sambar + coconut chutney (350 kcal)', 'Oats with berries + low-fat milk (300 kcal)'],
        lunch:     ['Dal + 2 roti + sabzi + salad + curd (480 kcal)', 'Brown rice + rajma + raita + salad (450 kcal)', 'Vegetable pulao + raita + salad (420 kcal)'],
        dinner:    ['2 roti + dal + sabzi (light) (380 kcal)', 'Vegetable soup + 2 roti + dal (360 kcal)', 'Mixed dal + brown rice + salad (400 kcal)'],
        snacks:    ['Apple + handful of almonds (180 kcal)', 'Hummus + vegetable sticks (150 kcal)', 'Low-fat yogurt (100 kcal)'],
        avoid:     ['White bread', 'Sugary drinks', 'Deep fried foods', 'Late night eating'],
      },
      nonVeg: {
        breakfast: ['2 boiled eggs + whole wheat toast + green tea (320 kcal)', 'Chicken upma + low-fat milk (340 kcal)', 'Omelette 2 eggs + vegetables + 1 toast (300 kcal)'],
        lunch:     ['Grilled chicken 150g + brown rice + salad (480 kcal)', 'Fish curry + 2 roti + dal + salad (460 kcal)', 'Egg bhurji + 2 roti + dal (430 kcal)'],
        dinner:    ['Grilled fish 150g + steamed vegetables + 1 roti (380 kcal)', 'Chicken soup + 2 roti (360 kcal)', 'Baked chicken + salad + brown rice (400 kcal)'],
        snacks:    ['Boiled egg 1 (80 kcal)', 'Grilled chicken strips (150 kcal)', 'Greek yogurt (120 kcal)'],
        avoid:     ['Fried chicken', 'Processed meats', 'Sugary drinks', 'Eating after 9pm'],
      },
    },
    Overweight: {
      goal: 'Calorie deficit diet to lose weight safely',
      targetCalories: '1400 - 1700 kcal/day',
      keyNutrients: ['High Protein', 'High Fiber', 'Low Carb', 'Low Fat'],
      veg: {
        breakfast: ['Vegetable oats upma + green tea (no sugar) (280 kcal)', 'Moong dal chilla 2 + mint chutney (250 kcal)', 'Fruit salad + low-fat yogurt (220 kcal)'],
        lunch:     ['Dal + 1 roti + lots of sabzi + salad (380 kcal)', 'Brown rice small portion + rajma + salad (360 kcal)', 'Vegetable soup + 1 roti + dal (330 kcal)'],
        dinner:    ['1 roti + dal + vegetable (light) (280 kcal)', 'Vegetable soup + salad (200 kcal)', 'Moong dal khichdi + raita (300 kcal)'],
        snacks:    ['Cucumber + carrot sticks (30 kcal)', 'Apple (80 kcal)', 'Buttermilk (60 kcal)', 'Green tea (5 kcal)'],
        avoid:     ['White rice in excess', 'Sugary foods', 'Fried items', 'Maida products', 'Cold drinks'],
      },
      nonVeg: {
        breakfast: ['2 boiled egg whites + 1 whole egg + green tea (180 kcal)', 'Grilled chicken sandwich (light) (280 kcal)', 'Omelette 2 eggs (no yolk) + vegetables (200 kcal)'],
        lunch:     ['Grilled chicken 120g + lots of salad + 1 roti (380 kcal)', 'Fish (grilled) + vegetable + brown rice small (360 kcal)', 'Chicken soup + salad + 1 roti (320 kcal)'],
        dinner:    ['Grilled fish 100g + steamed veggies (250 kcal)', 'Chicken clear soup + salad (220 kcal)', 'Boiled eggs 2 + vegetable salad (240 kcal)'],
        snacks:    ['Boiled egg white (17 kcal)', 'Cucumber salad (30 kcal)', 'Chicken broth (40 kcal)', 'Green tea (5 kcal)'],
        avoid:     ['Fried chicken', 'Red meat daily', 'Mayonnaise', 'Soft drinks', 'Alcohol'],
      },
    },
    Obese: {
      goal: 'Medically supervised diet — strict calorie control',
      targetCalories: '1200 - 1500 kcal/day (consult doctor)',
      keyNutrients: ['High Protein', 'Very High Fiber', 'Very Low Carb', 'Zero Sugar'],
      veg: {
        breakfast: ['Moong dal chilla 1 + green tea (no sugar) (200 kcal)', 'Vegetable smoothie (spinach, cucumber, lemon) (80 kcal)', 'Low-fat yogurt + apple (180 kcal)'],
        lunch:     ['Large vegetable salad + 1 small roti + dal (300 kcal)', 'Vegetable soup + 1 roti (250 kcal)', 'Dal soup + salad + small brown rice (280 kcal)'],
        dinner:    ['Vegetable soup (large) + salad (180 kcal)', 'Dal soup + 1 roti (220 kcal)', 'Stir-fried vegetables + small portion dal (200 kcal)'],
        snacks:    ['Cucumber slices (15 kcal)', 'Green tea (5 kcal)', 'Buttermilk (no sugar) (40 kcal)'],
        avoid:     ['All fried foods', 'Sugar completely', 'White rice', 'Bread', 'Sweets', 'Cold drinks', 'Alcohol'],
      },
      nonVeg: {
        breakfast: ['2 boiled egg whites + green tea (no sugar) (120 kcal)', 'Chicken broth soup (100 kcal)', 'Vegetable omelette (1 egg) (130 kcal)'],
        lunch:     ['Grilled chicken 100g + large salad (270 kcal)', 'Steamed fish + vegetable (250 kcal)', 'Chicken soup + salad (230 kcal)'],
        dinner:    ['Grilled fish 80g + steamed vegetables (200 kcal)', 'Clear chicken soup + salad (180 kcal)', 'Boiled egg 2 + vegetable salad (200 kcal)'],
        snacks:    ['Cucumber (15 kcal)', 'Green tea (5 kcal)', 'Chicken broth (40 kcal)'],
        avoid:     ['All fried foods', 'Red meat', 'Sugar', 'Processed foods', 'Alcohol', 'Fast food'],
      },
    },
  };
  return plans[bmiCategory] || plans['Normal'];
};

// =============================================
// ADDITIONAL LIFESTYLE TIPS
// =============================================
const getLifestyleTips = (summary) => {
  const tips = [];

  // Sleep tips
  tips.push({
    category: 'Sleep',
    icon: '😴',
    title: 'Optimize Your Sleep',
    tips: [
      'Sleep 7-9 hours every night for muscle recovery',
      'Avoid screens 1 hour before bed',
      'Keep your room cool and dark for better sleep',
      'Sleep and wake at the same time daily',
    ],
  });

  // Stress management
  tips.push({
    category: 'Mental Health',
    icon: '🧘',
    title: 'Manage Stress',
    tips: [
      'Practice 10 mins of meditation daily',
      'Deep breathing: inhale 4s, hold 4s, exhale 4s',
      'Journaling helps reduce anxiety',
      'Take breaks every 45 mins while working',
    ],
  });

  // Posture
  tips.push({
    category: 'Posture',
    icon: '🪑',
    title: 'Fix Your Posture',
    tips: [
      'Sit with your back straight and feet flat on floor',
      'Keep your screen at eye level',
      'Take a standing break every hour',
      'Do shoulder rolls and neck stretches daily',
    ],
  });

  // Digestion
  tips.push({
    category: 'Digestion',
    icon: '🫁',
    title: 'Improve Digestion',
    tips: [
      'Eat slowly and chew food thoroughly',
      'Don\'t eat 2-3 hours before sleeping',
      'Drink warm water after meals',
      'Include probiotics like curd/yogurt daily',
    ],
  });

  // Immunity
  tips.push({
    category: 'Immunity',
    icon: '🛡️',
    title: 'Boost Your Immunity',
    tips: [
      'Eat Vitamin C rich foods: lemon, orange, amla',
      'Get 15-20 mins of morning sunlight (Vitamin D)',
      'Include turmeric and ginger in your diet',
      'Avoid smoking and alcohol',
    ],
  });

  // Supplements
  tips.push({
    category: 'Supplements',
    icon: '💊',
    title: 'Consider These Supplements',
    tips: [
      'Vitamin D3 — if you stay indoors mostly',
      'Vitamin B12 — especially for vegetarians',
      'Omega-3 — for heart and brain health',
      'Always consult a doctor before starting supplements',
    ],
  });

  return tips;
};

// =============================================
// MAIN: GET AI SUGGESTIONS
// GET /api/ai/suggestions
// =============================================
export const getSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;

    // ── Fetch user health data ──
    const latestBMI = await BMI.findOne({ user: userId }).sort({ createdAt: -1 });

    const todayWater    = await Water.find({ user: userId, date: getToday() });
    const totalWater    = todayWater.reduce((s, w) => s + w.amount, 0);
    const waterGoal     = todayWater[0]?.dailyGoal || 2000;

    const todayMeals    = await Calories.find({ user: userId, date: getToday() });
    const totalCalories = todayMeals.reduce((s, m) => s + m.calories, 0);
    const calorieGoal   = todayMeals[0]?.dailyGoal || 2000;

    const weekDays = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      weekDays.push(d.toISOString().split('T')[0]);
    }
    const weekWorkouts        = await Workout.find({ user: userId, date: { $in: weekDays } });
    const totalWorkouts       = weekWorkouts.length;
    const totalCaloriesBurned = weekWorkouts.reduce((s, w) => s + w.caloriesBurned, 0);

    // ── Analysis ──
    const suggestions  = [];
    const achievements = [];
    let score = 0, maxScore = 0;

    // BMI
    if (latestBMI) {
      maxScore += 25;
      if (latestBMI.category === 'Normal')      { score += 25; achievements.push({ icon: '✅', title: 'Healthy BMI!', desc: `Your BMI of ${latestBMI.bmi} is perfect!`, type: 'success' }); }
      else if (latestBMI.category === 'Underweight') { score += 10; suggestions.push({ icon: '🥗', title: 'Increase Caloric Intake', desc: `BMI ${latestBMI.bmi} is Underweight. Eat more nutritious foods and do strength training.`, priority: 'high', category: 'Nutrition' }); }
      else if (latestBMI.category === 'Overweight')  { score += 12; suggestions.push({ icon: '🏃', title: 'Increase Cardio Activity', desc: `BMI ${latestBMI.bmi} is Overweight. Do 30-min cardio 5 days/week and reduce processed food.`, priority: 'high', category: 'Exercise' }); }
      else if (latestBMI.category === 'Obese')       { score += 5;  suggestions.push({ icon: '🏥', title: 'Consult a Doctor', desc: `BMI ${latestBMI.bmi} is Obese. Please consult a healthcare professional. Start with short daily walks.`, priority: 'high', category: 'Medical' }); }
    } else {
      suggestions.push({ icon: '⚖️', title: 'Calculate Your BMI First', desc: 'Go to BMI Tracker and enter your weight & height to get personalized plans.', priority: 'high', category: 'Tracking' });
    }

    // Water
    maxScore += 25;
    const waterPct = (totalWater / waterGoal) * 100;
    if (waterPct >= 100)     { score += 25; achievements.push({ icon: '💧', title: 'Hydration Goal Reached!', desc: `${totalWater}ml consumed today. Excellent!`, type: 'success' }); }
    else if (waterPct >= 70) { score += 18; suggestions.push({ icon: '💧', title: 'Almost There!', desc: `Drink ${waterGoal - totalWater}ml more to hit goal.`, priority: 'low', category: 'Hydration' }); }
    else if (waterPct >= 40) { score += 10; suggestions.push({ icon: '🚰', title: 'Drink More Water', desc: `Only ${totalWater}ml consumed. Set hourly reminders.`, priority: 'medium', category: 'Hydration' }); }
    else                     { score += 3;  suggestions.push({ icon: '⚠️', title: 'Critical: Low Hydration!', desc: `Only ${totalWater}ml! Drink water now — dehydration affects everything.`, priority: 'high', category: 'Hydration' }); }

    // Calories
    maxScore += 25;
    const calPct = (totalCalories / calorieGoal) * 100;
    if (calPct >= 80 && calPct <= 110) { score += 25; achievements.push({ icon: '🔥', title: 'Perfect Calorie Balance!', desc: `${totalCalories} kcal — right on target!`, type: 'success' }); }
    else if (calPct < 40)              { score += 8;  suggestions.push({ icon: '🍽️', title: 'Eat More Today', desc: `Only ${totalCalories} kcal consumed. Skipping meals slows metabolism. Have a balanced meal!`, priority: 'high', category: 'Nutrition' }); }
    else if (calPct > 120)             { score += 10; suggestions.push({ icon: '🥗', title: 'Over Calorie Goal', desc: `${totalCalories} kcal (${Math.round(calPct - 100)}% over). Balance with exercise or lighter dinner.`, priority: 'medium', category: 'Nutrition' }); }
    else if (totalCalories === 0)      { suggestions.push({ icon: '🍎', title: 'Log Your Meals', desc: 'Start tracking meals to get personalized diet suggestions.', priority: 'medium', category: 'Tracking' }); }

    // Workouts
    maxScore += 25;
    if (totalWorkouts >= 5)                   { score += 25; achievements.push({ icon: '🏆', title: 'Workout Champion!', desc: `${totalWorkouts} workouts — burned ${totalCaloriesBurned} kcal this week!`, type: 'success' }); }
    else if (totalWorkouts >= 3)              { score += 18; achievements.push({ icon: '💪', title: 'Active Week!', desc: `${totalWorkouts} workouts done. ${5 - totalWorkouts} more to hit target!`, type: 'success' }); }
    else if (totalWorkouts === 1 || totalWorkouts === 2) { score += 10; suggestions.push({ icon: '🏃', title: 'Increase Workout Days', desc: `Only ${totalWorkouts} workout(s). Aim for 4-5 sessions weekly for best results.`, priority: 'medium', category: 'Exercise' }); }
    else                                      { score += 0;  suggestions.push({ icon: '🛋️', title: 'No Workouts This Week!', desc: 'Start with a 20-min walk today. Consistency beats intensity for beginners.', priority: 'high', category: 'Exercise' }); }

    // Extra tips
    if (totalWorkouts > 0 && totalWater < 1500) {
      suggestions.push({ icon: '💦', title: 'Hydrate After Workout', desc: 'You worked out but water is low. Drink 500ml extra on workout days for recovery.', priority: 'high', category: 'Recovery' });
    }

    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) {
      suggestions.push({ icon: '😴', title: 'Prioritize Sleep Now', desc: 'It\'s late! 7-9 hrs of sleep improves metabolism, muscle recovery and mood.', priority: 'medium', category: 'Wellness' });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    const healthScore = Math.round((score / maxScore) * 100);
    const grade =
      healthScore >= 85 ? { label: 'Excellent', color: 'green',  emoji: '🏆' } :
      healthScore >= 70 ? { label: 'Good',       color: 'blue',   emoji: '😊' } :
      healthScore >= 50 ? { label: 'Fair',       color: 'yellow', emoji: '😐' } :
                          { label: 'Poor',       color: 'red',    emoji: '😟' };

    // Get workout plan and diet plan
    const bmiCategory  = latestBMI?.category || 'Normal';
    const workoutPlan  = getWorkoutPlan(bmiCategory, totalWorkouts);
    const dietPlan     = getDietPlan(bmiCategory, totalCalories, calorieGoal);
    const lifestyleTips = getLifestyleTips({ totalWater, totalCalories, totalWorkouts });

    res.status(200).json({
      success: true,
      data: {
        healthScore,
        grade,
        suggestions,
        achievements,
        workoutPlan,
        dietPlan,
        lifestyleTips,
        summary: {
          bmi:            latestBMI?.bmi      || null,
          bmiCategory:    latestBMI?.category || null,
          waterToday:     totalWater,
          waterGoal,
          caloriesToday:  totalCalories,
          calorieGoal,
          workoutsWeek:   totalWorkouts,
          caloriesBurned: totalCaloriesBurned,
        },
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};