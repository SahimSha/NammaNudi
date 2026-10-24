import React, { useState, useMemo, useCallback } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Flame
} from 'lucide-react';
import { PHRASES } from '../data/phrases';
import { CATEGORIES } from '../data/categories';
import { useApp } from '../context/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import type { QuizQuestion, QuizResult } from '../types';

export const QuizPage: React.FC = () => {
  const { recordQuizResult, progress, setShowToSpeakPhrase, showToast } = useApp();
  const { speak, stop, isSpeaking } = useSpeech({
    onErrorNotice: (msg) => showToast(msg, 'warning')
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<QuizResult['answers']>([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  // Generate 5-10 randomized quiz questions from PHRASES
  const generateQuestions = useCallback((catId: string): QuizQuestion[] => {
    const pool =
      catId === 'all'
        ? [...PHRASES]
        : PHRASES.filter((p) => p.categoryId === catId);

    // Shuffle pool
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const selectedPhrases = shuffledPool.slice(0, 6);

    return selectedPhrases.map((phrase, idx) => {
      // Determine question type: 50% English to Kannada, 50% Kannada/Scenario to English
      const isEnglishPrompt = idx % 2 === 0;

      // Smart distractors: choose 3 distinct other phrases (preferably same or related category)
      const otherPhrases = PHRASES.filter((p) => p.id !== phrase.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const category = CATEGORIES.find((c) => c.id === phrase.categoryId);
      const categoryName = category ? category.name : 'Everyday Kannada';

      let options;
      if (isEnglishPrompt) {
        // Prompt is English -> Options are Kannada + Transliteration
        const allOptionPhrases = [phrase, ...otherPhrases].sort(
          () => 0.5 - Math.random()
        );
        options = allOptionPhrases.map((op) => ({
          id: op.id,
          text: op.kannada,
          subtext: op.transliteration,
          isCorrect: op.id === phrase.id
        }));

        return {
          id: `q-${idx}-${phrase.id}`,
          phraseId: phrase.id,
          prompt: `How do you say: "${phrase.english}"?`,
          promptSubtext: phrase.situation
            ? `Scenario: ${phrase.situation}`
            : undefined,
          type: 'en-to-kn' as const,
          options,
          explanation: `In Kannada: "${phrase.kannada}" (${phrase.transliteration}). ${phrase.contextNote}`,
          categoryName
        };
      } else {
        // Prompt is Kannada -> Options are English meanings
        const allOptionPhrases = [phrase, ...otherPhrases].sort(
          () => 0.5 - Math.random()
        );
        options = allOptionPhrases.map((op) => ({
          id: op.id,
          text: op.english,
          isCorrect: op.id === phrase.id
        }));

        return {
          id: `q-${idx}-${phrase.id}`,
          phraseId: phrase.id,
          prompt: phrase.kannada,
          promptSubtext: `Transliteration: ${phrase.transliteration}`,
          type: 'kn-to-en' as const,
          options,
          explanation: `"${phrase.kannada}" means "${phrase.english}". ${phrase.contextNote}`,
          categoryName
        };
      }
    });
  }, []);

  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    generateQuestions('all')
  );

  const startNewQuiz = (catId: string = selectedCategory) => {
    stop();
    setSelectedCategory(catId);
    setQuestions(generateQuestions(catId));
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setUserScore(0);
    setUserAnswers([]);
    setIsQuizCompleted(false);
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;

    setSelectedOptionId(optionId);
    setIsAnswered(true);

    const isCorrect = currentQuestion.options.find(
      (o) => o.id === optionId
    )?.isCorrect;

    if (isCorrect) {
      setUserScore((prev) => prev + 1);
    }

    const answerRecord = {
      questionId: currentQuestion.id,
      userAnswerId: optionId,
      correctAnswerId: currentQuestion.phraseId,
      isCorrect: Boolean(isCorrect)
    };

    setUserAnswers((prev) => [...prev, answerRecord]);
  };

  const handleNextQuestion = () => {
    stop();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      // Complete Quiz
      setIsQuizCompleted(true);
      const finalScore = userScore;
      recordQuizResult({
        score: finalScore,
        total: questions.length,
        date: new Date().toISOString(),
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        answers: userAnswers
      });
    }
  };

  // Associated phrase for current question (for speech)
  const questionPhrase = useMemo(() => {
    if (!currentQuestion) return null;
    return PHRASES.find((p) => p.id === currentQuestion.phraseId) || null;
  }, [currentQuestion]);

  return (
    <div className="space-y-6 pb-16 max-w-2xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-teal-800 mb-1">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Interactive Learning Quiz</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Everyday Practice Quiz
          </h1>
        </div>

        {/* Learning Streak Pill */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 font-bold text-xs shadow-xs">
          <Flame className="w-4 h-4 text-amber-600 fill-amber-500 animate-bounce" />
          <span>{progress.streakDays} Day Streak</span>
        </div>
      </div>

      {/* Category Filter Pills for Quiz */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => startNewQuiz('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-teal-900 text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
          }`}
        >
          All Situations
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => startNewQuiz(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === c.id
                ? 'bg-teal-900 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {!isQuizCompleted ? (
        currentQuestion ? (
          <div className="space-y-6">
            {/* Progress Bar & Counter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-500">
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-teal-800">
                  Score: {userScore} / {questions.length}
                </span>
              </div>
              <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-700 to-amber-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestionIndex + (isAnswered ? 1 : 0)) /
                        questions.length) *
                      100
                    }%`
                  }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-4 text-center relative">
              <span className="inline-block text-[11px] font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                {currentQuestion.categoryName}
              </span>

              {/* Question Prompt */}
              {currentQuestion.type === 'kn-to-en' ? (
                <div>
                  <h2 className="font-kannada text-3xl sm:text-4xl font-extrabold text-stone-900 leading-snug my-2">
                    {currentQuestion.prompt}
                  </h2>
                  <p className="text-base font-bold text-teal-700 italic">
                    {currentQuestion.promptSubtext}
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-snug my-2">
                    {currentQuestion.prompt}
                  </h2>
                  {currentQuestion.promptSubtext && (
                    <p className="text-xs font-semibold text-stone-500 mt-1">
                      {currentQuestion.promptSubtext}
                    </p>
                  )}
                </div>
              )}

              {/* Audio Listen Button if available */}
              {questionPhrase && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (isSpeaking) {
                        stop();
                      } else {
                        speak(questionPhrase.kannada, undefined, questionPhrase.id);
                      }
                    }}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      isSpeaking
                        ? 'bg-rose-100 text-rose-800 animate-pulse'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-700" />
                        <span>Stop Audio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-teal-800" />
                        <span>Pronounce Question</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOptionId === option.id;

                let stateStyle = 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800';

                if (isAnswered) {
                  if (option.isCorrect) {
                    stateStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500';
                  } else if (isSelected && !option.isCorrect) {
                    stateStyle = 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-500';
                  } else {
                    stateStyle = 'bg-stone-50 border-stone-200 opacity-50';
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all shadow-xs flex items-center justify-between group ${stateStyle}`}
                  >
                    <div className="flex-1 pr-2">
                      <p className={`text-sm sm:text-base font-semibold ${option.subtext ? 'font-kannada text-lg' : ''}`}>
                        {option.text}
                      </p>
                      {option.subtext && (
                        <p className="text-xs font-semibold text-teal-700 italic mt-0.5">
                          {option.subtext}
                        </p>
                      )}
                    </div>

                    {isAnswered && (
                      <div>
                        {option.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        ) : isSelected ? (
                          <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                        ) : null}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next Button (Shows immediately on answer) */}
            {isAnswered && (
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-start space-x-2 text-amber-950">
                  <HelpCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 mb-1">
                      Context & Meaning
                    </h4>
                    <p className="text-xs sm:text-sm font-medium text-amber-950 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-amber-200/60">
                  {questionPhrase && (
                    <button
                      onClick={() => setShowToSpeakPhrase(questionPhrase)}
                      className="text-xs font-bold text-teal-900 hover:underline"
                    >
                      Open in Show-to-Speak mode →
                    </button>
                  )}

                  <button
                    onClick={handleNextQuestion}
                    className="ml-auto px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-1 transition-transform active:scale-95"
                  >
                    <span>
                      {currentQuestionIndex < questions.length - 1
                        ? 'Next Question'
                        : 'View Results'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null
      ) : (
        /* Quiz Complete Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              Practice Session Complete!
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              You scored {userScore} out of {questions.length} questions correctly.
            </p>
          </div>

          {/* Score Badge */}
          <div className="p-6 bg-[#FAF8F5] rounded-3xl border border-stone-200/80 inline-block w-full max-w-sm">
            <div className="text-5xl font-black text-teal-950 mb-1">
              {Math.round((userScore / questions.length) * 100)}%
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-teal-800">
              {userScore === questions.length
                ? '🌟 Shabaash! Outstanding Accuracy!'
                : userScore >= questions.length / 2
                ? '👍 Thumba Chennagide! Great Effort!'
                : '💪 Keep practicing! You will get there!'}
            </p>
          </div>

          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Your results have been recorded to your local progress dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => startNewQuiz(selectedCategory)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Again</span>
            </button>

            <button
              onClick={() => startNewQuiz('all')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
            >
              <span>Try All Categories</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

