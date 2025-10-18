@0xc3d4e5f6a708192a;

using Go = import "../std/go.capnp";
$Go.package("models");
$Go.import("github.com/kodr-pro/backend/internal/models");

# Team represents a collaborative team in Kodr.pro
struct Team {
  # Unique identifier for the team
  id @0 :Text;
  
  # Basic team information
  name @1 :Text;
  description @2 :Text;
  avatar @3 :Text;           # Team avatar/logo URL
  color @4 :Text;            # Hex color code for UI theming
  
  # Team type and configuration
  type @5 :TeamType;
  visibility @6 :TeamVisibility;
  
  # Team leadership and membership
  ownerId @7 :Text;          # User ID of team owner
  members @8 :List(TeamMember);
  maxMembers @9 :Int32;      # Maximum number of members (0 = unlimited)
  
  # Team organization
  departments @10 :List(Text); # Department/division associations
  tags @11 :List(Text);      # Searchable tags
  
  # Associated projects and resources
  projectIds @12 :List(Text); # Projects this team works on
  activeProjects @13 :Int32;  # Number of active projects
  
  # Team metrics and performance
  metrics @14 :TeamMetrics;
  
  # Team settings and preferences
  settings @15 :TeamSettings;
  
  # Communication and collaboration
  channels @16 :List(TeamChannel);
  
  # Audit and timestamps
  createdAt @17 :Int64;      # Unix timestamp
  updatedAt @18 :Int64;      # Unix timestamp
  lastActivity @19 :Int64;   # Last activity timestamp
  
  # Archival and versioning
  isArchived @20 :Bool;
  version @21 :Int32;        # Schema version for migrations
}

# Team types for different organizational structures
enum TeamType {
  development @0;     # Software development team
  design @1;          # Design and UX team
  product @2;         # Product management team
  marketing @3;       # Marketing team
  sales @4;           # Sales team
  support @5;         # Customer support team
  operations @6;      # Operations team
  executive @7;       # Executive/leadership team
  crossFunctional @8; # Cross-functional team
  temporary @9;       # Temporary project team
  community @10;      # Community/open source team
}

# Team visibility levels
enum TeamVisibility {
  private @0;         # Only members can see the team
  internal @1;        # All organization members can see
  public @2;          # Anyone can see the team
}

# Team member with role and permissions
struct TeamMember {
  userId @0 :Text;           # User ID
  role @1 :TeamRole;         # Role within the team
  permissions @2 :TeamPermissions;
  title @3 :Text;            # Job title/position
  department @4 :Text;       # Department/division
  
  # Member status and timeline
  status @5 :MemberStatus;
  joinedAt @6 :Int64;        # When user joined team
  invitedBy @7 :Text;        # User ID who invited this member
  lastActive @8 :Int64;      # Last activity in team
  
  # Contribution tracking
  contributionScore @9 :Float32; # Contribution score (0-100)
  projectsInvolved @10 :Int32;   # Number of projects involved in
  
  # Availability and workload
  availability @11 :MemberAvailability;
  workload @12 :Float32;     # Current workload percentage (0-100)
}

# Team roles with different access levels
enum TeamRole {
  member @0;          # Regular team member
  lead @1;            # Team lead with additional responsibilities
  manager @2;         # Team manager
  admin @3;           # Team administrator
  owner @4;           # Team owner with full control
}

# Member status in team
enum MemberStatus {
  active @0;          # Active member
  inactive @1;        # Temporarily inactive
  onLeave @2;         # On leave/vacation
  pending @3;         # Pending invitation acceptance
  suspended @4;       # Suspended from team
}

# Granular permissions for capability-based access control
struct TeamPermissions {
  canViewTeam @0 :Bool;
  canEditTeam @1 :Bool;
  canDeleteTeam @2 :Bool;
  canManageMembers @3 :Bool;
  canInviteMembers @4 :Bool;
  canRemoveMembers @5 :Bool;
  canCreateProjects @6 :Bool;
  canManageProjects @7 :Bool;
  canViewAnalytics @8 :Bool;
  canManageSettings @9 :Bool;
  canExportData @10 :Bool;
}

# Member availability information
struct MemberAvailability {
  hoursPerWeek @0 :Float32;  # Available hours per week
  timezone @1 :Text;         # Timezone (e.g., "UTC", "America/New_York")
  workingHours @2 :WorkingHours;
  vacationDays @3 :List(VacationPeriod);
  isRemote @4 :Bool;         # Whether member works remotely
  location @5 :Text;         # Work location/office
}

# Working hours definition
struct WorkingHours {
  monday @0 :DaySchedule;
  tuesday @1 :DaySchedule;
  wednesday @2 :DaySchedule;
  thursday @3 :DaySchedule;
  friday @4 :DaySchedule;
  saturday @5 :DaySchedule;
  sunday @6 :DaySchedule;
}

# Daily schedule
struct DaySchedule {
  isWorkingDay @0 :Bool;
  startTime @1 :Text;        # Format: "HH:MM"
  endTime @2 :Text;          # Format: "HH:MM"
  breaks @3 :List(TimeSlot); # Break periods
}

# Time slot for breaks, meetings, etc.
struct TimeSlot {
  startTime @0 :Text;        # Format: "HH:MM"
  endTime @1 :Text;          # Format: "HH:MM"
  description @2 :Text;      # Optional description
}

# Vacation/leave period
struct VacationPeriod {
  startDate @0 :Int64;       # Unix timestamp
  endDate @1 :Int64;         # Unix timestamp
  type @2 :LeaveType;
  description @3 :Text;      # Optional description
}

enum LeaveType {
  vacation @0;
  sick @1;
  personal @2;
  maternity @3;
  paternity @4;
  bereavement @5;
  other @6;
}

# Team performance metrics
struct TeamMetrics {
  # Project metrics
  projectsCompleted @0 :Int32;
  projectsInProgress @1 :Int32;
  averageProjectDuration @2 :Float32; # Days
  
  # Idea metrics
  ideasGenerated @3 :Int32;
  ideasImplemented @4 :Int32;
  innovationScore @5 :Float32;        # Innovation score (0-100)
  
  # Collaboration metrics
  collaborationScore @6 :Float32;     # Collaboration score (0-100)
  communicationFrequency @7 :Float32; # Messages per day
  
  # Performance metrics
  velocity @8 :Float32;               # Team velocity
  productivity @9 :Float32;           # Productivity score (0-100)
  satisfaction @10 :Float32;          # Team satisfaction score (0-100)
  
  # Timeline
  periodStart @11 :Int64;             # Metrics period start
  periodEnd @12 :Int64;               # Metrics period end
  lastCalculated @13 :Int64;          # Last calculation timestamp
}

# Team settings and preferences
struct TeamSettings {
  # Communication preferences
  defaultNotifications @0 :Bool;      # Default notification settings
  allowDirectMessages @1 :Bool;       # Allow DMs between members
  
  # Workflow settings
  requireApproval @2 :Bool;           # Require approval for new members
  autoAssignProjects @3 :Bool;        # Auto-assign projects to members
  
  # AI and automation
  aiEnabled @4 :Bool;                 # AI assistance enabled
  autoSuggestMembers @5 :Bool;        # Auto-suggest team members for projects
  
  # Privacy and security
  dataRetention @6 :Int32;            # Data retention period in days
  allowExternalSharing @7 :Bool;      # Allow sharing with external users
  
  # Integration settings
  integrations @8 :List(TeamIntegration);
}

# External integrations
struct TeamIntegration {
  name @0 :Text;             # Integration name (e.g., "slack", "jira")
  enabled @1 :Bool;
  configuration @2 :Text;    # JSON configuration
  webhookUrl @3 :Text;       # Webhook URL for notifications
  lastSync @4 :Int64;        # Last synchronization timestamp
}

# Team communication channels
struct TeamChannel {
  id @0 :Text;
  name @1 :Text;
  description @2 :Text;
  type @3 :ChannelType;
  isPrivate @4 :Bool;
  members @5 :List(Text);    # User IDs with access
  createdBy @6 :Text;        # User ID who created channel
  createdAt @7 :Int64;
  lastActivity @8 :Int64;
  messageCount @9 :Int32;    # Total messages in channel
}

enum ChannelType {
  general @0;        # General discussion
  project @1;        # Project-specific channel
  announcements @2;  # Announcements only
  random @3;         # Random/casual chat
  support @4;        # Support discussions
  ideas @5;          # Ideas and innovation
}
