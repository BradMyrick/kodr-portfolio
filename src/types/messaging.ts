export interface Message {
  id: string;
  sender_id: string;
  content: string;
  timestamp: number;
}

export interface Room {
  id: string;
  name: string;
  is_public: boolean;
  members: string[];
}

export interface DirectMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  timestamp: number;
}

export interface CreateRoomRequest {
  name: string;
  is_public: boolean;
}

export interface SendMessageRequest {
  content: string;
}

export interface SendDirectMessageRequest {
  recipient_id: string;
  content: string;
}
