@0xa1b2c3d4e5f6a708;

using Go = import "../std/go.capnp";
$Go.package("models");
$Go.import("github.com/kodr-pro/backend/internal/models");

# Project represents a collaborative project in Kodr.pro
struct Project {
  # Unique identifier for the project
  id @0 :Text;
  
  # Basic project information
  name @1 :Text;
  description @2 :Text;
  avatar @3 :Text;           # Project avatar/logo URL
  color @4 :Text;            # Hex color code for UI theming
  
  # Project status and lifecycle
  status @5 :ProjectStatus;
  priority @6 :ProjectPriority;
  
  # Ownership and membership
  owner @7 :Text;            # User ID of project owner
  members @8 :List(ProjectMember);
  teamIds @9 :List(Text);    # Associated team IDs
  
  # Project metadata
  tags @10 :List(Text);      # Searchable tags
  category @11 :Text;        # Project category/type
  isPublic @12 :Bool;        # Public visibility
  
  # Timeline and milestones
  startDate @13 :Int64;      # Planned start date (Unix timestamp)
  endDate @14 :Int64;        # Planned end date (Unix timestamp)
  milestones @15 :List(Milestone);
  
  # Progress tracking
  progress @16 :ProjectProgress;
  
  # AI and automation settings
  aiEnabled @17 :Bool;       # AI assistance enabled
  autoGenerateIdeas @18 :Bool;
  
  # Audit and timestamps
  createdAt @19 :Int64;      # Unix timestamp
  updatedAt @20 :Int64;      # Unix timestamp
  lastActivity @21 :Int64;   # Last activity timestamp
  
  # Archival and versioning
  isArchived @22 :Bool;
  version @23 :Int32;        # Schema version for migrations
}

# Project status enumeration
enum ProjectStatus {
  draft @0;          # Project in planning phase
  active @1;         # Actively being worked on
  onHold @2;         # Temporarily paused
  completed @3;      # Successfully completed
  cancelled @4;      # Project cancelled
  archived @5;       # Archived for reference
}

# Project priority levels
enum ProjectPriority {
  low @0;
  medium @1;
  high @2;
  critical @3;
}

# Project member with role and permissions
struct ProjectMember {
  userId @0 :Text;           # User ID
  role @1 :ProjectRole;      # Role within the project
  permissions @2 :ProjectPermissions;
  joinedAt @3 :Int64;        # When user joined project
  invitedBy @4 :Text;        # User ID who invited this member
  lastActive @5 :Int64;      # Last activity in project
}

# Project roles with different access levels
enum ProjectRole {
  viewer @0;         # Read-only access
  contributor @1;    # Can create/edit ideas and resources
  maintainer @2;     # Can manage project settings and members
  owner @3;          # Full control over project
}

# Granular permissions for capability-based access control
struct ProjectPermissions {
  canViewProject @0 :Bool;
  canEditProject @1 :Bool;
  canDeleteProject @2 :Bool;
  canManageMembers @3 :Bool;
  canCreateIdeas @4 :Bool;
  canEditIdeas @5 :Bool;
  canDeleteIdeas @6 :Bool;
  canManageResources @7 :Bool;
  canViewAnalytics @8 :Bool;
  canExportData @9 :Bool;
}

# Project milestone tracking
struct Milestone {
  id @0 :Text;
  title @1 :Text;
  description @2 :Text;
  dueDate @3 :Int64;         # Unix timestamp
  status @4 :MilestoneStatus;
  assigneeId @5 :Text;       # User ID responsible
  completedAt @6 :Int64;     # Completion timestamp
  createdAt @7 :Int64;
  updatedAt @8 :Int64;
}

enum MilestoneStatus {
  planned @0;
  inProgress @1;
  completed @2;
  overdue @3;
  cancelled @4;
}

# Project progress metrics
struct ProjectProgress {
  # Overall completion percentage (0-100)
  completionPercentage @0 :Float32;
  
  # Task/idea completion stats
  totalIdeas @1 :Int32;
  completedIdeas @2 :Int32;
  inProgressIdeas @3 :Int32;
  
  # Timeline progress
  daysElapsed @4 :Int32;
  daysRemaining @5 :Int32;
  isOnSchedule @6 :Bool;
  
  # Activity metrics
  weeklyActivity @7 :Int32;  # Activities this week
  monthlyActivity @8 :Int32; # Activities this month
  
  # Last calculated timestamp
  lastUpdated @9 :Int64;
}
