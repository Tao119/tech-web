import React, { useContext, useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import Image from "next/image";
import { STATUSES } from "@/constant/status";
import SampleImage from "@/assets/img/sushida-sample.png";
import ExampleImage from "@/assets/img/example.png";
import Tesseract, { ImageLike } from "tesseract.js";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { OverLay } from "@/components/overlay";
import ReadingAnimation from "@/assets/json/reading-animation.json";
import UploadingAnimation from "@/assets/json/uploading-animation.json";
import { AnimationContext, UserContext } from "@/app/contextProvider";
import { CloseButton } from "@/components/closeButton";

import { SushidaData, createSushidaData } from "@/models/sushida";
import { Timestamp } from "firebase/firestore";

export const courses = [3000, 5000, 10000];

const SaveResult = ({ fetchData }: { fetchData: Function }) => {
  const [image, setImage] = useState<string>();
  const [uploadedImage, uploadImage] = useState<File>();
  const [err, setErr] = useState("");
  const [openCropper, setOpenCropper] = useState(false);
  const [data, setData] = useState<SushidaData>();
  const { userData } = useContext(UserContext)!;
  const { startLottie, endLottie } = useContext(AnimationContext)!;

  const cropperRef = useRef<ReactCropperElement>(null);

  const OCRImage = () => {
    if (!userData) return;
    startLottie(ReadingAnimation);
    setErr("");
    var buf = document.querySelector("#target");
    Tesseract.recognize(buf as ImageLike, "jpn").then(function (result) {
      const text = result.data.text.replaceAll(",", "").replaceAll(".", "");
      const nums = text.match(/\d+/g);
      if (nums?.length! < 7) {
        setErr(STATUSES.FAILED);
        endLottie();
        return;
      }
      var score = 0;
      const [course, pay, course2, diff, correctKey, typeSpeed, missNum] = [
        parseInt(nums![0]),
        parseInt(nums![1]),
        parseInt(nums![2]),
        parseInt(nums![3]),
        parseInt(nums![4]),
        parseInt(nums![5]) / 10,
        parseInt(nums![6]),
      ];

      score = pay - course;
      if (
        Math.abs(score) != diff ||
        course != course2 ||
        !courses.includes(course)
      ) {
        setErr(STATUSES.FAILED);
        endLottie();
        return;
      }
      const date = new Date();

      setData({
        userId: userData.id,
        course,
        score,
        typeSpeed,
        missNum,
        date,
      });
      endLottie();
    });
  };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files || e.target.files?.length == 0) return;

    const selectedImage = e.target.files[0];
    uploadImage(selectedImage);
    setOpenCropper(true);
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setImage(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
    }
    OCRImage();
    setOpenCropper(false);
  };

  const saveScore = async () => {
    try {
      if (!confirm("このデータで登録しますか？")) return;
      startLottie(UploadingAnimation);
      if (!data) return;
      await createSushidaData(
        {
          ...data,
          ...{ time: Timestamp.fromDate(data.date) },
        },
        uploadedImage
      );
      await fetchData();
      if (!alert("登録完了しました")!) {
        setData(undefined);
        uploadImage(undefined);
        setImage(undefined);
      }
    } catch (error) {}
    endLottie();
  };
  return (
    <>
      <div className="p-sushida-save__err">{err}</div>
      <div className="p-sushida-save__data-container">
        {image ? (
          <Image
            className="p-sushida-save__upload-image"
            id="target"
            src={image}
            alt="user image"
            width={500}
            height={400}
          />
        ) : (
          <Image
            className="p-sushida-save__upload-image"
            id="target"
            src={SampleImage}
            alt="sample"
            width={500}
            height={400}
          />
        )}
        <div className="p-sushida-save__data">
          <div className="p-sushida-save__data-data">
            コース　　：
            {/* contentEditable={true}
              onBlur={(e) => {
                const inputText = (e.target as HTMLElement).textContent!;
                const course = parseInt(inputText);
                if (!courses.includes(course))
                  return alert("有効な値を入力してください");
                const d = { ...data } as SushidaData;
                d.course = course;
                setData(d);
              }} */}
            {data?.course}
          </div>
          <div className="p-sushida-save__data-data">
            結果　　　：
            {data?.score}
          </div>
          <div className="p-sushida-save__data-data">
            タイプ速度：
            {data?.typeSpeed}
          </div>
          <div className="p-sushida-save__data-data">
            ミス数　　：
            {data?.missNum}
          </div>
        </div>
      </div>
      <div className="p-sushida-save__buttons">
        <input
          className="p-sushida-save__upload-button"
          type="file"
          onChange={handleInput}
          accept="image/*"
        />
        <Button
          className={`p-sushida-save__cropper-button ${
            !uploadedImage ? "-disabled" : ""
          }`}
          disabled={!uploadedImage}
          label="トリミング"
          onClick={() => {
            setOpenCropper(true);
          }}
        />
      </div>
      <Button
        className={`p-sushida-save__submit ${!data ? "-disabled" : ""}`}
        disabled={!data}
        label="登録する"
        onClick={saveScore}
      />
      {openCropper && uploadedImage ? (
        <>
          <div className="p-sushida-save__cropper-container">
            <CloseButton
              className="p-sushida-save__cropper-close"
              onClick={() => setOpenCropper(false)}
            />
            <span className="p-sushida-save__cropper-title">トリミング</span>
            <div className="p-sushida-save__cropper-example">
              <Image
                src={ExampleImage}
                alt=""
                className="p-sushida-save__cropper-example-image"
              />
              <span className="p-sushida-save__cropper-example-text">
                画像のように全てのデータがちょうど入るようにトリミングしてください
              </span>
            </div>
            <Cropper
              className="p-sushida-save__cropper"
              aspectRatio={1.7}
              preview=".img-preview"
              src={URL.createObjectURL(uploadedImage)}
              ref={cropperRef}
              viewMode={1}
              guides={true}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              checkOrientation={false}
            />
            <Button
              className="p-sushida-save__croper-submit"
              label="切り抜く"
              onClick={getCropData}
            />
          </div>
          <OverLay className="p-sushida-save__overlay" />
        </>
      ) : (
        <></>
      )}
    </>
  );
};
export default SaveResult;
