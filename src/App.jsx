import React, { useState, useEffect } from 'react';

function App() {
  const [page, setPage] = useState('home'); 
  const [questions, setQuestions] = useState([]);
  
  // Состояния конструктора
  const [qText, setQText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correct, setCorrect] = useState(0);

  // Состояния теста
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/questions');
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) { console.error(error); }
  };

  const startQuiz = () => {
    if (questions.length === 0) return alert("Сначала добавьте вопросы!");
    setScore(0);
    setCurrentQ(0);
    setUserAnswers([]);
    setPage('quiz');
  };

  const handleAnswer = (selectedIndex) => {
    const answerData = {
      questionIndex: currentQ,
      selected: selectedIndex,
      isCorrect: selectedIndex === questions[currentQ].correct
    };
    setUserAnswers([...userAnswers, answerData]);
    if (answerData.isCorrect) setScore(prev => prev + 1);

    const nextQ = currentQ + 1;
    if (nextQ < questions.length) setCurrentQ(nextQ);
    else setPage('result');
  };

  // --- ТОТ САМЫЙ КРАСИВЫЙ ДИЗАЙН (СТИЛИ) ---
  const styles = {
    fullscreen: { display: 'flex', width: '100vw', height: '100vh', fontFamily: 'Arial, sans-serif' },
    half: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#fff', textAlign: 'center' },
    megaButton: { padding: '15px 40px', fontSize: '1.2rem', cursor: 'pointer', borderRadius: '30px', border: 'none', fontWeight: 'bold', marginTop: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', transition: '0.2s' },
    
    // Стили карточки теста
    quizBg: { display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#f0f2f5', justifyContent: 'center', alignItems: 'center', fontFamily: 'Arial, sans-serif' },
    card: { background: '#fff', padding: '40px', borderRadius: '25px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', textAlign: 'center', width: '90%', maxWidth: '500px' },
    optionBtn: { width: '100%', padding: '15px', margin: '10px 0', fontSize: '1.1rem', cursor: 'pointer', borderRadius: '12px', border: '1px solid #ddd', background: '#f8f9fa' },
    
    // Стили отчета
    reportArea: { width: '100%', maxWidth: '600px', marginTop: '30px', textAlign: 'left' },
    reviewItem: { padding: '15px', borderRadius: '15px', marginBottom: '15px', borderLeft: '6px solid', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }
  };

  // 1. ГЛАВНАЯ (ВОЗВРАЩЕНА)
  if (page === 'home') {
    return (
      <div style={styles.fullscreen}>
        <div style={{...styles.half, backgroundColor: '#1a73e8'}}>
          <div style={{fontSize: '5rem'}}>👨‍🏫</div>
          <h1 style={{fontSize: '2.5rem'}}>ПРЕПОДАВАТЕЛЬ</h1>
          <button onClick={() => setPage('create')} style={{...styles.megaButton, color: '#1a73e8', background: '#fff'}}>КОНСТРУКТОР</button>
        </div>
        <div style={{...styles.half, backgroundColor: '#34a853'}}>
          <div style={{fontSize: '5rem'}}>🎓</div>
          <h1 style={{fontSize: '2.5rem'}}>СТУДЕНТ</h1>
          <button onClick={startQuiz} style={{...styles.megaButton, color: '#34a853', background: '#fff'}}>НАЧАТЬ ЭКЗАМЕН</button>
        </div>
      </div>
    );
  }

  // 2. ТЕСТ
  if (page === 'quiz') {
    const q = questions[currentQ];
    return (
      <div style={styles.quizBg}>
        <div style={styles.card}>
          <div style={{display: 'flex', justifyContent: 'space-between', color: '#888', marginBottom: '10px'}}>
            <span>Вопрос {currentQ + 1} / {questions.length}</span>
          </div>
          <h2 style={{fontSize: '1.6rem', marginBottom: '25px'}}>{q.text}</h2>
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(i)} style={styles.optionBtn}>{opt}</button>
          ))}
        </div>
      </div>
    );
  }

  // 3. РЕЗУЛЬТАТ + РАБОТА НАД ОШИБКАМИ
  if (page === 'result') {
    return (
      <div style={{...styles.quizBg, flexDirection: 'column', height: 'auto', padding: '50px 0'}}>
        <div style={{...styles.card, backgroundColor: '#34a853', color: '#fff'}}>
          <h1 style={{fontSize: '3rem', margin: 0}}>🏁</h1>
          <h2>Ваш результат: {score} из {questions.length}</h2>
          <button onClick={() => setPage('home')} style={{...styles.megaButton, background: '#fff', color: '#34a853'}}>ВЕРНУТЬСЯ В МЕНЮ</button>
        </div>

        <div style={styles.reportArea}>
          <h3 style={{textAlign: 'center', color: '#555'}}>Разбор ответов:</h3>
          {questions.map((q, idx) => {
            const ans = userAnswers.find(a => a.questionIndex === idx);
            const isCorrect = ans?.isCorrect;
            return (
              <div key={idx} style={{...styles.reviewItem, borderColor: isCorrect ? '#34a853' : '#ff4d4d'}}>
                <p style={{margin: '0 0 10px 0'}}><strong>{idx+1}. {q.text}</strong></p>
                <p style={{margin: 0, fontSize: '0.95rem'}}>
                  Ваш ответ: <span style={{color: isCorrect ? '#34a853' : '#ff4d4d'}}>{q.options[ans?.selected]}</span>
                </p>
                {!isCorrect && <p style={{margin: '5px 0 0 0', fontSize: '0.95rem', color: '#34a853'}}>Правильно: {q.options[q.correct]}</p>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 4. КОНСТРУКТОР
  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f4f7f6', padding: '40px'}}>
        <button onClick={() => setPage('home')} style={{padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', marginBottom: '20px'}}>← Назад</button>
        <div style={{maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'}}>
            <h2>Создать вопрос</h2>
            <textarea style={{width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box'}} value={qText} onChange={(e) => setQText(e.target.value)} placeholder="Текст вопроса..." />
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px'}}>
                {options.map((opt, i) => (
                    <div key={i} style={{display: 'flex', gap: '5px', alignItems: 'center', background: '#f9f9f9', padding: '10px', borderRadius: '10px'}}>
                        <input type="radio" checked={correct === i} onChange={() => setCorrect(i)} />
                        <input style={{border: 'none', background: 'none', width: '100%'}} value={opt} onChange={(e) => {
                            const n = [...options]; n[i] = e.target.value; setOptions(n);
                        }} placeholder={`Вариант ${i+1}`} />
                    </div>
                ))}
            </div>
            <button onClick={async () => {
                const res = await fetch('http://localhost:5000/questions', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({text: qText, options, correct})
                });
                if(res.ok) { fetchQuestions(); setQText(''); alert("Сохранено!"); }
            }} style={{width: '100%', padding: '15px', marginTop: '20px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer'}}>ДОБАВИТЬ В БАЗУ</button>
        </div>
    </div>
  );
}

export default App;