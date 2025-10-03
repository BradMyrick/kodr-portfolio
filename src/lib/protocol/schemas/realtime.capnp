@0xb5f8c9a2d7e6f4a3;

using Go = import "../std/go.capnp";
$Go.package("models");
$Go.import("github.com/kodr-pro/backend/internal/models");

# Real-time event types
enum EventType {
  chatMessage @0;
  presenceUpdate @1;
  typing @2;
  roomJoined @3;
  roomLeft @4;
  userOnline @5;
  userOffline @6;
  messageEdited @7;
  messageDeleted @8;
  reactionAdded @9;
  reactionRemoved @10;
  aiInsight @11;
  jiraUpdate @12;
  slackBridge @13;
}

# Main event wrapper
struct RealtimeEvent {
  id @0 :Text;
  type @1 :EventType;
  timestamp @2 :Int64;
  payload :union {
    chatMessage @3 :ChatMessage;
    presenceUpdate @4 :PresenceUpdate;
    typing @5 :TypingIndicator;
    roomEvent @6 :RoomEvent;
    messageUpdate @7 :MessageUpdate;
    reaction @8 :ReactionEvent;
    aiInsight @9 :AIInsight;
    integration @10 :IntegrationEvent;
  }
}

# Chat message event
struct ChatMessage {
  id @0 :Text;
  roomId @1 :Text;
  senderId @2 :Text;
  senderName @3 :Text;
  content @4 :Text;
  timestamp @5 :Int64;
  attachments @6 :List(Attachment);
  mentions @7 :List(Text);  # User IDs mentioned
  replyTo @8 :Text;  # Message ID being replied to
  threadId @9 :Text;  # Thread ID for threaded messages
}

# Attachment structure
struct Attachment {
  id @0 :Text;
  type @1 :Text;  # image, file, video, etc.
  url @2 :Text;
  name @3 :Text;
  size @4 :Int64;
  mimeType @5 :Text;
}

# Presence update event
struct PresenceUpdate {
  userId @0 :Text;
  userName @1 :Text;
  status @2 :UserStatus;
  lastSeen @3 :Int64;
  statusMessage @4 :Text;
  activeRooms @5 :List(Text);  # Room IDs where user is active
}

enum UserStatus {
  online @0;
  away @1;
  busy @2;
  doNotDisturb @3;
  offline @4;
}

# Typing indicator event
struct TypingIndicator {
  userId @0 :Text;
  userName @1 :Text;
  roomId @2 :Text;
  isTyping @3 :Bool;
  timestamp @4 :Int64;
}

# Room membership events
struct RoomEvent {
  roomId @0 :Text;
  roomName @1 :Text;
  userId @2 :Text;
  userName @3 :Text;
  action @4 :RoomAction;
  timestamp @5 :Int64;
}

enum RoomAction {
  joined @0;
  left @1;
  invited @2;
  kicked @3;
  promoted @4;  # Made moderator/admin
  demoted @5;
}

# Message update events (edit/delete)
struct MessageUpdate {
  messageId @0 :Text;
  roomId @1 :Text;
  action @2 :MessageAction;
  newContent @3 :Text;  # For edits
  editedBy @4 :Text;
  editedAt @5 :Int64;
}

enum MessageAction {
  edited @0;
  deleted @1;
  pinned @2;
  unpinned @3;
}

# Reaction events
struct ReactionEvent {
  messageId @0 :Text;
  roomId @1 :Text;
  userId @2 :Text;
  userName @3 :Text;
  emoji @4 :Text;
  action @5 :ReactionAction;
  timestamp @6 :Int64;
}

enum ReactionAction {
  added @0;
  removed @1;
}

# AI Insight event
struct AIInsight {
  roomId @0 :Text;
  type @1 :InsightType;
  title @2 :Text;
  content @3 :Text;
  suggestions @4 :List(Text);
  confidence @5 :Float32;
  context @6 :Text;  # JSON context data
  generatedAt @7 :Int64;
}

enum InsightType {
  summary @0;
  actionItems @1;
  sentiment @2;
  suggestion @3;
  warning @4;
  automation @5;
}

# Integration events (Jira, Slack, etc.)
struct IntegrationEvent {
  source @0 :IntegrationSource;
  eventType @1 :Text;
  entityId @2 :Text;  # Issue ID, PR number, etc.
  title @3 :Text;
  description @4 :Text;
  url @5 :Text;
  author @6 :Text;
  roomId @7 :Text;  # Room to notify
  data @8 :Text;  # JSON payload
  timestamp @9 :Int64;
}

enum IntegrationSource {
  jira @0;
  slack @1;
  github @2;
  gitlab @3;
  trello @4;
  asana @5;
  custom @6;
}

# WebSocket connection info
struct ConnectionInfo {
  connectionId @0 :Text;
  userId @1 :Text;
  connectedAt @2 :Int64;
  userAgent @3 :Text;
  ipAddress @4 :Text;
  authenticated @5 :Bool;
}

# Subscription management
struct Subscription {
  connectionId @0 :Text;
  roomIds @1 :List(Text);
  eventTypes @2 :List(EventType);
  filters @3 :Text;  # JSON filter criteria
}