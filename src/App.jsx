import React, { useState } from 'react';
import Wizard from './components/Wizard';
import DATA from './data.json';
import { Globe, BookOpen } from 'lucide-react';
import { supabase } from './supabaseClient';

function App() {
  const [lang, setLang] = useState('en');
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleSubmit = async (answers) => {
    try {
      const { error } = await supabase
        .from('responses')
        .insert([
          { 
            answers: answers,
            metadata: { 
              lang: lang,
              browser_time: new Date().toISOString(),
              user_agent: navigator.userAgent
            }
          }
        ]);

      if (error) throw error;
      
      setIsSubmitted(true);
      setIsError(false);
    } catch (error) {
      console.error("Submission failed", error);
      setIsError(true);
      // Optional: keep them on the page to retry
      alert(lang === 'en' ? "Failed to submit. Please try again." : "فشل الإرسال. يرجى المحاولة مرة أخرى.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">{lang === 'en' ? 'Thank You!' : 'شكراً لك!'}</h2>
          <p className="text-slate-600 mb-6">
            {lang === 'en' 
              ? 'Your response has been recorded. Your contribution to One Health research is appreciated.' 
              : 'تم تسجيل إجابتك. نقدر مساهمتك في أبحاث صحة واحدة.'}
          </p>
          <button onClick={() => window.location.reload()} className="text-blue-600 hover:underline">
            {lang === 'en' ? 'Start New Response' : 'بدء استجابة جديدة'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-700">
            <BookOpen size={24} />
            <span className="hidden sm:inline">One Health Research</span>
          </div>
          <button 
            onClick={toggleLang}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-sm font-medium"
          >
            <Globe size={16} />
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        {!isStarted ? (
          <div className="max-w-2xl mx-auto px-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
              <h1 className="text-3xl font-bold mb-6 text-slate-800">
                {lang === 'en' ? 'One Health Awareness Questionnaire' : 'استبيان الوعي بصحة واحدة'}
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {lang === 'en' 
                  ? 'This study explores awareness of the One Health concept, organizational readiness, and gender-related challenges in healthcare.' 
                  : 'تستكشف هذه الدراسة الوعي بمفهوم صحة واحدة، والجاهزية المؤسسية، والتحديات المرتبطة بالنوع الاجتماعي في الرعاية الصحية.'}
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg text-left mb-8 mx-auto max-w-lg">
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex gap-3">
                    <span className="font-bold min-w-[80px]">{lang === 'en' ? 'Time:' : 'الوقت:'}</span>
                    <span>20-25 {lang === 'en' ? 'minutes' : 'دقيقة'}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold min-w-[80px]">{lang === 'en' ? 'Privacy:' : 'الخصوصية:'}</span>
                    <span>{lang === 'en' ? 'Anonymous & Confidential' : 'مجهولة وسرية'}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold min-w-[80px]">{lang === 'en' ? 'Consent:' : 'الموافقة:'}</span>
                    <span>{lang === 'en' ? 'By starting, you consent to participate (18+)' : 'بالبدء، توافق على المشاركة (+18)'}</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={handleStart}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-transform hover:scale-105 shadow-md w-full sm:w-auto"
              >
                {lang === 'en' ? 'Start Questionnaire' : 'بدء الاستبيان'}
              </button>
            </div>
          </div>
        ) : (
          <Wizard data={DATA} lang={lang} onSubmit={handleSubmit} />
        )}
      </main>
    </div>
  );
}

export default App;
