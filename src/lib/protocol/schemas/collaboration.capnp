@0xff809ef2338a23d6;

using Go = import "../std/go.capnp";
$Go.package("models");
$Go.import("github.com/kodr-pro/backend/internal/models");

# Role enum for project members
enum MemberRole {
  viewer @0;      # Can view project only
  contributor @1; # Can contribute to project
  maintainer @2;  # Can manage project settings
  owner @3;       # Full control over project
}

# Project member structure
struct CollabProjectMember {
  projectId @0 :Text;
  userId @1 :Text;
  role @2 :MemberRole;
  joinedAt @3 :Int64;  # Unix timestamp
  invitedBy @4 :Text;  # User ID of inviter
}

# Team member structure (for future team features)
struct CollabTeamMember {
  teamId @0 :Text;
  userId @1 :Text;
  role @2 :MemberRole;
  joinedAt @3 :Int64;
  invitedBy @4 :Text;
}

# Invitation structure
struct Invitation {
  id @0 :Text;
  projectId @1 :Text;
  inviterId @2 :Text;
  inviteeEmail @3 :Text;
  role @4 :MemberRole;
  createdAt @5 :Int64;
  expiresAt @6 :Int64;
  status @7 :InvitationStatus;
  acceptedAt @8 :Int64;
}

enum InvitationStatus {
  pending @0;
  accepted @1;
  declined @2;
  expired @3;
  revoked @4;
}

# Activity log for audit trail
struct CollaborationActivity {
  id @0 :Text;
  projectId @1 :Text;
  actorId @2 :Text;
  action @3 :Text;  # "added_member", "removed_member", "changed_role", etc.
  targetUserId @4 :Text;
  metadata @5 :Text;  # JSON string for additional data
  timestamp @6 :Int64;
}
