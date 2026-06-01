import { ReactElement, useState } from 'react'
import { Cell, Pie, PieChart } from 'recharts';
import './App.css'

/** 定数 */
const CHART_HEIGHT = 400;
const CHART_WIDTH = CHART_HEIGHT * 1.2;
const CHART_RADIUS = CHART_HEIGHT * 0.4;
const TIME_MAX = 24;
const TEXT_MAX = 5;
const EMPTY = '';

const App = () => {

  /** 変数 */
  const [indexMax, setIndexMax] = useState(4);
  const [restTime, setRestTime] = useState(0);

  /** 円グラフに登録するデータ 初期値 */
  const data = [
    {
      index: 0,
      name: '睡眠',
      value: 8,
      color: '#0088FE',
      errorMessage: EMPTY
    }, {
      index: 1,
      name: '風呂',
      value: 1,
      color: '#00C49F',
      errorMessage: EMPTY
    }, {
      index: 2,
      name: '食事',
      value: 3,
      color: '#FFBB28',
      errorMessage: EMPTY
    }, {
      index: 3,
      name: '仕事',
      value: 8,
      color: '#FF8042',
      errorMessage: EMPTY
    }, {
      index: 4,
      name: '余暇',
      value: 3,
      color: '#afeeee',
      errorMessage: EMPTY
    }
  ];
  const [setting, setSetting] = useState(data);

  /**
   * 名前の入力値をグラフに反映
   * @param e 名前の入力値
   */
  const changeSettingName = (e: React.ChangeEvent<HTMLInputElement>) => {

    let i: number = Number(e.currentTarget.getAttribute('data-num'));
    setSetting(
      setting.map((c, index) => {
        if (index === i) {
          c.name = e.target.value;

          setErrorMessage(checkTextMax(c.name), i);
          return c
        } else {
          return c
        }
      }));
  }

  /**
   * 時間の入力値をグラフに反映
   * @param e 時間の入力値
   */
  const changeSettingValue = (e: React.ChangeEvent<HTMLInputElement>) => {

    let i: number = Number(e.currentTarget.getAttribute('data-num'));

    //入力値を反映
    setSetting(
      setting.map((c, index) => {
        if (index === i) {

          c.value = checkNumber(e.target.value);
          return c;
        } else {
          return c
        }
      }));

    let errorMessage = validateValueSum();
    setErrorMessage(errorMessage, i);
  }

  /**
   * 色の入力値をグラフに反映
   * @param e 色の入力値
   */
  const changeSettingColor = (e: React.ChangeEvent<HTMLInputElement>) => {

    setSetting(
      setting.map((c, index) => {
        if (String(index) === e.currentTarget.getAttribute('data-num')) {
          c.color = e.target.value;
          return c
        } else {
          return c
        }
      }));
  }

  /**
   * チェック結果をエラーメッセージに反映
   * @param errorMessage 追加するエラーメッセージ
   * @param i 追加対象のデータのインデックス
   */
  const setErrorMessage = (errorMessage: string, i: number) => {
    setSetting(
      setting.map((c, index) => {
        if (index === i) {

          c.errorMessage = errorMessage;
          return c;
        } else {
          return c
        }
      }));
  }

  /**
   * データを追加
   */
  const addData = () => {
    let index = indexMax + 1;
    setSetting([
      ...setting,
      {
        index: index,
        name: '追加データ',
        value: 1,
        color: '#' + generateRandomColor(),
        errorMessage: EMPTY
      }
    ])
    setIndexMax(index);
  }

  /**
   * 色を生成
   * @returns 生成した色
   */
  const generateRandomColor = () => {
    return Math.random().toString(16).substr(-6);
  }

  /**
  * 時間のチェック-全体
    * @returns エラーメッセージ
    */
  function validateValueSum() {

    if (getValueSum() > TIME_MAX) {
      return '全データの時間合計が24時間以内になるように修正してください'
    }
    // 正常
    return EMPTY;
  }

  /**
   * 時間の合計値を取得
   * @returns 時間の合計値
   */
  function getValueSum() {
    return setting.reduce(function (sum, element) {
      return sum + element.value;
    }, 0);
  }

  /** data の 要素の編集テキストボックス */
  const Editors = () => {

    //初期表示時の処理
    setRestTime(TIME_MAX - getValueSum());
    // 各要素のエディタを追加
    const Inputs = () => {

      const listB: Array<ReactElement> = [];
      for (let i = 0; i < setting.length; i++) {
        let data1 = setting[i];
        listB.push(<>
          <li key={i}>
            <div>
              <input type='text' className="nameInput" onChange={changeSettingName} value={data1.name} data-num={i} />を
              <input type='number' className="timeInput" onChange={changeSettingValue} value={data1.value} data-num={i} />時間
              色：<input type='text' className="colorInput" onChange={changeSettingColor} value={data1.color} data-num={i} />
              <button className='deleteButton' onClick={() => {
                setSetting(setting.filter(a => a.index !== data1.index));
              }} value={i}>削除</button>
            </div>
            <p>{data1.errorMessage}</p>
          </li>
        </>
        )
      }
      //TODO 削除アクションを別に切り出したい
      return (
        <>
          <div>
            {listB}
          </div>
          <div>
            追加可能時間：{restTime}
            <button className='addButton' onClick={addData}>追加</button>
          </div>
        </>
      )
    }
    return (<>
      <ul>
        <Inputs />
      </ul>
    </>)
  }

  /** 円グラフのラベル定義 */
  const getLabel = ({ name }: any) => {
    return name;
  }

  return (
    <>
      <div>
        <div className="editor">
          <Editors />
        </div>
        <div className="chart">
          <PieChart width={CHART_WIDTH} height={CHART_HEIGHT} className='margin10px'>
            <Pie data={setting.filter(a => a.errorMessage === EMPTY)} dataKey="value" cx="50%" cy="50%" outerRadius={CHART_RADIUS} fill="#82ca9d" label={getLabel} > {
              setting.map((entry, index) =>
                (<Cell key={`cell-${index}`} fill={entry.color} />)
              )
            } </Pie>
          </PieChart>
        </div>
      </div>
    </>
  )
}

/**
 * 引数が数値であることをチェック
 * @param val チェック対象の値
 * @returns 変換後の数値
 */
function checkNumber(val: any): number {
  let number = Number(val);
  if (0 < number) {
    return number;
  }
  return 0;
}

/**
 * 文字数上限チェック
 * @param val チェック対象の値
 * @returns エラーメッセージ
 */
function checkTextMax(val: any): string {
  if (TEXT_MAX < val.length) {
    return '文字数は' + TEXT_MAX + '文字以内で入力してください';
  }
  return EMPTY;
}


export default App
