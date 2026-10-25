import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  HelpCircle,
  Award,
  ChevronLeft
} from 'lucide-react';
import { CONVERSATION_SCENARIOS } from '../data/conversations';
import type { ConversationScenario, DialogueStep, DialogueChoice } from '../data/conversations';
import { useSpeech } from '../hooks/useSpeech';
import { useApp } from '../context/AppContext';

const STORAGE_KEY_CONV_PROGRESS = 'nammanudi_conversations_v1';

export const ConversationSimulatorPage: React.FC = () => {
  const { showToast } = useApp();
  const { speak, stop, isSpeaking } = useSpeech({
    onErrorNotice: (msg) => showToast(msg, 'warning')
  });

  const [activeScenario, setActiveScenario] = useState<ConversationScenario | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string>('step-1');
  const [selectedChoice, setSelectedChoice] = useState<DialogueChoice | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Completed scenario IDs persisted in localStorage
  const [completedScenarioIds, setCompletedScenarioIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONV_PROGRESS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Stop reference speech on unmount or scenario exit
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const handleSelectScenario = (scenario: ConversationScenario) => {
    stop();
    setActiveScenario(scenario);
    setCurrentStepId(scenario.initialStepId);
    setSelectedChoice(null);
    setShowHint(false);
    setScore(0);
    setTotalSteps(0);
    setIsCompleted(false);
  };

  const handleExitScenario = () => {
    stop();
    setActiveScenario(null);
    setSelectedChoice(null);
    setIsCompleted(false);
  };

  const currentStep: DialogueStep | null =
    activeScenario && activeScenario.steps[currentStepId]
      ? activeScenario.steps[currentStepId]
      : null;

  const handleChooseOption = (choice: DialogueChoice) => {
    if (selectedChoice) return; // Prevent double taps

    setSelectedChoice(choice);
    setTotalSteps((prev) => prev + 1);
    if (choice.isOptimal) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextStep = () => {
    stop();
    if (!selectedChoice || !activeScenario) return;

    if (selectedChoice.nextStepId && activeScenario.steps[selectedChoice.nextStepId]) {
      setCurrentStepId(selectedChoice.nextStepId);
      setSelectedChoice(null);
      setShowHint(false);
    } else {
      // Completed scenario!
      setIsCompleted(true);
      const updated = Array.from(new Set([...completedScenarioIds, activeScenario.id]));
      setCompletedScenarioIds(updated);
      try {
        localStorage.setItem(STORAGE_KEY_CONV_PROGRESS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save conversation progress:', e);
      }
    }
  };

  const handleRestart = () => {
    if (!activeScenario) return;
    stop();
    setCurrentStepId(activeScenario.initialStepId);
    setSelectedChoice(null);
    setShowHint(false);
    setScore(0);
    setTotalSteps(0);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-6 pb-16 max-w-3xl mx-auto">
      {/* Page Title */}
      {!activeScenario && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 mb-2">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Interactive Practice</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                Real-Life Kannada Conversations
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
                Step into realistic everyday Karnataka dialogues with instant feedback and cultural tips.
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-2xl text-amber-950 font-bold text-xs self-start sm:self-auto">
              <Award className="w-4 h-4 text-amber-600" />
              <span>
                {completedScenarioIds.length} / {CONVERSATION_SCENARIOS.length} Scenarios Mastered
              </span>
            </div>
          </div>

          {/* Scenario Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONVERSATION_SCENARIOS.map((scenario) => {
              const isMastered = completedScenarioIds.includes(scenario.id);
              return (
                <div
                  key={scenario.id}
                  onClick={() => handleSelectScenario(scenario)}
                  className="group bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm hover:shadow-md hover:border-teal-400 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl p-2.5 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                        {scenario.avatarEmoji}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                          {scenario.difficulty}
                        </span>
                        {isMastered && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Mastered</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <h2 className="text-lg font-bold text-stone-900 group-hover:text-teal-900 transition-colors">
                      {scenario.title}
                    </h2>
                    <p className="font-kannada text-xs font-semibold text-teal-800 mb-2">
                      {scenario.kannadaTitle}
                    </p>
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      {scenario.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-500">
                    <span>With {scenario.partnerName} ({scenario.partnerRole})</span>
                    <button className="flex items-center space-x-1 text-teal-800 font-bold group-hover:translate-x-1 transition-transform">
                      <span>Start</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ACTIVE SCENARIO SIMULATOR INTERFACE */}
      {activeScenario && currentStep && !isCompleted && (
        <div className="space-y-5">
          {/* Top Bar: Back & Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <button
              onClick={handleExitScenario}
              className="flex items-center space-x-1 text-xs font-bold text-stone-600 hover:text-stone-900 px-2.5 py-1.5 rounded-xl hover:bg-stone-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>All Scenarios</span>
            </button>

            <div className="text-center">
              <h2 className="text-sm font-bold text-stone-900">{activeScenario.title}</h2>
              <p className="text-[11px] font-kannada text-teal-800">{activeScenario.kannadaTitle}</p>
            </div>

            <button
              onClick={handleRestart}
              title="Restart scenario"
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* NPC Dialogue Bubble Card */}
          <div className="bg-[#FAF8F5] rounded-3xl p-6 border-2 border-stone-200 shadow-sm relative space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{activeScenario.avatarEmoji}</span>
                <div>
                  <span className="text-xs font-extrabold text-stone-800">
                    {currentStep.speakerName}
                  </span>
                  {currentStep.situationNote && (
                    <p className="text-[11px] text-stone-500">{currentStep.situationNote}</p>
                  )}
                </div>
              </div>

              {/* Listen to NPC speech */}
              <button
                onClick={() => {
                  if (isSpeaking) {
                    stop();
                  } else {
                    speak(currentStep.kannada);
                  }
                }}
                className={`p-2 rounded-xl transition-all ${
                  isSpeaking
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-teal-800 hover:bg-teal-900 text-white'
                }`}
                title={isSpeaking ? 'Stop speaking' : 'Listen to dialogue'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Kannada speech text */}
            <div className="pt-2">
              <h3 className="font-kannada text-2xl sm:text-3xl font-black text-teal-950 leading-snug">
                {currentStep.kannada}
              </h3>
              <p className="text-sm sm:text-base font-bold text-teal-700 italic mt-1">
                {currentStep.transliteration}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-stone-700 mt-1">
                "{currentStep.english}"
              </p>
            </div>
          </div>

          {/* User Response Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Your Response Choice</span>
              </span>

              {/* Hint button */}
              {currentStep.hint && (
                <button
                  onClick={() => setShowHint((prev) => !prev)}
                  className="flex items-center space-x-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors"
                >
                  <HelpCircle className="w-3 h-3 text-amber-700" />
                  <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
                </button>
              )}
            </div>

            {/* Hint Box */}
            {showHint && currentStep.hint && (
              <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-2xl text-xs text-amber-950 leading-relaxed flex items-start gap-2">
                <span className="font-bold text-amber-800">💡 Hint:</span>
                <span>{currentStep.hint}</span>
              </div>
            )}

            {/* Choice Buttons */}
            <div className="space-y-2.5">
              {currentStep.choices.map((choice) => {
                const isSelected = selectedChoice?.id === choice.id;
                let borderClass = 'border-stone-200 hover:border-teal-300 bg-white';
                if (selectedChoice) {
                  if (isSelected) {
                    borderClass = choice.isOptimal
                      ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                      : 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20';
                  } else {
                    borderClass = 'border-stone-200 bg-stone-50 opacity-50';
                  }
                }

                return (
                  <button
                    key={choice.id}
                    onClick={() => handleChooseOption(choice)}
                    disabled={Boolean(selectedChoice)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all shadow-xs ${borderClass}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-kannada text-lg font-bold text-stone-900 leading-snug">
                          {choice.kannada}
                        </p>
                        <p className="text-xs font-semibold text-teal-800 italic mt-0.5">
                          {choice.transliteration}
                        </p>
                        <p className="text-xs text-stone-600 mt-0.5">
                          "{choice.english}"
                        </p>
                      </div>

                      {isSelected && (
                        <div className="flex-shrink-0 mt-0.5">
                          {choice.isOptimal ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback & Continue Action */}
            {selectedChoice && (
              <div className="mt-4 p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3 animate-in fade-in">
                <div className="flex items-start gap-2 text-xs leading-relaxed">
                  <span className="font-bold text-teal-900 flex-shrink-0">
                    {selectedChoice.isOptimal ? '✓ Feedback:' : 'ℹ️ Cultural Note:'}
                  </span>
                  <span className="text-stone-700">{selectedChoice.feedback}</span>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleNextStep}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-md transition-all active:scale-98"
                  >
                    <span>{selectedChoice.nextStepId ? 'Continue Conversation' : 'Finish Scenario'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COMPLETION MODAL */}
      {activeScenario && isCompleted && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-lg text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl shadow-sm">
            🎉
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Conversation Completed!
            </span>
            <h2 className="text-2xl font-black text-stone-900 mt-2">
              Well Done in {activeScenario.title}!
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mt-1">
              You navigated real-world everyday Kannada dialogue with {activeScenario.partnerName}.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 max-w-sm mx-auto flex items-center justify-around text-center">
            <div>
              <span className="text-2xl font-black text-teal-950">
                {score} / {totalSteps}
              </span>
              <p className="text-[11px] font-semibold text-stone-500 mt-0.5">Optimal Replies</p>
            </div>
            <div className="h-8 w-px bg-stone-200"></div>
            <div>
              <span className="text-2xl font-black text-emerald-700">
                {totalSteps > 0 ? Math.round((score / totalSteps) * 100) : 100}%
              </span>
              <p className="text-[11px] font-semibold text-stone-500 mt-0.5">Politeness Score</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practise Again</span>
            </button>

            <button
              onClick={handleExitScenario}
              className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-6 py-3 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-md transition-all"
            >
              <span>Back to All Scenarios</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
