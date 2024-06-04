import {
  AnimationContext,
  GroupContext,
  UserContext,
} from "@/app/contextProvider";
import Image, { StaticImageData } from "next/image";
import { MouseEventHandler, useContext, useEffect, useState } from "react";
import LoadingAnimation from "@/assets/json/loading-animation.json";
import {
  NotificationData,
  NotificationType,
  readNotificationDataByUserId,
  updateReadStatus,
  uploadNotification,
} from "@/models/notification";
import { Button } from "@/components/button";
import { CloseButton } from "@/components/closeButton";
import { approveRequest } from "@/models/groupRequests";
import { BackButton } from "@/components/backbutton";
import { approveReqestsString } from "@/constant/strings";
import { readGroupById } from "@/models/groups";
import { Timestamp } from "firebase/firestore";

export const Notification = ({
  close,
  notifications,
}: {
  close: Function;
  notifications: NotificationData[];
}) => {
  const { startLottie, endLottie } = useContext(AnimationContext)!;
  const [detailNum, setDetailNum] = useState<number | null>(null);
  useEffect(() => {
    notifications.sort((a, b) => (a.date > b.date ? 1 : -1));
  }, [notifications]);

  const updateRequests = async (
    requestId: string,
    approve: boolean,
    notification: NotificationData
  ) => {
    startLottie(LoadingAnimation);
    const res = await approveRequest(requestId, approve);
    if (!res.success || !res.data) {
      console.error(res.error);
      alert("失敗しました");
      endLottie();
      return;
    }
    await updateReadStatus(notification.id!, true);
    const res2 = await readGroupById(res.data.groupId);
    if (!res2.success || !res2.data) {
      console.error(res2.error);
      alert("失敗しました");
      endLottie();
      return;
    }

    const res3 = await uploadNotification({
      userId: res.data.userId,
      type: NotificationType.text,
      time: Timestamp.fromDate(new Date()),
      date: new Date(),
      read: false,
      ...approveReqestsString(res2.data.name, approve),
    });
    if (!res3.success) {
      console.error(res3.error);
      endLottie();
      return;
    }
    notification.read = true;
    if (!alert("完了しました")!) {
      endLottie();
    }
  };

  return (
    <div className="p-notification">
      <CloseButton className="p-notification__close" onClick={() => close()} />
      <span className="p-notification__title">通知</span>
      {detailNum != null ? (
        <div className="p-notification__detail">
          <BackButton
            className="p-notification__detail-back"
            back={() => setDetailNum(null)}
          />
          <span className="p-notification__detail-title">
            {notifications[detailNum].title}
          </span>
          <div className="p-notification__detail-content">
            {notifications[detailNum].content}
          </div>
          {notifications[detailNum].type == NotificationType.request &&
          notifications[detailNum].requestId ? (
            notifications[detailNum].read ? (
              <span className="p-notification__detail-text">
                リクエストに回答済みです
              </span>
            ) : (
              <div className="p-notification__detail-buttons">
                <Button
                  className="p-notification__detail-button"
                  label="承認する"
                  onClick={() => {
                    if (confirm("本当に承認しますか？")) {
                      updateRequests(
                        notifications[detailNum].requestId!,
                        true,
                        notifications[detailNum]
                      );
                    }
                  }}
                />
                <Button
                  className="p-notification__detail-button u-bg-re"
                  label="拒否する"
                  onClick={() => {
                    if (confirm("本当に拒否しますか？")) {
                      updateRequests(
                        notifications[detailNum].requestId!,
                        false,
                        notifications[detailNum]
                      );
                    }
                  }}
                />
              </div>
            )
          ) : null}
        </div>
      ) : notifications.length > 0 ? (
        notifications.map((d, i) => (
          <div
            className={`p-notification__item ${d.read ? "" : "-unread"}`}
            onClick={async () => {
              setDetailNum(i);
              if (!d.read && d.id && d.type != NotificationType.request) {
                await updateReadStatus(d.id, true);
                d.read = true;
              }
            }}
            key={i}
          >
            <span className="p-notification__item-title">{d.title}</span>
            <div className="p-notification__item-content">{d.content}</div>
          </div>
        ))
      ) : (
        <span className="p-notification__detail-title">通知はありません</span>
      )}
    </div>
  );
};
