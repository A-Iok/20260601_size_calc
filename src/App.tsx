import { useState } from 'react'
import './App.css'

/** 定数 */
const yMin = 300;
const yMax = 1500;
const xMin = yMin;
const xMax = yMax;
const zMin = 100;
const zMax = 300;
const noriXY = 10;
const noriZ = 5;

type questionType = {
  questionString: String,
  correctAnswerY: String,
  correctAnswerX: String,
  correctAnswerZ: String,
  correctAnswerKiri: String,
  correctAnswerString: String,
}

/** 問題作成 */
const createQuestion = () => {
  let originalY: number = getRandomInt(yMin, yMax);
  let originalX = getRandomInt(xMin, xMax);
  let originalZ = getRandomInt(zMin, zMax);
  let questionString = originalY + "mm ×" + originalX + "mm ×" + originalZ + "mm";

  let correctAnswerY = originalY + noriXY;
  let correctAnswerX = originalX + noriXY;
  let correctAnswerZ = originalZ + noriZ;
  let correctAnswerKiri = originalX + noriXY + originalZ + noriZ + originalZ + noriZ;

  let correctAnswerString = correctAnswerY + "mm ×" + correctAnswerX + "mm ×" + correctAnswerZ + "mm";

  const question: questionType = {
    questionString: questionString,
    correctAnswerY: String(correctAnswerY),
    correctAnswerX: String(correctAnswerX),
    correctAnswerZ: String(correctAnswerZ),
    correctAnswerKiri: String(correctAnswerKiri),
    correctAnswerString: correctAnswerString
  }

  console.log(correctAnswerString + "," + correctAnswerKiri);
  return question;
}

const question: questionType = createQuestion();

const App = () => {

  /** 初期表示 */
  const Editors = () => {

    //初期表示時の処理
    const [answerY, setAnswerY] = useState("");
    const [answerX, setAnswerX] = useState("");
    const [answerZ, setAnswerZ] = useState("");
    const [answerKiri, setAnswerKiri] = useState("");

    const [result, setResult] = useState("");
    const [showAnswer, setShowAnswer] = useState(false);

    /**
     * 答え合わせ
     */
    const checkAnswer = () => {

      if (answerY == question.correctAnswerY
        && answerX == question.correctAnswerX
        && answerZ == question.correctAnswerZ
        && answerKiri == question.correctAnswerKiri
      ) {
        console.log("正解");
        setResult('正解');
      } else {
        console.log("不正解");
        setResult('不正解');
      }
      setShowAnswer(true);
      console.log("checkAnswer:showAnswer=" + showAnswer + ",result=" + result)
    };

    // 画面表示
    return (
      <>
        <div><h3>切り出しサイズ計算道場</h3></div>
        <div className="container"><p>問題（縦×横×高さ）：</p><h4>{question.questionString}</h4></div>
        {/* <form onSubmit={handleSubmit}> */}
        <div>
          回答：
          <input type='string' className="answerY" onChange={(e) => setAnswerY(e.target.value)} />×
          <input type='string' className="answerX" onChange={(e) => setAnswerX(e.target.value)} />×
          <input type='string' className="answerZ" onChange={(e) => setAnswerZ(e.target.value)} />
        </div>
        <div>切寸：<input type='string' className="answerKiri" onChange={(e) => setAnswerKiri(e.target.value)} /></div>
        <div className="container">
          <button onClick={checkAnswer}>採点</button>
          <h3>{result}</h3>
        </div>
        {/* </form> */}
        <div>
          {showAnswer && <p>正解：{question.correctAnswerString} </p>}
        </div>
        <div>
          {showAnswer && <p>切寸：{question.correctAnswerKiri} </p>}
        </div>
      </>
    )
  }

  return (
    <>
      <div>
        <div className="editor">
          <Editors />
        </div>
      </div>
    </>
  )
}



// 指定された範囲内の整数値の乱数を生成する関数
function getRandomInt(min: number, max: number): number {
  // Math.random()は0以上1未満の値を返すため、適切な範囲に変換する
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export default App
