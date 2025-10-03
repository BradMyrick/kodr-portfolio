@0xa4bd6cd0c4644fa1;

using Go = import "../std/go.capnp";
$Go.package("models");
$Go.import("github.com/kodr-pro/backend/internal/models");

struct Message {
  id @0 :Text;
  senderId @1 :Text;
  content @2 :Text;
  timestamp @3 :Int64;
  roomId @4 :Text;  # The room this message belongs to
}

struct Room {
  id @0 :Text;
  name @1 :Text;
  isPublic @2 :Bool;
  members @3 :List(Text);
}

struct DirectMessage {
  id @0 :Text;
  senderId @1 :Text;
  recipientId @2 :Text;
  content @3 :Text;
  timestamp @4 :Int64;
}
