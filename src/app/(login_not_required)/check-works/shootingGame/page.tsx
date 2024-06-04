"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { YouTubeEmbed } from "@next/third-parties/google";
import Image0 from "@/assets/img/shooting-game0.png";
import Image1 from "@/assets/img/shooting-game1.png";
import Image2 from "@/assets/img/shooting-game2.png";
import Image3 from "@/assets/img/shooting-game3.png";
import Image4 from "@/assets/img/shooting-game4.png";
import Image5 from "@/assets/img/shooting-game5.png";
import Image6 from "@/assets/img/shooting-game6.png";
import Image7 from "@/assets/img/shooting-game7.png";
import Image8 from "@/assets/img/shooting-game8.png";
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
        チェックワーク：シューティングゲームを作ろう
      </span>
      <span className="p-check-work__sub-title -bold">
        今回作るゲームの概要
      </span>
      <div className="p-check-work__video">
        <YouTubeEmbed videoid="F61V29A-9mY" params="controls=0" />
      </div>
      <span className="p-check-work__medium">
        ・Ray Casterを使用したシューティングゲーム
      </span>
      <span className="p-check-work__medium">・敵に当たるとポイント獲得</span>
      <span className="p-check-work__medium">・アイテムを拾うことができる</span>
      <span className="p-check-work__medium u-mb36">
        ・タイムオーバーで画面遷移
      </span>

      <span className="p-check-work__sub-title -bold ">目標</span>
      <span className="p-check-work__medium">・Ray Casterを使いこなす</span>
      <span className="p-check-work__medium u-mb36">
        ・自分でゲームを作れるようになる
      </span>

      <span className="p-check-work__sub-title -bold ">ルール</span>
      <span className="p-check-work__medium">・過去の教科書やweb検索 OK</span>
      <span className="p-check-work__medium">・webのコードのコピペ NG</span>
      <span className="p-check-work__medium">
        ・chatGPTなどの生成AIへの質問 OK(全てコピペはNG)
      </span>
      <span className="p-check-work__medium u-mb36">
        ・メンターへの質問 歓迎
      </span>

      <Accordion
        title="STEP1 プロジェクトの起動"
        setSelection={() => setSelection(0)}
        isSelected={isSelected[0]}
      >
        <span className="p-check-work__medium">
          ファイルのダウンロード&unityの起動
        </span>
        <span className="p-check-work__medium">
          1. {""}
          <Link
            className="p-check-work__link"
            href="https://drive.google.com/file/d/1h_on7Jm1YaHLZJPl3rFMvHdQKmA_tSTP/view?usp=sharing"
            target="_brank"
          >
            この
          </Link>
          リンクからプロジェクトをダウンロードしよう
        </span>
        <span className="p-check-work__medium">
          2. zipを解凍して、unity hubでadd → プロジェクトのフォルダを選択しよう
        </span>
        <span className="p-check-work__medium">
          3. プロジェクトを起動してMainのシーンを開こう
        </span>
        <span className="p-check-work__medium">
          4. 以下の画像のようになっていれば大丈夫だよ！
        </span>
        <span className="p-check-work__medium">
          5. プレイした時に前進していることを確かめよう
        </span>
        <Image className="p-check-work__image" alt="" src={Image0} />
      </Accordion>
      <Accordion
        title="STEP2 MainシーンのUIを作る"
        setSelection={() => setSelection(1)}
        isSelected={isSelected[1]}
      >
        <Image className="p-check-work__image" alt="" src={Image1} />
        <span className="p-check-work__medium">1. Player.csを開こう</span>
        <span className="p-check-work__medium">
          2. UIを更新する処理を追加しよう
        </span>
        <span className="p-check-work__text u-gr">
          Tips. Text(Legacy)とTMPを使用する場合で書き方が変わるよ！
        </span>
      </Accordion>
      <Accordion
        title="STEP3 アイテムの設定"
        setSelection={() => setSelection(2)}
        isSelected={isSelected[2]}
      >
        <Image className="p-check-work__image" alt="" src={Image3} />
        <span className="p-check-work__medium -bold">
          拾えるアイテムを作ろう(今回は使うことはできないよ)
        </span>
        <span className="p-check-work__medium">1. Item.csを開こう</span>
        <span className="p-check-work__medium">
          2. Item.csにアイテムの種類(今回はMoveSlow,
          ShotAllのに種類を作ろう)を宣言しよう
        </span>
        <span className="p-check-work__text u-bl">
          Hint. 列挙型(Enum)を使用しよう
        </span>
        <span className="p-check-work__medium">
          3. タイプによってアイテムの色が変わるようにしよう
        </span>
        <span className="p-check-work__text u-bl">
          Hint. MeshRenderer.material.colorを活用しよう
        </span>
      </Accordion>
      <Accordion
        title="STEP4 敵の設定"
        setSelection={() => setSelection(3)}
        isSelected={isSelected[3]}
      >
        <Image className="p-check-work__image" alt="" src={Image5} />
        <Image className="p-check-work__image" alt="" src={Image6} />
        <span className="p-check-work__medium -bold">
          木の影から出てきたり隠れたりする敵を作ろう
        </span>
        <span className="p-check-work__medium">1. Enemy.csを開こう</span>
        <span className="p-check-work__medium">
          2. Enemy.csを読んで敵の数値や動きなどの仕様を理解しよう
        </span>
        <span className="p-check-work__medium">
          3. 敵が親オブジェクトとの相対座標-1~1を動くように設定しよう
        </span>
        <span className="p-check-work__text u-re">
          Note. 絶対座標ではないことに注意しよう
        </span>
      </Accordion>
      <Accordion
        title="STEP5 Ray Casterの設定"
        setSelection={() => setSelection(4)}
        isSelected={isSelected[4]}
      >
        <Image className="p-check-work__image" alt="" src={Image2} />
        <span className="p-check-work__medium">1. RayCaster.csを開こう</span>
        <span className="p-check-work__medium">
          2. クリックした場所にRayを発射する(Debug.DrawWrite) 処理を追加しよう
        </span>
        <span className="p-check-work__text u-gy">
          参考：教科書3-6, 3-7 FPS
        </span>

        <span className="p-check-work__text u-bl">
          Hint. マウスのポジションを画面上の座標に落とし込もう
        </span>
        <span className="p-check-work__medium">
          3. Rayの当たったオブジェクトのタグに応じた処理を書こう
        </span>
        <span className="p-check-work__medium">
          4.
          タグが"Enemy"だったときは敵を消してその敵の持つpointをプレイヤーのscoreに加算しよう
        </span>
        <span className="p-check-work__text u-bl">
          Hint. Rayは衝突判定なのでcolliderを使うよ
        </span>
        <span className="p-check-work__medium">
          5. Player.csにてitemListというリストを宣言・初期化しよう
        </span>
        <span className="p-check-work__medium">
          6.
          タグが"Item"だったときはアイテムを消してそのtypeをitemListに加算しよう
        </span>
        <span className="p-check-work__text u-bl">
          {"Hint. リストはList<型>で宣言するよ"}
        </span>
      </Accordion>
      <Accordion
        title="STEP6 敵やアイテムを自動生成しよう"
        setSelection={() => setSelection(3)}
        isSelected={isSelected[3]}
      >
        <Image className="p-check-work__image" alt="" src={Image7} />
        <span className="p-check-work__medium -bold">
          敵やアイテムはランダムで無限に生成されるようにしよう
        </span>
        <span className="p-check-work__medium">
          1. GroundsController.csを開こう
        </span>
        <span className="p-check-work__text u-re">
          Note. ステージは無限に生成されるようになっているよ
        </span>
        <span className="p-check-work__medium">
          2. まずはGroundひとつにつき敵が一体生成されるようにしよう
        </span>
        <span className="p-check-work__medium">
          座標は、xは-4~4, yは-9~9の間でランダムにしよう
        </span>
        <span className="p-check-work__medium">
          3.
          次に仕組みは以下の図を参考にして、出現する確率もランダムにしよう(定数は自由に決めていいよ)
        </span>
        <Image className="p-check-work__image" alt="" src={Image8} />
        <span className="p-check-work__text u-bl">
          Hint. 繰り返しの処理にはforeachを使用するよ(
          <Link
            className="p-check-work__link"
            href="http://kimama-up.net/unity-foreach/"
            target="_brank"
          >
            参考サイト
          </Link>
          )
        </span>
        <span className="p-check-work__medium">
          4. アイテムも同じようにしよう(定数は自由に決めていいよ)
        </span>
      </Accordion>
      <Accordion
        title="STEP7 リザルト画面"
        setSelection={() => setSelection(3)}
        isSelected={isSelected[3]}
      >
        <Image className="p-check-work__image" alt="" src={Image4} />
        <span className="p-check-work__medium">
          1. ResultController.csを開こう
        </span>
        <span className="p-check-work__medium">
          2. プレイしたスコアをリザルトで表示できるようにしよう
        </span>
        <span className="p-check-work__text u-bl">
          Hint. scoreはPlayer.csにてstaticで宣言されているよ
        </span>
      </Accordion>
      <Accordion
        title="STEP8 完成!!"
        setSelection={() => setSelection(3)}
        isSelected={isSelected[3]}
      >
        <span className="p-check-work__medium">
          1. 実際に遊んでみよう！正常に遊べたら完成だよ！
        </span>
        <span className="p-check-work__medium">
          2. もし時間があったらアレンジを加えてみよう
        </span>
        <span className="p-check-work__text u-bl">
          Hint. アレンジ案1: 敵の種類を増やす(スコアや動くスピードを変える)
        </span>
        <span className="p-check-work__text u-bl">
          Hint. アレンジ案2:
          アイテムを使えるようにする(移動速度をゆっくりにする、時間を増やす、など)
        </span>
      </Accordion>
    </div>
  );
};

export default Page;
