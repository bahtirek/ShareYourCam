export type SessionType = {
  appId?: string,
  sessionId?: string,
  sessionIds?: string[],
  role?: string,
  jwt?: any,
  receiverSessionId?: string
}

export type Action = {
  label: string,
  style: string,
  onPress: () => void
}

export type AlertModalType = {
  title: string, 
  text: string, 
  actions: Action[], 
  showModal: boolean
}