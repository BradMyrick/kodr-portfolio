@0xabcdef1234567890;

using Go = import "../std/go.capnp";
$Go.package("rpc");
$Go.import("github.com/kodr-pro/backend/internal/rpc");

using User = import "user.capnp";
using Project = import "project.capnp";
using Idea = import "idea.capnp";
using Message = import "message.capnp";

# Authentication service for Cap'n Proto RPC
interface AuthService {
  # Login with email and password
  login @0 (email :Text, password :Text) -> (token :Text, refreshToken :Text, user :User.User);
  
  # Login with OAuth
  loginOAuth @1 (provider :User.OAuthType, code :Text) -> (token :Text, refreshToken :Text, user :User.User);
  
  # Login with wallet
  loginWallet @2 (walletType :User.WalletType, address :Text, signature :Text) -> (token :Text, refreshToken :Text, user :User.User);
  
  # Refresh access token
  refreshToken @3 (refreshToken :Text) -> (token :Text, newRefreshToken :Text);
  
  # Logout
  logout @4 (token :Text) -> ();
  
  # Verify email
  verifyEmail @5 (token :Text, verificationCode :Text) -> (success :Bool);
}

# User service for Cap'n Proto RPC
interface UserService {
  # Get user by ID
  getUser @0 (userId :Text, token :Text) -> (user :User.User);
  
  # Update user profile
  updateProfile @1 (userId :Text, token :Text, updates :UserUpdate) -> (user :User.User);
  
  # Update user preferences
  updatePreferences @2 (userId :Text, token :Text, preferences :User.UserPreferences) -> (user :User.User);
  
  # Search users
  searchUsers @3 (query :Text, limit :Int32, offset :Int32, token :Text) -> (users :List(User.User), total :Int32);
  
  # Get user's projects
  getUserProjects @4 (userId :Text, token :Text) -> (projects :List(Project.Project));
  
  # Enable two-factor authentication
  enableTwoFactor @5 (userId :Text, token :Text, secret :Text) -> (success :Bool, backupCodes :List(Text));
  
  # Disable two-factor authentication
  disableTwoFactor @6 (userId :Text, token :Text, password :Text) -> (success :Bool);
}

# Project service for Cap'n Proto RPC
interface ProjectService {
  # Create project
  createProject @0 (project :Project.Project, token :Text) -> (project :Project.Project);
  
  # Get project by ID
  getProject @1 (projectId :Text, token :Text) -> (project :Project.Project);
  
  # Update project
  updateProject @2 (projectId :Text, updates :ProjectUpdate, token :Text) -> (project :Project.Project);
  
  # Delete project
  deleteProject @3 (projectId :Text, token :Text) -> (success :Bool);
  
  # Add member to project
  addMember @4 (projectId :Text, userId :Text, role :Project.ProjectRole, token :Text) -> (member :Project.ProjectMember);
  
  # Remove member from project
  removeMember @5 (projectId :Text, userId :Text, token :Text) -> (success :Bool);
  
  # Update member role
  updateMemberRole @6 (projectId :Text, userId :Text, role :Project.ProjectRole, token :Text) -> (member :Project.ProjectMember);
  
  # Get project ideas
  getProjectIdeas @7 (projectId :Text, limit :Int32, offset :Int32, token :Text) -> (ideas :List(Idea.Idea), total :Int32);
  
  # Search projects
  searchProjects @8 (query :Text, filters :SearchFilters, limit :Int32, offset :Int32, token :Text) -> (projects :List(Project.Project), total :Int32);
  
  # Get project analytics
  getProjectAnalytics @9 (projectId :Text, token :Text) -> (analytics :ProjectAnalytics);
  
  # Create milestone
  createMilestone @10 (projectId :Text, milestone :Project.Milestone, token :Text) -> (milestone :Project.Milestone);
  
  # Update milestone
  updateMilestone @11 (projectId :Text, milestoneId :Text, updates :MilestoneUpdate, token :Text) -> (milestone :Project.Milestone);
}

# Real-time collaboration service
interface CollaborationService {
  # Subscribe to project updates
  subscribeProject @0 (projectId :Text, token :Text) -> (stream :EventStream);
  
  # Subscribe to idea updates
  subscribeIdea @1 (ideaId :Text, token :Text) -> (stream :EventStream);
  
  # Send collaboration event
  sendEvent @2 (event :CollaborationEvent, token :Text) -> ();
  
  # Get active collaborators
  getActiveCollaborators @3 (projectId :Text, token :Text) -> (collaborators :List(Collaborator));
  
  # Start WebRTC session
  startWebRTCSession @4 (projectId :Text, token :Text) -> (sessionId :Text, offer :Text);
  
  # Join WebRTC session
  joinWebRTCSession @5 (sessionId :Text, answer :Text, token :Text) -> (success :Bool);
  
  # Exchange ICE candidates
  exchangeICECandidate @6 (sessionId :Text, candidate :Text, token :Text) -> ();
}

# Event sourcing service
interface EventService {
  # Get project events
  getProjectEvents @0 (projectId :Text, since :Int64, until :Int64, token :Text) -> (events :List(Event));
  
  # Get user events
  getUserEvents @1 (userId :Text, since :Int64, until :Int64, token :Text) -> (events :List(Event));
  
  # Replay events
  replayEvents @2 (entityId :Text, entityType :EntityType, until :Int64, token :Text) -> (state :Data);
  
  # Get event snapshot
  getSnapshot @3 (entityId :Text, entityType :EntityType, timestamp :Int64, token :Text) -> (snapshot :Data);
}

# Supporting structures

struct UserUpdate {
  name @0 :Text;
  avatar @1 :Text;
  email @2 :Text;
}

struct ProjectUpdate {
  name @0 :Text;
  description @1 :Text;
  status @2 :Project.ProjectStatus;
  priority @3 :Project.ProjectPriority;
  tags @4 :List(Text);
  isPublic @5 :Bool;
}

struct MilestoneUpdate {
  title @0 :Text;
  description @1 :Text;
  dueDate @2 :Int64;
  status @3 :Project.MilestoneStatus;
  assigneeId @4 :Text;
}

struct SearchFilters {
  status @0 :List(Project.ProjectStatus);
  priority @1 :List(Project.ProjectPriority);
  tags @2 :List(Text);
  ownerId @3 :Text;
  isPublic @4 :Bool;
  createdAfter @5 :Int64;
  createdBefore @6 :Int64;
}

struct ProjectAnalytics {
  views @0 :Int32;
  activeUsers @1 :Int32;
  totalIdeas @2 :Int32;
  completionRate @3 :Float32;
  averageTimeToComplete @4 :Int64;
  topContributors @5 :List(Contributor);
}

struct Contributor {
  userId @0 :Text;
  contributions @1 :Int32;
  lastActive @2 :Int64;
}

interface EventStream {
  next @0 () -> (event :Event);
  close @1 () -> ();
}

struct Event {
  id @0 :Text;
  timestamp @1 :Int64;
  entityId @2 :Text;
  entityType @3 :EntityType;
  eventType @4 :Text;
  userId @5 :Text;
  data @6 :Data;
  metadata @7 :EventMetadata;
}

enum EntityType {
  user @0;
  project @1;
  idea @2;
  message @3;
  milestone @4;
}

struct EventMetadata {
  version @0 :Int32;
  source @1 :Text;
  correlationId @2 :Text;
  causationId @3 :Text;
}

struct CollaborationEvent {
  type @0 :CollaborationType;
  projectId @1 :Text;
  userId @2 :Text;
  data @3 :Data;
}

enum CollaborationType {
  cursorMove @0;
  selection @1;
  edit @2;
  comment @3;
  presence @4;
}

struct Collaborator {
  userId @0 :Text;
  name @1 :Text;
  avatar @2 :Text;
  status @3 :CollaboratorStatus;
  cursor @4 :CursorPosition;
  selection @5 :SelectionRange;
}

enum CollaboratorStatus {
  active @0;
  idle @1;
  away @2;
}

struct CursorPosition {
  x @0 :Float32;
  y @1 :Float32;
  documentId @2 :Text;
}

struct SelectionRange {
  start @0 :Int32;
  end @1 :Int32;
  documentId @2 :Text;
}

struct Data {
  # Generic data structure for event payloads
  json @0 :Text;
}
