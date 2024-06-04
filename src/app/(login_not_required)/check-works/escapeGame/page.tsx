"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { YouTubeEmbed } from "@next/third-parties/google";
import Image0 from "@/assets/img/escape-game0.png";
import Image1 from "@/assets/img/escape-game1.png";
import Image2 from "@/assets/img/escape-game2.png";
import Image3 from "@/assets/img/escape-game3.png";
import Image4 from "@/assets/img/escape-game4.png";
import Image5 from "@/assets/img/escape-game5.png";
import Image6 from "@/assets/img/escape-game6.png";
import Image7 from "@/assets/img/escape-game7.png";
import Image8 from "@/assets/img/escape-game8.png";
import Link from "next/link";
import { useState } from "react";
import { Checkbox } from "primereact/checkbox";
import Accordion from "@/components/accordion";

const Page = () => {
  const router = useRouter();
  const [isSelected, setIsSelected] = useState<boolean[]>(
    [...Array(10)].map(() => false)
  );

  const setSelection = (index: number) => {
    setIsSelected((prev) => {
      const newState = [...prev]; // Make a copy of the previous state
      newState[index] = !newState[index]; // Toggle the specific checkbox
      return newState; // Return the new state
    });
  };

  return (
    <div className="p-check-work">
      <span className="p-check-work__title u-mb36">
        チェックワーク：脱出ゲームを作ろう
      </span>
      <span className="p-check-work__sub-title -bold">
        今回作るゲームの概要
      </span>
      <Image className="p-check-work__image" alt="" src={Image0} />
      <div className="p-check-work__video"></div>
      <span className="p-check-work__medium">・unityで作る脱出ゲーム</span>
      <span className="p-check-work__medium">・障害物を押して退ける</span>
      <span className="p-check-work__medium u-mb36">
        ・クリアすると次のステージに行く
      </span>

      <span className="p-check-work__sub-title -bold ">目標</span>
      <span className="p-check-work__medium">・unityの仕様を知る</span>
      <span className="p-check-work__medium u-mb36">
        ・スクリプトを自力で描けるようになる
      </span>

      <span className="p-check-work__sub-title -bold ">ルール</span>
      <span className="p-check-work__medium">・過去の教科書やweb検索 OK</span>
      <span className="p-check-work__medium">・webのコードのコピペ NG</span>
      <span className="p-check-work__medium">
        ・chatGPTなどの生成AIへの質問 NG
      </span>
      <span className="p-check-work__medium u-mb36">
        ・メンターへの質問 歓迎
      </span>

      <Accordion
        title="STEP1 プロジェクトの作成"
        setSelection={() => setSelection(0)}
        isSelected={isSelected[0]}
      >
        <span className="p-check-work__medium">
          1. 新しいunityプロジェクトを作成しよう(EscapeGame)
        </span>
        <span className="p-check-work__medium">
          2. 以下の画像のようなステージを作成しよう
        </span>
        <Image className="p-check-work__image" alt="" src={Image1} />
        <span className="p-check-work__text u-bl">
          Hint. 10×10で、ゴール部分に長さ1の穴を開けておこう！
        </span>
        <span className="p-check-work__text u-re">
          Note.
          Inspectorウィンドウで、各座標がちょうどいい値(10とか2.25とか)に調整されているか確認しよう
        </span>
        <span className="p-check-work__medium">3. 床と壁に色をつけよう</span>
      </Accordion>

      <Accordion
        title="STEP2 プレイヤーの作成"
        setSelection={() => setSelection(0)}
        isSelected={isSelected[0]}
      >
        <span className="p-check-work__medium">
          1. Playerという名前の球体(Sphere)を作成しよう
        </span>
        <span className="p-check-work__medium">
          2. Player.csというスクリプトを作成してアタッチしよう
        </span>
        <span className="p-check-work__medium">
          3. 上下左右の矢印キーでその方向に動くようにしよう
        </span>
        <span className="p-check-work__medium">
          4. 動くスピードをInspectorウィンドウから変えられるようにしよう
        </span>
        <span className="p-check-work__medium">5. 回転しないようにしよう</span>
        <span className="p-check-work__text u-bl">
          Hint. Constranitsという項目がどこかにあるよ
        </span>
        <span className="p-check-work__text u-gy">
          参考 教科書1-5 コロコロゲーム
        </span>
      </Accordion>
      <Accordion
        title="STEP3 ステージの作成"
        setSelection={() => setSelection(3)}
        isSelected={isSelected[3]}
      >
        <span className="p-check-work__medium">
          1. 障害物となるCubeをひとつ配置して名前を"Barrier"にしよう
        </span>
        <span className="p-check-work__medium">2. 障害物に色をつけよう</span>
        <span className="p-check-work__medium">
          3. 障害物にPlayerが当たると押せるようにしよう
        </span>
        <span className="p-check-work__text u-bl">
          Hint. 物理特使を利用するには...?
        </span>
        <span className="p-check-work__medium">
          4. 障害物が回転しないようにしよう
        </span>
        <span className="p-check-work__medium">
          5. 障害物をプレハブにして保存しよう
        </span>
        <span className="p-check-work__medium">
          6. 色々な大きさの障害物をたくさん配置してステージを作ろう
        </span>
        <span className="p-check-work__text u-re">
          Note. しっかり脱出できる配置になっているか確かめよう
        </span>
      </Accordion>
      <Accordion
        title="STEP4 ゴールの作成"
        setSelection={() => setSelection(3)}
        isSelected={isSelected[3]}
      >
        <span className="p-check-work__medium">
          1. Cubeを作成して名前を"Goal"にしよう
        </span>
        <span className="p-check-work__medium">
          2. ゴールの場所が出口とぴったりになるようにしょう
        </span>
        <span className="p-check-work__medium">
          3. ゴールの見た目が見えないようにしよう
        </span>
        <span className="p-check-work__text u-bl">
          Hint. オブジェクトの表示に関わっている要素を思いだそう
        </span>
        <span className="p-check-work__medium">
          4. ゴールのタグをGoalにしよう
        </span>
        <span className="p-check-work__text u-bl">
          Hint. 新しいタグを追加しよう
        </span>
        {/* <span className="p-check-work__medium">
          4. ゴールのBox Colliderのis Triggerにチェックを入れよう
        </span> */}
        <span className="p-check-work__medium">
          5.
          Player.csを編集してゴールに触れたら"Goal!!"とconsoleに表示されるようにしよう
        </span>
        <Image className="p-check-work__image" alt="" src={Image2} />
        {/* <span className="p-check-work__text u-bl">
          Hint. is Triggerについて(
          <Link
            className="p-check-work__link"
            href="http://kimama-up.net/unity-is-trigger/"
          >
            参考リンク
          </Link>
          )
        </span> */}
      </Accordion>
      <Accordion
        title="STEP5 複数ステージの作成"
        setSelection={() => setSelection(3)}
        isSelected={isSelected[3]}
      >
        <span className="p-check-work__medium">
          1. ステージをひとつの親オブジェクト"Stage"にまとめよう
        </span>
        <span className="p-check-work__text u-bl">Hint. Emptyを使おう</span>
        <span className="p-check-work__medium">
          2. 同じようなステージをいくつか作ろう(同じ座標で)
        </span>
        <span className="p-check-work__medium">
          3.
          Player.csに現在の進捗状況を表すprogressというint型の変数を定義しよう
        </span>
        <span className="p-check-work__medium">
          4. Player.csにpublicでステージのリストStagesを宣言しよう(GameObject型)
        </span>
        <span className="p-check-work__text u-bl">
          {"Hint. リストはList<型>で宣言するよ"}
        </span>
        <span className="p-check-work__medium">
          5.
          ゴールした時に、初期位置にプレイヤーを移動させ、次のステージを表示するようにしよう
        </span>
        <span className="p-check-work__text u-bl">
          Hint. GameObject.SetActive(true)などでアクティブを切り替えられるよ (
          <Link
            className="p-check-work__link"
            href="https://docs.unity3d.com/ja/560/ScriptReference/GameObject.SetActive.html"
          >
            参考リンク
          </Link>
          )
        </span>
        <span className="p-check-work__text u-re">
          Note. progressに1を足すことを忘れないように！
        </span>
        <span className="p-check-work__medium">
          6.
          次のステージがないときは(最後のステージをクリアした時は)、consoleに"clear!!"と表示するようにしよう
        </span>
        <span className="p-check-work__medium">
          7. InspectorでStagesに作ったステージを全てアタッチしよう
        </span>
        <span className="p-check-work__medium">
          8. Stage1以外を非アクティブにしよう
        </span>
        <span className="p-check-work__text u-bl">
          Hint.
          Inspectorウィンドウのチェックボックスでアクティブを手動で切り替えられるよ
        </span>
      </Accordion>
      <Accordion
        title="STEP6 完成!!"
        setSelection={() => setSelection(3)}
        isSelected={isSelected[3]}
      >
        <span className="p-check-work__medium">
          1. 実際に遊んでみよう！正常に遊べたら完成だよ！
        </span>
        <span className="p-check-work__medium">
          2. もし時間があったらアレンジを加えてみよう
        </span>
      </Accordion>
    </div>
  );
};

export default Page;
