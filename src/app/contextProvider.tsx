"use client";
import useAnimation, { LottieContext } from "@/hooks/useAnimation";
import { GroupSelect, useGroupSelect } from "@/hooks/useGroupSelect";
import { UserDataContext, useUserData } from "@/hooks/useUserData";
import { ReactNode, createContext, useEffect } from "react";

export const AnimationContext = createContext<LottieContext | undefined>(
  undefined
);
export const GroupContext = createContext<GroupSelect | undefined>(undefined);
export const UserContext = createContext<UserDataContext | undefined>(
  undefined
);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const animation = useAnimation();
  return (
    <AnimationContext.Provider value={animation}>
      <GroupContext.Provider value={useGroupSelect()}>
        <UserContext.Provider value={useUserData()}>
          {children}
          {animation.isVisible && (
            <>
              <div className="l-overlay" />
              <div className="l-animation">{animation.View}</div>
            </>
          )}
        </UserContext.Provider>
      </GroupContext.Provider>
    </AnimationContext.Provider>
  );
};
