import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ControlPanel = ({
  isTimerRunning = true,
  canShowResults = false,
  canNextQuestion = false,
  isLastQuestion = false,
  onNextQuestion = null,
  onPauseTimer = null,
  onResumeTimer = null,
  onShowResults = null,
  onRestartQuestion = null,
  onEndQuiz = null,
  sessionStats = {}
}) => {
  const {
    totalParticipants = 0,
    answeredCount = 0,
    averageResponseTime = 0,
    currentQuestionNumber = 1
  } = sessionStats;

  const responsePercentage = totalParticipants > 0 ? (answeredCount / totalParticipants) * 100 : 0;

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Quiz Controls</h3>
      </div>

      {/* Session Stats */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{answeredCount}</div>
            <div className="text-xs text-muted-foreground">Responses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{Math.round(responsePercentage)}%</div>
            <div className="text-xs text-muted-foreground">Completion</div>
          </div>
        </div>
        
        {/* Response Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Response Rate</span>
            <span className="text-xs font-medium text-foreground">
              {answeredCount}/{totalParticipants}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${responsePercentage}%` }}
            />
          </div>
        </div>

        {averageResponseTime > 0 && (
          <div className="mt-3 text-center">
            <div className="text-sm text-muted-foreground">
              Avg. Response Time: <span className="font-medium text-foreground">{averageResponseTime}s</span>
            </div>
          </div>
        )}
      </div>

      {/* Primary Controls */}
      <div className="flex-1 p-4 space-y-3">
        {/* Timer Control */}
        <Button
          variant={isTimerRunning ? "warning" : "success"}
          fullWidth
          iconName={isTimerRunning ? "Pause" : "Play"}
          iconPosition="left"
          onClick={isTimerRunning ? onPauseTimer : onResumeTimer}
          className="h-12"
        >
          {isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
        </Button>

        {/* Show Results */}
        <Button
          variant="secondary"
          fullWidth
          iconName="BarChart3"
          iconPosition="left"
          onClick={onShowResults}
          disabled={!canShowResults}
          className="h-12"
        >
          Show Results
        </Button>

        {/* Next Question */}
        <Button
          variant="default"
          fullWidth
          iconName={isLastQuestion ? "Flag" : "ArrowRight"}
          iconPosition="left"
          onClick={onNextQuestion}
          disabled={!canNextQuestion}
          className="h-12"
        >
          {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
        </Button>

        {/* Divider */}
        <div className="border-t border-border my-4" />

        {/* Secondary Controls */}
        <div className="space-y-2">
          <Button
            variant="outline"
            fullWidth
            iconName="RotateCcw"
            iconPosition="left"
            onClick={onRestartQuestion}
            className="h-10"
          >
            Restart Question
          </Button>

          <Button
            variant="ghost"
            fullWidth
            iconName="Download"
            iconPosition="left"
            className="h-10"
          >
            Export Results
          </Button>
        </div>
      </div>

      {/* Emergency Controls */}
      <div className="p-4 border-t border-border">
        <div className="space-y-2">
          <Button
            variant="destructive"
            fullWidth
            iconName="Square"
            iconPosition="left"
            onClick={onEndQuiz}
            className="h-10"
          >
            End Quiz
          </Button>
          
          <div className="text-center">
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Emergency Reset
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="p-3 bg-muted/30 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>Question {currentQuestionNumber}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-gentle" />
            <span>Live Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;