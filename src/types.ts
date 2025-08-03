export type SessionType = {
  appId?: string,
  sessionId?: string,
  sessionIds?: string[],
  sessionDBId?: number,
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

export type ImageType = {
  created_at?: string,
  id?: number,
  session_id?: string,
  session_record_id?: number,
  url?: string
}

export type ImageDataType = {
  app_id: number,
  data: ImageType[],
  message: string,
  success: boolean,
  total_count: number,
}

export type ResultType = {
  success: boolean,
  result?: any,
  error?: Error | null
}

export type SignedUrlType = {
  path?: string,
  signedUrl?: string,
  signedURL?: string,
  error?: Error | null,
  status?: Status
}

export type CustomButtonType = {
  label: string, 
  containerStyles?: string,
  handlePress?: any,
  textStyles?: string, 
  isLoading?: boolean 
}

export enum Status {
  Pending = "PENDING",
  InProgress = "INPROGRESS",
  Received = "RECEIVED",
  Rejected = "REJECTED"
}