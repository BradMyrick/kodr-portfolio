@0xd7f2a3f2b1e4d5c8;

using Go = import "../../../std/go.capnp";
$Go.package("protocol");
$Go.import("github.com/kodr-pro/backend/internal/rpc/protocol");

# Import message types
using Message = import "../../../schemas/message.capnp".Message;
using Room = import "../../../schemas/message.capnp".Room;
using DirectMessage = import "../../../schemas/message.capnp".DirectMessage;
using User = import "../../../schemas/user.capnp".User;

# WebSocket Request
struct WebSocketRequest {
  id @0 :Text;          # Unique request ID
  method @1 :Text;      # Method name
  timestamp @2 :Int64;  # Unix timestamp
  
  # Parameters based on method
  params :union {
    # Chat operations
    sendMessage @3 :SendMessageParams;
    joinRoom @4 :JoinRoomParams;
    leaveRoom @5 :LeaveRoomParams;
    getMessages @6 :GetMessagesParams;
    getRooms @7 :GetRoomsParams;
    createRoom @8 :CreateRoomParams;
    typing @9 :TypingParams;
    
    # User operations
    getUser @10 :GetUserParams;
    updateProfile @11 :UpdateProfileParams;
    
    # Direct messages
    sendDirectMessage @12 :SendDirectMessageParams;
    getDirectMessages @13 :GetDirectMessagesParams;
    
    # Generic params for backwards compatibility
    generic @14 :Data;
  }
}

# WebSocket Response
struct WebSocketResponse {
  id @0 :Text;          # Correlates with request ID
  success @1 :Bool;     # Success indicator
  timestamp @2 :Int64;  # Unix timestamp
  
  # Result or error
  result :union {
    # Success responses
    message @3 :Message;
    messages @4 :List(Message);
    room @5 :Room;
    rooms @6 :List(Room);
    user @7 :User;
    users @8 :List(User);
    directMessage @9 :DirectMessage;
    directMessages @10 :List(DirectMessage);
    
    # Simple success
    ok @11 :Void;
    
    # Generic data
    data @12 :Data;
    
    # Error
    error @13 :ErrorInfo;
  }
}

# Realtime Event (server -> client push)
struct RealtimeEvent {
  id @0 :Text;
  timestamp @1 :Int64;
  
  event :union {
    # Message events
    newMessage @2 :Message;
    messageEdited @3 :Message;
    messageDeleted @4 :MessageDeleted;
    
    # Room events  
    userJoined @5 :UserRoomEvent;
    userLeft @6 :UserRoomEvent;
    roomUpdated @7 :Room;
    
    # Presence events
    userOnline @8 :UserPresence;
    userOffline @9 :UserPresence;
    typing @10 :TypingEvent;
    
    # Direct message events
    newDirectMessage @11 :DirectMessage;
    
    # System events
    notification @12 :Notification;
  }
}

# Parameter structures
struct SendMessageParams {
  roomId @0 :Text;
  content @1 :Text;
  replyTo @2 :Text;  # Optional reply to message ID
}

struct JoinRoomParams {
  roomId @0 :Text;
}

struct LeaveRoomParams {
  roomId @0 :Text;
}

struct GetMessagesParams {
  roomId @0 :Text;
  limit @1 :Int32 = 50;
  before @2 :Text;  # Message ID for pagination
}

struct GetRoomsParams {
  publicOnly @0 :Bool = false;
}

struct CreateRoomParams {
  name @0 :Text;
  description @1 :Text;
  isPublic @2 :Bool = true;
}

struct TypingParams {
  roomId @0 :Text;
  isTyping @1 :Bool;
}

struct GetUserParams {
  userId @0 :Text;
}

struct UpdateProfileParams {
  name @0 :Text;
  avatar @1 :Text;
  bio @2 :Text;
}

struct SendDirectMessageParams {
  recipientId @0 :Text;
  content @1 :Text;
}

struct GetDirectMessagesParams {
  userId @0 :Text;
  limit @1 :Int32 = 50;
  before @2 :Text;
}

# Event structures
struct MessageDeleted {
  messageId @0 :Text;
  roomId @1 :Text;
}

struct UserRoomEvent {
  userId @0 :Text;
  userName @1 :Text;
  roomId @2 :Text;
}

struct UserPresence {
  userId @0 :Text;
  userName @1 :Text;
  status @2 :Text;  # online, away, offline
  lastSeen @3 :Int64;
}

struct TypingEvent {
  userId @0 :Text;
  userName @1 :Text;
  roomId @2 :Text;
  isTyping @3 :Bool;
}

struct Notification {
  type @0 :Text;
  title @1 :Text;
  message @2 :Text;
  data @3 :Data;
}

struct ErrorInfo {
  code @0 :Int32;
  message @1 :Text;
  details @2 :Text;
}