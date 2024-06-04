export const createReqestsString = (userName: string, groupName: string): { title: string, content: string } => {
    return {
        title: "リクエスト",
        content: `${userName}さんから${groupName}への参加リクエストが届いています！`
    }
}
export const approveReqestsString = (groupName: string, approve: boolean): { title: string, content: string } => {
    return {
        title: `リクエストの${approve ? "承認" : "拒否"}`,
        content: `${groupName}への参加リクエストが${approve ? "承認" : "拒否"}されました`
    }
}