import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Play,
  Award,
  RotateCcw
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Mock quiz data
const mockQuiz = {
  id: "1",
  title: "Safety Fundamentals Assessment",
  description: "Test your knowledge of workplace safety procedures",
  questions: [
    {
      id: "1",
      type: "multiple_choice",
      question: "What is the first step when approaching a machine for maintenance?",
      options: ["Turn off the machine", "Check safety guards", "Wear PPE", "Read the manual"],
      correct_answer: "Turn off the machine",
      explanation: "Always turn off and lock out the machine before performing any maintenance work.",
      points: 10,
      reel_timestamp: 15
    },
    {
      id: "2", 
      type: "true_false",
      question: "It's acceptable to skip safety checks if you're in a hurry.",
      correct_answer: "false",
      explanation: "Safety checks should never be skipped, regardless of time constraints.",
      points: 10
    },
    {
      id: "3",
      type: "short_answer",
      question: "What does PPE stand for?",
      correct_answer: "Personal Protective Equipment",
      explanation: "PPE stands for Personal Protective Equipment and includes items like helmets, gloves, and safety glasses.",
      points: 15
    }
  ],
  passing_score: 70,
  time_limit_minutes: 30,
  attempts_allowed: 3
};

const questionSchema = z.object({
  answer: z.string().min(1, "Please provide an answer"),
});

type QuestionForm = z.infer<typeof questionSchema>;

export default function QuizPage() {
  const { quizId: _quizId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(mockQuiz.time_limit_minutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<QuestionForm>({
    resolver: zodResolver(questionSchema),
  });

  const currentQuestion = mockQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / mockQuiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === mockQuiz.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted && !showResults) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmitQuiz();
    }
  }, [timeRemaining, isSubmitted, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
    form.setValue('answer', answer);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmitQuiz();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      form.reset();
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
      form.reset();
    }
  };

  const handleSubmitQuiz = async () => {
    setIsLoading(true);
    setIsSubmitted(true);
    
    // Calculate score
    let totalScore = 0;
    let maxScore = 0;
    
    mockQuiz.questions.forEach(question => {
      maxScore += question.points;
      const userAnswer = answers[question.id];
      if (userAnswer) {
        if (question.type === 'multiple_choice' || question.type === 'true_false') {
          if (userAnswer === question.correct_answer) {
            totalScore += question.points;
          }
        } else if (question.type === 'short_answer') {
          // Simple text matching for demo
          if (userAnswer.toLowerCase().includes(question.correct_answer.toLowerCase())) {
            totalScore += question.points;
          }
        }
      }
    });
    
    const percentage = Math.round((totalScore / maxScore) * 100);
    setScore(percentage);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setShowResults(true);
    setIsLoading(false);
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(mockQuiz.time_limit_minutes * 60);
    setIsSubmitted(false);
    setShowResults(false);
    setScore(0);
    form.reset();
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (showResults) {
    const passed = score >= mockQuiz.passing_score;
    
    return (
      <div className="min-h-screen bg-gradient-mesh p-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="animate-fade-in-up">
            <CardHeader className="text-center">
              <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                passed ? 'bg-success/10' : 'bg-destructive/10'
              }`}>
                {passed ? (
                  <Award className="h-10 w-10 text-success" />
                ) : (
                  <AlertCircle className="h-10 w-10 text-destructive" />
                )}
              </div>
              <CardTitle className="text-3xl">
                {passed ? 'Congratulations!' : 'Quiz Complete'}
              </CardTitle>
              <CardDescription className="text-lg">
                {passed 
                  ? 'You passed the assessment and earned a certificate!'
                  : 'You need to score at least 70% to pass. Consider reviewing the material and trying again.'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
                <div className="text-muted-foreground">
                  Score: {score}% (Required: {mockQuiz.passing_score}%)
                </div>
                <Progress value={score} className="mt-4 h-3" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Question Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockQuiz.questions.map((question, index) => {
                      const userAnswer = answers[question.id];
                      const isCorrect = userAnswer === question.correct_answer;
                      return (
                        <div key={question.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              isCorrect ? 'bg-success/10' : 'bg-destructive/10'
                            }`}>
                              {isCorrect ? (
                                <CheckCircle className="h-4 w-4 text-success" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-destructive" />
                              )}
                            </div>
                            <span className="font-medium">Question {index + 1}</span>
                          </div>
                          <Badge variant={isCorrect ? 'default' : 'destructive'}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </Badge>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quiz Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Questions:</span>
                      <span>{mockQuiz.questions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time Limit:</span>
                      <span>{mockQuiz.time_limit_minutes} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Attempts:</span>
                      <span>1 of {mockQuiz.attempts_allowed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={passed ? 'default' : 'destructive'}>
                        {passed ? 'Passed' : 'Failed'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {passed ? (
                  <Button size="lg" onClick={handleContinue}>
                    Continue to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button size="lg" variant="outline" onClick={handleRetake}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Retake Quiz
                  </Button>
                )}
                <Button size="lg" variant="outline" onClick={() => navigate('/courses')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-mesh p-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="animate-fade-in-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{mockQuiz.title}</CardTitle>
                <CardDescription>{mockQuiz.description}</CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(timeRemaining)}</span>
                </div>
                <Badge variant="outline">
                  Question {currentQuestionIndex + 1} of {mockQuiz.questions.length}
                </Badge>
              </div>
            </div>
            
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {currentQuestion.question}
              </h3>

              {currentQuestion.type === 'multiple_choice' && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'true_false' && (
                <div className="space-y-3">
                  {['true', 'false'].map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'short_answer' && (
                <div className="space-y-2">
                  <textarea
                    placeholder="Enter your answer here..."
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              )}

              {currentQuestion.reel_timestamp && (
                <Alert>
                  <Play className="h-4 w-4" />
                  <AlertDescription>
                    This question relates to the video at {Math.floor(currentQuestion.reel_timestamp / 60)}:
                    {(currentQuestion.reel_timestamp % 60).toString().padStart(2, '0')}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstQuestion || isSubmitted}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id] || isSubmitted || isLoading}
              >
                {isLoading ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : isLastQuestion ? (
                  'Submit Quiz'
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}