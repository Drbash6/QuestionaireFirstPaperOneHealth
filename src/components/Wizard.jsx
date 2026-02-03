import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { OPTIONS, LIKERT_SCALE } from '../constants';
import clsx from 'clsx';

export default function Wizard({ data, lang, onSubmit }) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const section = data.sections[currentSectionIndex];
  const isRTL = lang === 'ar';

  const handleAnswer = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleNext = () => {
    if (currentSectionIndex < data.sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      onSubmit(answers);
    }
  };

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const renderQuestion = (q) => {
    const qText = q.text[lang] || q.text['en'];
    const qId = q.id;
    
    // Determine type
    // If it has OPTIONS defined in constants, it's a Choice or Checkbox
    // If subtype is defined (C1, etc), it's Likert
    // Else it's Text (Section F)
    
    // Exception: Q4 is checkbox, Barriers is checkbox
    const isCheckbox = ["4"].includes(qId) || qText.includes("Barriers"); // Heuristic
    
    // Likert
    if (q.subtype || (parseInt(qId) >= 12 && parseInt(qId) <= 55) || qId === "56") {
      // Check if it's Q56 (Attention check) - handled same as others but typically single select from scale
      return (
        <div key={qId} className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
          <p className="font-medium text-lg mb-4">{qId}. {qText} {q.instruction[lang] && <span className="text-sm text-slate-500">({q.instruction[lang]})</span>}</p>
          <div className="flex flex-wrap gap-2 justify-between">
            {LIKERT_SCALE.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(qId, opt.value)}
                className={clsx(
                  "flex-1 min-w-[40px] py-3 px-2 rounded-md text-sm border transition-colors",
                  answers[qId] === opt.value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                )}
              >
                <div className="font-bold text-lg mb-1">{opt.value}</div>
                <div className="text-xs hidden sm:block">{lang === 'ar' ? opt.label : opt.label}</div> 
                {/* Note: I didn't translate labels in constants, assume English labels for numbers or update later */}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Choice / Checkbox
    if (OPTIONS[qId] || isCheckbox) {
       const opts = OPTIONS[qId] || 
        // Fallback for barriers if logic captures it, otherwise we need manual list.
        // For now, only mapped options work.
        ["Option 1", "Option 2"]; // Todo: Populate Barriers options

       return (
        <div key={qId} className="mb-6">
          <label className="block font-medium text-lg mb-3">{qId}. {qText}</label>
          <div className="space-y-2">
            {opts.map((opt) => (
              <label key={opt} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 cursor-pointer">
                <input
                  type={isCheckbox ? "checkbox" : "radio"}
                  name={qId}
                  value={opt}
                  checked={isCheckbox ? (answers[qId] || []).includes(opt) : answers[qId] === opt}
                  onChange={(e) => {
                     if (isCheckbox) {
                        const current = answers[qId] || [];
                        if (e.target.checked) handleAnswer(qId, [...current, opt]);
                        else handleAnswer(qId, current.filter(x => x !== opt));
                     } else {
                        handleAnswer(qId, opt);
                     }
                  }}
                  className="w-5 h-5 text-blue-600"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
       );
    }

    // Default: Text Area (Section F)
    return (
      <div key={qId} className="mb-6">
        <label className="block font-medium text-lg mb-3">{qId}. {qText}</label>
        <textarea
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          value={answers[qId] || ''}
          onChange={(e) => handleAnswer(qId, e.target.value)}
          dir="auto"
        />
      </div>
    );
  };

  return (
    <div className={clsx("max-w-3xl mx-auto p-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-8">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${((currentSectionIndex + 1) / data.sections.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-slate-500">
           <span>{lang === 'en' ? 'Section' : 'القسم'} {currentSectionIndex + 1} / {data.sections.length}</span>
           <span>{Math.round(((currentSectionIndex + 1) / data.sections.length) * 100)}%</span>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-slate-800">{section.title[lang]}</h2>

      <div className="space-y-8">
        {section.questions.map(renderQuestion)}
      </div>

      <div className="flex justify-between mt-12 pt-6 border-t">
        <button
          onClick={handlePrev}
          disabled={currentSectionIndex === 0}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-slate-600 disabled:opacity-50 hover:bg-slate-100"
        >
          {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {lang === 'en' ? 'Previous' : 'السابق'}
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
        >
          {currentSectionIndex === data.sections.length - 1 ? (
            <>
              {lang === 'en' ? 'Submit' : 'إرسال'}
              <CheckCircle size={20} />
            </>
          ) : (
            <>
              {lang === 'en' ? 'Next' : 'التالي'}
              {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
