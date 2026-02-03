import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { OPTIONS, LIKERT_SCALE } from '../constants';
import clsx from 'clsx';

export default function Wizard({ data, lang, onSubmit }) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const section = data.sections[currentSectionIndex];
  const isRTL = lang === 'ar';

  const handleAnswer = (sectionId, qId, value) => {
    // Structure keys as "SectionID_QuestionID" to prevent overwrites (e.g. A_1 vs F_1)
    const key = `${sectionId}_${qId}`;
    setAnswers(prev => ({ ...prev, [key]: value }));
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
    const answerKey = `${section.id}_${qId}`;
    
    // --- SECTION F: Qualitative (Text Area) ---
    // Specifically targets Section F or the final qualitative questions
    if (section.id === 'F') {
      return (
        <div key={qId} className="mb-6">
          <label className="block font-medium text-lg mb-3">{qId}. {qText}</label>
          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[120px]"
            value={answers[answerKey] || ''}
            onChange={(e) => handleAnswer(section.id, qId, e.target.value)}
            dir="auto"
            placeholder={lang === 'en' ? "Type your answer here..." : "اكتب إجابتك هنا..."}
          />
        </div>
      );
    }

    // --- SECTION E: Attention Check (Special UI) ---
    if (section.id === 'E' || qId === "56") {
      return (
        <div key={qId} className="mb-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
           <p className="font-bold text-lg mb-4 text-center">
             {qId}. {qText} <br/> 
             <span className="text-red-600">
               {lang === 'en' ? "(Please click the button used to Signify Agreement)" : "(يرجى النقر على زر الموافقة)"}
             </span>
           </p>
           <div className="flex justify-center">
             <button
                onClick={() => handleAnswer(section.id, qId, "Agree")}
                className={clsx(
                  "px-8 py-4 rounded-full font-bold text-lg shadow-sm transition-all transform hover:scale-105",
                  answers[answerKey] === "Agree"
                    ? "bg-green-600 text-white ring-4 ring-green-200"
                    : "bg-white text-slate-700 border-2 border-slate-300 hover:border-green-500 hover:text-green-600"
                )}
             >
                {lang === 'en' ? "I Agree" : "أوافق"}
             </button>
           </div>
        </div>
      );
    }

    // --- SECTION D: Barriers (Checkbox + Other) ---
    // Heuristic: Section D or explicit "Barriers" ID
    if (section.id === 'D' || qId === "Barriers") {
       const opts = OPTIONS["Barriers"] || ["Option 1", "Option 2"];
       const currentSelection = (answers[answerKey] && typeof answers[answerKey] === 'object') ? answers[answerKey] : [];
       const isOtherSelected = currentSelection.some(item => item.startsWith("Other") || item.startsWith("أخرى"));

       return (
        <div key={qId} className="mb-6">
          <label className="block font-medium text-lg mb-3">{qText}</label>
          <div className="space-y-3">
            {opts.map((opt) => {
              const baseOpt = opt; // The clean option text
              // Check if this option is selected (exact match or, for 'Other', prefix match)
              const isSelected = currentSelection.some(val => val === baseOpt || (baseOpt === "Other" && val.startsWith("Other:")) || (baseOpt === "أخرى" && val.startsWith("أخرى:")));

              return (
                <div key={opt} className="">
                  <label className="flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 cursor-pointer bg-white">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                         let newSelection = [...currentSelection];
                         if (e.target.checked) {
                            if (opt === "Other" || opt === "أخرى") {
                                // Add placeholder for other
                                newSelection.push(`${opt}: `);
                            } else {
                                newSelection.push(opt);
                            }
                         } else {
                            // Remove opt (and any detailed 'Other' text)
                            newSelection = newSelection.filter(val => val !== opt && !val.startsWith(`${opt}:`));
                         }
                         handleAnswer(section.id, qId, newSelection);
                      }}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <span className="text-lg">{opt}</span>
                  </label>
                  
                  {/* Render Text Input ONLY if "Other" is this option and it is selected */}
                  {((opt === "Other" || opt === "أخرى") && isSelected) && (
                    <div className="mt-2 ml-8">
                       <input 
                         type="text"
                         className="w-full p-2 border rounded border-slate-300 focus:ring-2 focus:ring-blue-500"
                         placeholder={lang === 'en' ? "Please specify..." : "يرجى التحديد..."}
                         // Extract the custom text part
                         value={currentSelection.find(val => val.startsWith(`${opt}:`))?.split(":")[1]?.trim() || ""}
                         onChange={(e) => {
                            const val = e.target.value;
                            const newEntry = `${opt}: ${val}`;
                            // Replace the old Other entry with new text
                            const newSelection = currentSelection.map(item => item.startsWith(`${opt}:`) ? newEntry : item);
                            handleAnswer(section.id, qId, newSelection);
                         }}
                       />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
       );
    }

    // --- SECTION C: Likert Scale ---
    // Strictly for Section C
    if (section.id === 'C') {
      return (
        <div key={qId} className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
          <p className="font-medium text-lg mb-4 leading-relaxed">{qId}. {qText} {q.instruction[lang] && <span className="text-sm text-slate-500 block mt-1">({q.instruction[lang]})</span>}</p>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {LIKERT_SCALE.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(section.id, qId, opt.value)}
                className={clsx(
                  "flex flex-col items-center justify-center py-3 rounded-md border transition-all",
                  answers[answerKey] === opt.value
                    ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-200 scale-105 z-10"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                )}
              >
                <div className="font-bold text-xl mb-1">{opt.value}</div>
                <div className="text-[10px] sm:text-xs text-center leading-tight px-1 hidden sm:block opacity-80">
                  {lang === 'ar' ? opt.label : opt.label}
                </div> 
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-2 px-2 text-xs text-slate-400 sm:hidden">
             <span>{lang === 'ar' ? "لا أوافق بشدة" : "Strongly Disagree"}</span>
             <span>{lang === 'ar' ? "أوافق بشدة" : "Strongly Agree"}</span>
          </div>
        </div>
      );
    }

    // --- Default / Section A & B: Multiple Choice & Checkbox ---
    // If we have options defined, render choice
    if (OPTIONS[qId] || ["Checkbox"].includes(q.subtype)) {
        const isCheckbox = qId === "4"; 
        const opts = OPTIONS[qId] || []; // Should be defined in constants

       return (
        <div key={qId} className="mb-6">
          <label className="block font-medium text-lg mb-3">{qId}. {qText}</label>
          <div className="space-y-2">
            {opts.map((opt) => (
              <label key={opt} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 cursor-pointer bg-white">
                <input
                  type={isCheckbox ? "checkbox" : "radio"}
                  name={answerKey}
                  value={opt}
                  checked={isCheckbox 
                    ? (answers[answerKey] || []).includes(opt) 
                    : answers[answerKey] === opt}
                  onChange={(e) => {
                     if (isCheckbox) {
                        const current = answers[answerKey] || [];
                        if (e.target.checked) handleAnswer(section.id, qId, [...current, opt]);
                        else handleAnswer(section.id, qId, current.filter(x => x !== opt));
                     } else {
                        handleAnswer(section.id, qId, opt);
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

    // Fallback
    return <div key={qId} className="text-red-500">Unknown Question Type</div>;
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
