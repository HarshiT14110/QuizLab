import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const QuizLibraryTable = ({ quizzes = [] }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [sortBy, setSortBy] = useState('lastUsed');

  const mockQuizzes = [
    {
      id: 1,
      title: 'Introduction to Algebra',
      subject: 'Mathematics',
      questionCount: 15,
      lastUsed: '2025-01-18',
      createdDate: '2025-01-10',
      status: 'active',
      participants: 28,
      averageScore: 85
    },
    {
      id: 2,
      title: 'World War II Timeline',
      subject: 'History',
      questionCount: 20,
      lastUsed: '2025-01-17',
      createdDate: '2025-01-08',
      status: 'active',
      participants: 22,
      averageScore: 78
    },
    {
      id: 3,
      title: 'Chemical Bonding Basics',
      subject: 'Chemistry',
      questionCount: 12,
      lastUsed: '2025-01-15',
      createdDate: '2025-01-05',
      status: 'draft',
      participants: 0,
      averageScore: 0
    },
    {
      id: 4,
      title: 'Shakespeare\'s Hamlet',
      subject: 'English Literature',
      questionCount: 18,
      lastUsed: '2025-01-14',
      createdDate: '2025-01-03',
      status: 'active',
      participants: 31,
      averageScore: 82
    },
    {
      id: 5,
      title: 'Photosynthesis Process',
      subject: 'Biology',
      questionCount: 10,
      lastUsed: '2025-01-12',
      createdDate: '2025-01-01',
      status: 'archived',
      participants: 25,
      averageScore: 88
    }
  ];

  const quizzesToShow = quizzes?.length > 0 ? quizzes : mockQuizzes;

  const subjectOptions = [
    { value: '', label: 'All Subjects' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'History', label: 'History' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'English Literature', label: 'English Literature' },
    { value: 'Biology', label: 'Biology' }
  ];

  const sortOptions = [
    { value: 'lastUsed', label: 'Last Used' },
    { value: 'title', label: 'Title' },
    { value: 'createdDate', label: 'Created Date' },
    { value: 'questionCount', label: 'Question Count' }
  ];

  const filteredQuizzes = quizzesToShow?.filter(quiz => 
      quiz?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) &&
      (selectedSubject === '' || quiz?.subject === selectedSubject)
    )?.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a?.title?.localeCompare(b?.title);
        case 'createdDate':
          return new Date(b.createdDate) - new Date(a.createdDate);
        case 'questionCount':
          return b?.questionCount - a?.questionCount;
        default:
          return new Date(b.lastUsed) - new Date(a.lastUsed);
      }
    });

  const getSubjectIcon = (subject) => {
    const iconMap = {
      'Mathematics': 'Calculator',
      'History': 'BookOpen',
      'Chemistry': 'Atom',
      'English Literature': 'Book',
      'Biology': 'Microscope'
    };
    return iconMap?.[subject] || 'FileText';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'text-success bg-success/10', label: 'Active' },
      draft: { color: 'text-warning bg-warning/10', label: 'Draft' },
      archived: { color: 'text-muted-foreground bg-muted', label: 'Archived' }
    };
    const config = statusConfig?.[status] || statusConfig?.draft;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const handleSelectQuiz = (quizId) => {
    setSelectedQuizzes(prev => 
      prev?.includes(quizId) 
        ? prev?.filter(id => id !== quizId)
        : [...prev, quizId]
    );
  };

  const handleSelectAll = () => {
    setSelectedQuizzes(
      selectedQuizzes?.length === filteredQuizzes?.length 
        ? [] 
        : filteredQuizzes?.map(quiz => quiz?.id)
    );
  };

  const handleStartLiveQuiz = (quiz) => {
    navigate('/live-quiz-host-control', { 
      state: { 
        quizId: quiz?.id,
        quizTitle: quiz?.title,
        questionCount: quiz?.questionCount
      } 
    });
  };

  const handleEditQuiz = (quiz) => {
    navigate('/ai-quiz-creation', { 
      state: { 
        editMode: true,
        quizId: quiz?.id,
        quizData: quiz
      } 
    });
  };

  const handleDuplicateQuiz = (quiz) => {
    navigate('/ai-quiz-creation', { 
      state: { 
        duplicateMode: true,
        sourceQuiz: quiz
      } 
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Quiz Library</h2>
            <p className="text-sm text-muted-foreground">Manage your quiz collection</p>
          </div>
          <Button
            variant="default"
            onClick={() => navigate('/ai-quiz-creation')}
            iconName="Plus"
            iconPosition="left"
          >
            New Quiz
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select
              options={subjectOptions}
              value={selectedSubject}
              onChange={setSelectedSubject}
              placeholder="Filter by subject"
              className="w-48"
            />
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sort by"
              className="w-40"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedQuizzes?.length > 0 && (
          <div className="flex items-center justify-between mt-4 p-3 bg-primary/5 rounded-lg">
            <span className="text-sm text-foreground">
              {selectedQuizzes?.length} quiz{selectedQuizzes?.length > 1 ? 'es' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" iconName="Archive">
                Archive
              </Button>
              <Button variant="outline" size="sm" iconName="Copy">
                Duplicate
              </Button>
              <Button variant="destructive" size="sm" iconName="Trash2">
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 w-12">
                <input
                  type="checkbox"
                  checked={selectedQuizzes?.length === filteredQuizzes?.length && filteredQuizzes?.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Quiz</th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Subject</th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Questions</th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Last Used</th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuizzes?.map((quiz) => (
              <tr key={quiz?.id} className="border-t border-border hover:bg-muted/25 transition-colors">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedQuizzes?.includes(quiz?.id)}
                    onChange={() => handleSelectQuiz(quiz?.id)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon name={getSubjectIcon(quiz?.subject)} size={16} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{quiz?.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {quiz?.participants > 0 ? `${quiz?.participants} participants • ${quiz?.averageScore}% avg` : 'Not used yet'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">{quiz?.subject}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">{quiz?.questionCount}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {new Date(quiz.lastUsed)?.toLocaleDateString()}
                  </span>
                </td>
                <td className="p-4">
                  {getStatusBadge(quiz?.status)}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleStartLiveQuiz(quiz)}
                      iconName="Play"
                      iconSize={14}
                      disabled={quiz?.status === 'archived'}
                    >
                      Start Live
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditQuiz(quiz)}
                      iconName="Edit"
                      iconSize={14}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicateQuiz(quiz)}
                      iconName="Copy"
                      iconSize={14}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      iconSize={14}
                      className="text-error hover:text-error"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Empty State */}
      {filteredQuizzes?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No quizzes found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedSubject 
              ? 'Try adjusting your search or filter criteria' :'Create your first quiz to get started'
            }
          </p>
          <Button
            variant="default"
            onClick={() => navigate('/ai-quiz-creation')}
            iconName="Plus"
            iconPosition="left"
          >
            Create Your First Quiz
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizLibraryTable;