import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

interface HealthScoreGamificationProps {
  currentScore: number;
  weeklyGoal: number;
  streakDays: number;
  achievements: Achievement[];
  onShareScore?: () => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export function HealthScoreGamification({
  currentScore,
  weeklyGoal,
  streakDays,
  achievements,
  onShareScore,
}: HealthScoreGamificationProps) {
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [selectedAchievement, setSelectedAchievement] = React.useState<Achievement | null>(null);

  // Determine level based on score
  const level = Math.floor(currentScore / 10) + 1;
  const progressToNextLevel = (currentScore % 10) * 10; // Convert to percentage

  // Check if any achievements were recently unlocked
  React.useEffect(() => {
    const recentlyUnlocked = achievements.find(a => a.unlocked && a.progress === a.maxProgress);
    if (recentlyUnlocked) {
      setShowConfetti(true);
      setSelectedAchievement(recentlyUnlocked);
      
      // Hide confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [achievements]);

  return (
    <div className="space-y-6">
      {/* Main health score card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-700 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Health Journey</h2>
              <p className="text-green-100">Keep making healthy choices!</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{currentScore}</div>
              <div className="text-sm">HEALTH SCORE</div>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium">Level {level}</div>
            <div className="text-sm text-muted-foreground">{progressToNextLevel}% to Level {level + 1}</div>
          </div>
          
          <Progress value={progressToNextLevel} className="h-2 mb-6" />
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{streakDays}</div>
              <div className="text-xs text-green-800">DAY STREAK</div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{Math.floor((currentScore / weeklyGoal) * 100)}%</div>
              <div className="text-xs text-blue-800">WEEKLY GOAL</div>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{achievements.filter(a => a.unlocked).length}</div>
              <div className="text-xs text-purple-800">ACHIEVEMENTS</div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 px-6 py-4">
          <Button onClick={onShareScore} className="w-full" variant="outline">
            Share Your Progress
          </Button>
        </CardFooter>
      </Card>
      
      {/* Achievements section */}
      <div>
        <h3 className="text-xl font-bold mb-4">Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedAchievement(achievement)}
              className={`cursor-pointer relative rounded-lg p-4 text-center ${achievement.unlocked ? 'bg-white border-2 border-green-500' : 'bg-gray-100 border border-gray-200'}`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <div className="font-medium text-sm">{achievement.title}</div>
              {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                <div className="mt-2">
                  <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-1" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {achievement.progress}/{achievement.maxProgress}
                  </div>
                </div>
              )}
              {achievement.unlocked && (
                <span className="absolute top-2 right-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-500 text-white">
                  ✓
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Achievement detail modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedAchievement(null)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <div className="text-center mb-4">
                <div className="text-5xl mb-4">{selectedAchievement.icon}</div>
                <h3 className="text-xl font-bold">{selectedAchievement.title}</h3>
                <p className="text-muted-foreground mt-2">{selectedAchievement.description}</p>
              </div>
              
              {selectedAchievement.unlocked ? (
                <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center mt-4">
                  Achievement Unlocked! 🎉
                </div>
              ) : (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{selectedAchievement.progress}/{selectedAchievement.maxProgress}</span>
                  </div>
                  <Progress value={(selectedAchievement.progress! / selectedAchievement.maxProgress!) * 100} className="h-2" />
                </div>
              )}
              
              <Button className="w-full mt-6" onClick={() => setSelectedAchievement(null)}>
                Close
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Confetti effect for unlocked achievements */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 100 }).map((_, i) => {
            const confettiSize = Math.random() * 10 + 5;
            const confettiLeft = Math.random() * 100;
            const confettiDuration = Math.random() * 3 + 2;
            const confettiDelay = Math.random() * 0.5;
            const confettiColor = [
              "#10B981", // green
              "#3B82F6", // blue
              "#F59E0B", // amber
              "#EC4899", // pink
              "#8B5CF6"  // purple
            ][Math.floor(Math.random() * 5)];
            
            return (
              <motion.div
                key={i}
                initial={{ y: -20, x: `${confettiLeft}vw`, opacity: 1 }}
                animate={{ y: '100vh', opacity: 0 }}
                transition={{ 
                  duration: confettiDuration, 
                  delay: confettiDelay,
                  ease: 'easeOut'
                }}
                style={{ 
                  position: 'absolute',
                  width: `${confettiSize}px`,
                  height: `${confettiSize}px`,
                  backgroundColor: confettiColor,
                  borderRadius: '50%',
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// Example usage component with mock data
export function HealthScoreGamificationDemo() {
  const [score, setScore] = React.useState(75);
  const [achievements, setAchievements] = React.useState<Achievement[]>([
    {
      id: '1',
      title: 'Health Novice',
      description: 'Start your health journey by making your first healthy choice',
      icon: '🥗',
      unlocked: true,
      progress: 1,
      maxProgress: 1
    },
    {
      id: '2',
      title: 'Veggie Lover',
      description: 'Order 5 vegetarian meals',
      icon: '🥦',
      unlocked: true,
      progress: 5,
      maxProgress: 5
    },
    {
      id: '3',
      title: 'Protein Champion',
      description: 'Choose 10 high-protein meals',
      icon: '💪',
      unlocked: false,
      progress: 7,
      maxProgress: 10
    },
    {
      id: '4',
      title: 'Sugar Slayer',
      description: 'Avoid sugary drinks for 7 days straight',
      icon: '🚫',
      unlocked: false,
      progress: 3,
      maxProgress: 7
    },
    {
      id: '5',
      title: 'Healthy Explorer',
      description: 'Try 5 different cuisines with high health scores',
      icon: '🌎',
      unlocked: false,
      progress: 2,
      maxProgress: 5
    },
    {
      id: '6',
      title: 'Perfect Week',
      description: 'Maintain a health score above 80 for a full week',
      icon: '🏆',
      unlocked: false,
      progress: 5,
      maxProgress: 7
    },
    {
      id: '7',
      title: 'Consistency King',
      description: 'Order healthy food for 14 days in a row',
      icon: '👑',
      unlocked: false,
      progress: 8,
      maxProgress: 14
    },
    {
      id: '8',
      title: 'Nutrition Master',
      description: 'Reach level 10 in your health journey',
      icon: '🎓',
      unlocked: false,
      progress: 7,
      maxProgress: 10
    }
  ]);

  // Demo function to increment score
  const incrementScore = () => {
    setScore((prev: number) => Math.min(prev + 5, 100));
    
    // Update an achievement for demo purposes
    if (score >= 80) {
      const updatedAchievements = [...achievements];
      const perfectWeekIndex = updatedAchievements.findIndex(a => a.id === '6');
      
      if (perfectWeekIndex !== -1 && !updatedAchievements[perfectWeekIndex].unlocked) {
        updatedAchievements[perfectWeekIndex] = {
          ...updatedAchievements[perfectWeekIndex],
          progress: 7,
          maxProgress: 7,
          unlocked: true
        };
        setAchievements(updatedAchievements);
      }
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <HealthScoreGamification 
        currentScore={score}
        weeklyGoal={100}
        streakDays={8}
        achievements={achievements}
        onShareScore={() => alert('Sharing score functionality would go here')}
      />
      
      <div className="mt-6 text-center">
        <Button onClick={incrementScore}>Simulate Healthy Choice (+5 points)</Button>
      </div>
    </div>
  );
}
