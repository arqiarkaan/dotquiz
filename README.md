# Dokumentasi Implementasi dotquiz

Berikut penjelasan implementasi setiap requirement pada project ini:

---

## 1. Memiliki Fitur Login

**Cara Kerja:**

- User harus memasukkan username sebelum memulai kuis.
- Username divalidasi minimal 2 karakter.
- Username disimpan di localStorage agar bisa digunakan untuk resume.

**File Terkait:**

- `src/components/LoginPage.tsx` (UI & logic login)
- `src/utils/storage.ts` (penyimpanan username)
- `src/pages/Index.tsx` (state & flow login)

**Penjelasan Kode:**

- Komponen `LoginPage` menerima props `onLogin` dan `savedUsername`.
- Fungsi `handleSubmit` pada `LoginPage` akan memvalidasi dan menyimpan username:
  ```tsx
  storage.saveUsername(username.trim());
  onLogin(username.trim());
  ```
- Username diambil/ditulis ke localStorage lewat helper di `storage.ts`:
  ```ts
  saveUsername: (username: string) =>
    localStorage.setItem('dotquiz_username', username);
  getUsername: () => localStorage.getItem('dotquiz_username');
  ```
- State utama diatur di `Index.tsx`:
  ```tsx
  const [appState, setAppState] = useState<AppState>('login');
  const [username, setUsername] = useState('');
  ...
  if (appState === 'login') return <LoginPage onLogin={handleLogin} ... />
  ```

---

## 2. API Soal dari https://opentdb.com/

**Cara Kerja:**

- Soal diambil secara real-time dari OpenTDB API saat user mulai kuis.

**File Terkait:**

- `src/services/triviaApi.ts` (fetch soal)
- `src/components/QuizPage.tsx` (pemanggilan API)

**Penjelasan Kode:**

- Fungsi utama:
  ```ts
  triviaApi.fetchQuestions({ amount: 10 });
  ```
- Di dalamnya, API dipanggil dengan parameter jumlah soal, difficulty, dsb:
  ```ts
  const url = new URL(API_BASE_URL);
  url.searchParams.append('amount', amount.toString());
  ...
  const response = await fetch(url.toString());
  ...
  return data.results.map(...)
  ```
- Soal yang didapat diacak jawabannya sebelum ditampilkan.

---

## 3. Jumlah & Tipe Soal Bebas

**Cara Kerja:**

- Jumlah soal default: 10 (bisa diubah di kode).
- Tipe soal mengikuti response dari OpenTDB (multiple/boolean).

**File Terkait:**

- `src/services/triviaApi.ts` (parameter amount/type)
- `src/components/QuizPage.tsx` (pemanggilan fetchQuestions)

**Penjelasan Kode:**

- Jumlah soal diatur di parameter:
  ```ts
  triviaApi.fetchQuestions({ amount: 10 });
  ```
- Tipe soal (`type`) dan difficulty bisa diatur juga jika ingin.

---

## 4. Total Soal & Jumlah Dikerjakan Ditampilkan

**Cara Kerja:**

- Di setiap soal, user bisa melihat progress: "Question X of Y".
- Setelah selesai, hasil summary juga menampilkan total, benar, salah, dan jumlah dijawab.

**File Terkait:**

- `src/components/ProgressBar.tsx` (progress bar)
- `src/components/QuestionCard.tsx` (info soal saat ini)
- `src/components/ResultsPage.tsx` (summary hasil)

**Penjelasan Kode:**

- Progress bar:
  ```tsx
  <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
  ```
- Di hasil:
  ```tsx
  <div>{result.totalQuestions}</div>
  <div>{result.answeredQuestions}</div>
  <div>{result.correctAnswers}</div>
  <div>{result.incorrectAnswers}</div>
  ```

---

## 5. Memiliki Timer

**Cara Kerja:**

- Setiap kuis ada timer (default 5 menit/300 detik).
- Timer otomatis submit jika waktu habis.

**File Terkait:**

- `src/hooks/useTimer.ts` (custom hook timer)
- `src/components/Timer.tsx` (UI timer)
- `src/components/QuizPage.tsx` (integrasi timer)

**Penjelasan Kode:**

- Timer diinisialisasi di QuizPage:
  ```tsx
  const timer = useTimer({ duration: QUIZ_DURATION, onTimeUp: handleTimeUp, ... })
  ```
- UI timer:
  ```tsx
  <Timer
    timeLeft={timer.timeLeft}
    formatTime={timer.formatTime}
    isRunning={timer.isRunning}
  />
  ```
- Jika waktu habis:
  ```ts
  function handleTimeUp() { ... onQuizComplete(result); }
  ```

---

## 6. Satu Halaman Hanya Satu Soal

**Cara Kerja:**

- Hanya satu soal tampil per halaman.
- Setelah user pilih jawaban, otomatis lanjut ke soal berikutnya.

**File Terkait:**

- `src/components/QuizPage.tsx` (state currentQuestionIndex)
- `src/components/QuestionCard.tsx` (UI & logic jawaban)

**Penjelasan Kode:**

- Soal yang ditampilkan:
  ```tsx
  <QuestionCard question={questions[currentQuestionIndex]} ... />
  ```
- Setelah jawab:
  ```ts
  const handleAnswer = (answer) => {
    ...
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(prev => prev + 1);
    else onQuizComplete(...);
  }
  ```
- Di QuestionCard, ada delay feedback sebelum lanjut soal berikutnya.

---

## 7. Timer Habis: Soal Ditutup & Tampilkan Hasil

**Cara Kerja:**

- Jika timer habis, quiz otomatis selesai dan hasil langsung ditampilkan.

**File Terkait:**

- `src/components/QuizPage.tsx` (handleTimeUp)
- `src/components/ResultsPage.tsx` (tampilan hasil)

**Penjelasan Kode:**

- Fungsi handleTimeUp:
  ```ts
  function handleTimeUp() {
    const result = calculateResult();
    storage.clearQuizState();
    onQuizComplete(result);
  }
  ```
- Hasil ditampilkan di ResultsPage dengan detail benar, salah, waktu, dsb.

---

## 8. Resume Kuis (LocalStorage)

**Cara Kerja:**

- Jika browser ditutup/refresh, user bisa melanjutkan kuis yang belum selesai.
- State quiz (soal, jawaban, waktu, dsb) disimpan di localStorage.

**File Terkait:**

- `src/utils/storage.ts` (save/get quiz state)
- `src/pages/Index.tsx` (resume logic)
- `src/components/QuizPage.tsx` (persist state)

**Penjelasan Kode:**

- State quiz disimpan setiap perubahan:
  ```ts
  storage.saveQuizState(state)
  ...
  getQuizState() // untuk resume
  ```
- Saat app dibuka, jika ada state tersimpan, user ditawari untuk resume:
  ```tsx
  if (savedState && !savedState.isCompleted) setAppState('resume');
  ...
  <Button onClick={handleResumeQuiz}>Resume Quiz</Button>
  ```

---

## Struktur Folder Terkait

- `src/components/` : Komponen utama (LoginPage, QuizPage, ResultsPage, QuestionCard, Timer, ProgressBar)
- `src/services/` : API service (triviaApi)
- `src/utils/` : Helper untuk localStorage
- `src/hooks/` : Custom hooks (timer, toast)
- `src/types/` : Tipe data (Question, QuizState, QuizResult)
- `src/pages/` : Entry point aplikasi (Index.tsx)
