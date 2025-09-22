import { db } from '../lib/db';
import { logger } from '../utils/logger';
import { notificationService } from './notificationService';
import { NotificationType, NotificationPriority } from './notificationService';

export enum CompetencyCategory {
  VEHICLE_CONTROL = 'VEHICLE_CONTROL',
  HAZARD_AWARENESS = 'HAZARD_AWARENESS',
  ROAD_POSITIONING = 'ROAD_POSITIONING',
  MANOEUVRES = 'MANOEUVRES',
  TRAFFIC_SIGNS = 'TRAFFIC_SIGNS',
  OBSERVATION = 'OBSERVATION',
  COMMUNICATION = 'COMMUNICATION',
  RULES_AND_REGULATIONS = 'RULES_AND_REGULATIONS'
}

export enum ObjectiveStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  NEEDS_IMPROVEMENT = 'NEEDS_IMPROVEMENT'
}

export enum MilestoneType {
  FIRST_LESSON = 'FIRST_LESSON',
  THEORY_PASSED = 'THEORY_PASSED',
  MOCK_TEST_PASSED = 'MOCK_TEST_PASSED',
  READY_FOR_TEST = 'READY_FOR_TEST',
  PRACTICAL_PASSED = 'PRACTICAL_PASSED',
  COMPETENCY_ACHIEVED = 'COMPETENCY_ACHIEVED',
  LEARNING_PATH_COMPLETE = 'LEARNING_PATH_COMPLETE'
}

export interface CompetencyScore {
  competencyId: string;
  name: string;
  category: string;
  currentScore: number;
  targetScore: number;
  improvementRate: number;
  lastAssessed: Date;
}

export interface ProgressAnalytics {
  learnerId: string;
  overallProgress: number;
  competencyScores: CompetencyScore[];
  strengths: string[];
  improvements: string[];
  predictedTestReadiness: number;
  recommendedActions: string[];
  nextMilestone: string;
  estimatedCompletionDate?: Date;
}

export interface LessonOutcome {
  lessonId: string;
  objectivesCompleted: string[];
  competencyScores: { competencyId: string; score: number; feedback?: string }[];
  overallRating: number;
  instructorNotes?: string;
  recommendedNextSteps: string[];
}

export class ProgressTrackingService {
  private static instance: ProgressTrackingService;

  static getInstance(): ProgressTrackingService {
    if (!ProgressTrackingService.instance) {
      ProgressTrackingService.instance = new ProgressTrackingService();
    }
    return ProgressTrackingService.instance;
  }

  // Initialize default skill competencies based on DVSA standards
  async initializeSkillCompetencies(): Promise<void> {
    try {
      const competencies = [
        // Vehicle Control
        { name: 'Moving off safely', category: CompetencyCategory.VEHICLE_CONTROL, level: 'BEGINNER', order: 1 },
        { name: 'Clutch control', category: CompetencyCategory.VEHICLE_CONTROL, level: 'BEGINNER', order: 2 },
        { name: 'Steering control', category: CompetencyCategory.VEHICLE_CONTROL, level: 'BEGINNER', order: 3 },
        { name: 'Speed control', category: CompetencyCategory.VEHICLE_CONTROL, level: 'INTERMEDIATE', order: 4 },
        { name: 'Stopping safely', category: CompetencyCategory.VEHICLE_CONTROL, level: 'BEGINNER', order: 5 },

        // Hazard Awareness
        { name: 'Scanning for hazards', category: CompetencyCategory.HAZARD_AWARENESS, level: 'INTERMEDIATE', order: 6 },
        { name: 'Response to hazards', category: CompetencyCategory.HAZARD_AWARENESS, level: 'INTERMEDIATE', order: 7 },
        { name: 'Anticipation skills', category: CompetencyCategory.HAZARD_AWARENESS, level: 'ADVANCED', order: 8 },

        // Road Positioning
        { name: 'Lane positioning', category: CompetencyCategory.ROAD_POSITIONING, level: 'BEGINNER', order: 9 },
        { name: 'Following distance', category: CompetencyCategory.ROAD_POSITIONING, level: 'INTERMEDIATE', order: 10 },
        { name: 'Roundabout positioning', category: CompetencyCategory.ROAD_POSITIONING, level: 'INTERMEDIATE', order: 11 },

        // Manoeuvres
        { name: 'Parallel parking', category: CompetencyCategory.MANOEUVRES, level: 'INTERMEDIATE', order: 12 },
        { name: 'Bay parking', category: CompetencyCategory.MANOEUVRES, level: 'BEGINNER', order: 13 },
        { name: 'Three-point turn', category: CompetencyCategory.MANOEUVRES, level: 'INTERMEDIATE', order: 14 },
        { name: 'Emergency stop', category: CompetencyCategory.MANOEUVRES, level: 'INTERMEDIATE', order: 15 },

        // Observation
        { name: 'Mirror use', category: CompetencyCategory.OBSERVATION, level: 'BEGINNER', order: 16 },
        { name: 'Blind spot checks', category: CompetencyCategory.OBSERVATION, level: 'INTERMEDIATE', order: 17 },
        { name: 'Junction observation', category: CompetencyCategory.OBSERVATION, level: 'INTERMEDIATE', order: 18 },

        // Communication
        { name: 'Signaling', category: CompetencyCategory.COMMUNICATION, level: 'BEGINNER', order: 19 },
        { name: 'Road positioning communication', category: CompetencyCategory.COMMUNICATION, level: 'INTERMEDIATE', order: 20 }
      ];

      for (const competency of competencies) {
        await db.skillCompetency.upsert({
          where: { name: competency.name },
          update: {},
          create: {
            name: competency.name,
            description: `DVSA standard competency: ${competency.name}`,
            category: competency.category,
            level: competency.level as any,
            isCore: true,
            order: competency.order
          }
        });
      }

      logger.info('Skill competencies initialized successfully');
    } catch (error) {
      logger.error('Error initializing skill competencies:', error);
      throw error;
    }
  }

  // Create a personalized learning path for a learner
  async createLearningPath(learnerId: string, title: string, targetDate?: Date): Promise<string> {
    try {
      // Get learner's current skill level and progress
      const currentProgress = await this.getProgressAnalytics(learnerId);
      
      // Create learning path with estimated duration
      const estimatedDuration = this.calculateEstimatedDuration(currentProgress);
      
      const learningPath = await db.learningPath.create({
        data: {
          learnerId,
          title,
          description: `Personalized learning path for ${title}`,
          estimatedDuration,
          targetDate: targetDate || this.calculateTargetDate(estimatedDuration),
          isActive: true
        }
      });

      // Generate adaptive learning steps based on current progress
      await this.generateLearningSteps(learningPath.id, currentProgress);

      // Send notification
      await notificationService.sendNotification({
        type: NotificationType.PROGRESS_UPDATE,
        title: 'Learning Path Created',
        message: `Your personalized learning path "${title}" has been created!`,
        userId: learnerId,
        priority: NotificationPriority.MEDIUM,
        actionUrl: `/progress/learning-path/${learningPath.id}`
      });

      logger.info(`Learning path created for learner ${learnerId}`);
      return learningPath.id;
    } catch (error) {
      logger.error('Error creating learning path:', error);
      throw error;
    }
  }

  // Record lesson outcome and update progress
  async recordLessonOutcome(lessonId: string, outcome: LessonOutcome): Promise<void> {
    try {
      const lesson = await db.lesson.findUnique({
        where: { id: lessonId },
        include: { learner: true, instructor: true }
      });

      if (!lesson) {
        throw new Error(`Lesson not found: ${lessonId}`);
      }

      // Record skill assessments
      for (const competencyScore of outcome.competencyScores) {
        await db.skillAssessment.create({
          data: {
            learnerId: lesson.learnerId,
            instructorId: lesson.instructorId,
            competencyId: competencyScore.competencyId,
            lessonId: lessonId,
            score: competencyScore.score,
            feedback: competencyScore.feedback,
            assessedAt: new Date()
          }
        });
      }

      // Update lesson objectives progress
      for (const objectiveId of outcome.objectivesCompleted) {
        await db.objectiveProgress.upsert({
          where: {
            objectiveId_learnerId: {
              objectiveId,
              learnerId: lesson.learnerId
            }
          },
          update: {
            status: ObjectiveStatus.COMPLETED,
            lastAttempt: new Date(),
            attempts: { increment: 1 }
          },
          create: {
            objectiveId,
            learnerId: lesson.learnerId,
            status: ObjectiveStatus.COMPLETED,
            lastAttempt: new Date(),
            attempts: 1
          }
        });
      }

      // Update lesson record
      await db.lesson.update({
        where: { id: lessonId },
        data: {
          rating: outcome.overallRating,
          instructorNotes: outcome.instructorNotes,
          status: 'COMPLETED'
        }
      });

      // Check for milestones
      await this.checkAndAwardMilestones(lesson.learnerId);

      // Update progress snapshot
      await this.updateProgressSnapshot(lesson.learnerId);

      // Send progress notification
      await this.sendProgressNotification(lesson.learnerId, lessonId);

      logger.info(`Lesson outcome recorded for lesson ${lessonId}`);
    } catch (error) {
      logger.error('Error recording lesson outcome:', error);
      throw error;
    }
  }

  // Get comprehensive progress analytics for a learner
  async getProgressAnalytics(learnerId: string): Promise<ProgressAnalytics> {
    try {
      // Get all competency scores
      const competencyScores = await this.getCompetencyScores(learnerId);
      
      // Calculate overall progress
      const overallProgress = this.calculateOverallProgress(competencyScores);
      
      // Identify strengths and improvement areas
      const { strengths, improvements } = this.analyzeStrengthsAndImprovements(competencyScores);
      
      // Predict test readiness
      const predictedTestReadiness = this.calculateTestReadiness(competencyScores);
      
      // Generate recommended actions
      const recommendedActions = this.generateRecommendations(competencyScores, improvements);
      
      // Determine next milestone
      const nextMilestone = await this.getNextMilestone(learnerId);
      
      // Estimate completion date
      const estimatedCompletionDate = this.estimateCompletionDate(learnerId, overallProgress);

      return {
        learnerId,
        overallProgress,
        competencyScores,
        strengths,
        improvements,
        predictedTestReadiness,
        recommendedActions,
        nextMilestone,
        estimatedCompletionDate
      };
    } catch (error) {
      logger.error('Error getting progress analytics:', error);
      throw error;
    }
  }

  // Get detailed competency scores for a learner
  async getCompetencyScores(learnerId: string): Promise<CompetencyScore[]> {
    try {
      const competencies = await db.skillCompetency.findMany({
        include: {
          assessments: {
            where: { learnerId },
            orderBy: { assessedAt: 'desc' }
          }
        }
      });

      return competencies.map(competency => {
        const recentAssessments = competency.assessments.slice(0, 5); // Last 5 assessments
        const currentScore = recentAssessments.length > 0 ? recentAssessments[0].score : 0;
        const targetScore = 4.0; // DVSA pass standard
        
        // Calculate improvement rate
        let improvementRate = 0;
        if (recentAssessments.length > 1) {
          const oldScore = recentAssessments[recentAssessments.length - 1].score;
          improvementRate = ((currentScore - oldScore) / recentAssessments.length) * 100;
        }

        return {
          competencyId: competency.id,
          name: competency.name,
          category: competency.category,
          currentScore,
          targetScore,
          improvementRate,
          lastAssessed: recentAssessments[0]?.assessedAt || new Date(0)
        };
      });
    } catch (error) {
      logger.error('Error getting competency scores:', error);
      throw error;
    }
  }

  // Create progress snapshot for reporting
  async updateProgressSnapshot(learnerId: string): Promise<void> {
    try {
      const analytics = await this.getProgressAnalytics(learnerId);
      
      // Get lesson statistics
      const totalLessons = await db.lesson.count({
        where: { learnerId }
      });
      
      const completedLessons = await db.lesson.count({
        where: { learnerId, status: 'COMPLETED' }
      });

      const averageScore = analytics.competencyScores.length > 0
        ? analytics.competencyScores.reduce((sum, c) => sum + c.currentScore, 0) / analytics.competencyScores.length
        : 0;

      await db.progressSnapshot.create({
        data: {
          learnerId,
          snapshotDate: new Date(),
          totalLessons,
          completedLessons,
          averageScore,
          competencyScores: JSON.stringify(analytics.competencyScores),
          strengths: JSON.stringify(analytics.strengths),
          improvements: JSON.stringify(analytics.improvements),
          nextMilestone: analytics.nextMilestone,
          readinessLevel: analytics.predictedTestReadiness,
          predictedTestDate: analytics.estimatedCompletionDate
        }
      });

      logger.info(`Progress snapshot updated for learner ${learnerId}`);
    } catch (error) {
      logger.error('Error updating progress snapshot:', error);
      throw error;
    }
  }

  // Check and award milestones
  private async checkAndAwardMilestones(learnerId: string): Promise<void> {
    try {
      const analytics = await this.getProgressAnalytics(learnerId);
      
      // Check for various milestone conditions
      const milestoneChecks = [
        {
          type: MilestoneType.COMPETENCY_ACHIEVED,
          condition: () => analytics.competencyScores.some(c => c.currentScore >= 4.0 && c.lastAssessed > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
          title: 'Competency Mastered',
          description: 'You have achieved mastery in a key driving competency!'
        },
        {
          type: MilestoneType.READY_FOR_TEST,
          condition: () => analytics.predictedTestReadiness >= 80,
          title: 'Test Ready',
          description: 'You are ready to book your driving test!'
        }
      ];

      for (const check of milestoneChecks) {
        if (check.condition()) {
          // Check if milestone already exists
          const existingMilestone = await db.progressMilestone.findFirst({
            where: {
              learnerId,
              type: check.type,
              achievedAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Within last 30 days
              }
            }
          });

          if (!existingMilestone) {
            await db.progressMilestone.create({
              data: {
                learnerId,
                type: check.type,
                title: check.title,
                description: check.description,
                achievedAt: new Date()
              }
            });

            // Send milestone notification
            await notificationService.sendNotification({
              type: NotificationType.PROGRESS_UPDATE,
              title: `🎉 ${check.title}`,
              message: check.description,
              userId: learnerId,
              priority: NotificationPriority.HIGH,
              actionUrl: '/progress/milestones'
            });
          }
        }
      }
    } catch (error) {
      logger.error('Error checking milestones:', error);
    }
  }

  // Send progress notification
  private async sendProgressNotification(learnerId: string, lessonId: string): Promise<void> {
    try {
      const analytics = await this.getProgressAnalytics(learnerId);
      
      if (analytics.overallProgress > 0) {
        await notificationService.sendNotification({
          type: NotificationType.PROGRESS_UPDATE,
          title: 'Progress Updated',
          message: `Your overall progress is now ${analytics.overallProgress.toFixed(1)}%`,
          userId: learnerId,
          priority: NotificationPriority.LOW,
          actionUrl: '/progress/dashboard',
          metadata: {
            lessonId,
            overallProgress: analytics.overallProgress,
            nextMilestone: analytics.nextMilestone
          }
        });
      }
    } catch (error) {
      logger.error('Error sending progress notification:', error);
    }
  }

  // Helper methods for calculations
  private calculateOverallProgress(competencyScores: CompetencyScore[]): number {
    if (competencyScores.length === 0) return 0;
    
    const totalProgress = competencyScores.reduce((sum, score) => {
      return sum + Math.min((score.currentScore / score.targetScore) * 100, 100);
    }, 0);
    
    return Math.round((totalProgress / competencyScores.length) * 10) / 10;
  }

  private analyzeStrengthsAndImprovements(competencyScores: CompetencyScore[]): { strengths: string[]; improvements: string[] } {
    const strengths: string[] = [];
    const improvements: string[] = [];

    competencyScores.forEach(score => {
      if (score.currentScore >= 4.0) {
        strengths.push(score.name);
      } else if (score.currentScore < 2.5) {
        improvements.push(score.name);
      }
    });

    return { strengths, improvements };
  }

  private calculateTestReadiness(competencyScores: CompetencyScore[]): number {
    const coreCompetencies = competencyScores.filter(c => c.currentScore > 0);
    if (coreCompetencies.length === 0) return 0;

    const readyCompetencies = coreCompetencies.filter(c => c.currentScore >= 3.5);
    return Math.round((readyCompetencies.length / coreCompetencies.length) * 100);
  }

  private generateRecommendations(competencyScores: CompetencyScore[], improvements: string[]): string[] {
    const recommendations: string[] = [];

    if (improvements.length > 0) {
      recommendations.push(`Focus on improving: ${improvements.slice(0, 3).join(', ')}`);
    }

    const recentlyAssessed = competencyScores.filter(c => 
      c.lastAssessed > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    if (recentlyAssessed.length < 3) {
      recommendations.push('Schedule more lessons to assess additional competencies');
    }

    return recommendations;
  }

  private async getNextMilestone(learnerId: string): Promise<string> {
    const analytics = await this.getProgressAnalytics(learnerId);
    
    if (analytics.predictedTestReadiness >= 80) {
      return 'Book driving test';
    } else if (analytics.overallProgress >= 60) {
      return 'Practice mock tests';
    } else if (analytics.overallProgress >= 30) {
      return 'Master core manoeuvres';
    } else {
      return 'Complete basic vehicle control skills';
    }
  }

  private estimateCompletionDate(learnerId: string, overallProgress: number): Date | undefined {
    if (overallProgress < 10) return undefined;
    
    const remainingProgress = 100 - overallProgress;
    const estimatedWeeks = Math.ceil(remainingProgress / 8); // Assuming 8% progress per week
    
    return new Date(Date.now() + estimatedWeeks * 7 * 24 * 60 * 60 * 1000);
  }

  private calculateEstimatedDuration(analytics: ProgressAnalytics): number {
    const baseHours = 40; // Standard hours for full course
    const progressFactor = Math.max(0.5, 1 - (analytics.overallProgress / 100));
    return Math.ceil(baseHours * progressFactor);
  }

  private calculateTargetDate(estimatedDuration: number): Date {
    // Assuming 2 lessons per week, 1 hour each
    const weeksRequired = Math.ceil(estimatedDuration / 2);
    return new Date(Date.now() + weeksRequired * 7 * 24 * 60 * 60 * 1000);
  }

  private async generateLearningSteps(pathId: string, analytics: ProgressAnalytics): Promise<void> {
    const steps = [
      { title: 'Vehicle Controls Assessment', type: 'ASSESSMENT', order: 1, estimatedTime: 60 },
      { title: 'Basic Manoeuvres Practice', type: 'LESSON', order: 2, estimatedTime: 120 },
      { title: 'Highway Code Study', type: 'THEORY_STUDY', order: 3, estimatedTime: 180 },
      { title: 'Mock Theory Test', type: 'PRACTICE_TEST', order: 4, estimatedTime: 60 }
    ];

    for (const step of steps) {
      await db.pathStep.create({
        data: {
          pathId,
          title: step.title,
          description: `Complete ${step.title.toLowerCase()} to advance your learning`,
          type: step.type,
          order: step.order,
          estimatedTime: step.estimatedTime,
          isCompleted: false
        }
      });
    }
  }
}

export const progressTrackingService = ProgressTrackingService.getInstance();