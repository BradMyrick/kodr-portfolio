@0xb2c3d4e5f6a70819;

using Go = import "../std/go.capnp";
$Go.package("models");
$Go.import("github.com/kodr-pro/backend/internal/models");

# Idea represents an innovation idea within Kodr.pro
struct Idea {
  # Unique identifier for the idea
  id @0 :Text;
  
  # Basic idea information
  title @1 :Text;
  description @2 :Text;
  summary @3 :Text;          # AI-generated or user-provided summary
  
  # Innovation pipeline tracking
  status @4 :IdeaStatus;
  stage @5 :IdeaStage;
  priority @6 :IdeaPriority;
  
  # Ownership and collaboration
  creatorId @7 :Text;        # User ID of idea creator
  projectId @8 :Text;        # Associated project ID
  assigneeId @9 :Text;       # Current assignee (optional)
  collaborators @10 :List(Text); # User IDs of collaborators
  
  # Content and attachments
  content @11 :IdeaContent;
  attachments @12 :List(IdeaAttachment);
  tags @13 :List(Text);      # Searchable tags
  
  # Innovation metrics
  feasibility @14 :IdeaFeasibility;
  impact @15 :IdeaImpact;
  effort @16 :IdeaEffort;
  
  # AI-powered insights
  aiInsights @17 :AIInsights;
  
  # Feedback and validation
  feedback @18 :List(IdeaFeedback);
  votes @19 :IdeaVotes;
  
  # Timeline and progress
  dueDate @20 :Int64;        # Optional due date (Unix timestamp)
  startDate @21 :Int64;      # When work started
  completedDate @22 :Int64;  # When idea was completed
  
  # Audit and timestamps
  createdAt @23 :Int64;      # Unix timestamp
  updatedAt @24 :Int64;      # Unix timestamp
  lastActivity @25 :Int64;   # Last activity timestamp
  
  # Archival and versioning
  isArchived @26 :Bool;
  version @27 :Int32;        # Schema version for migrations
}

# Idea status in workflow
enum IdeaStatus {
  draft @0;          # Idea being drafted
  submitted @1;      # Submitted for review
  underReview @2;    # Being reviewed/evaluated
  approved @3;       # Approved for development
  inProgress @4;     # Being worked on
  testing @5;        # In testing phase
  completed @6;      # Successfully completed
  rejected @7;       # Rejected after review
  onHold @8;         # Temporarily paused
  cancelled @9;      # Cancelled
}

# Innovation pipeline stages
enum IdeaStage {
  ideation @0;       # Initial idea generation
  validation @1;     # Validating feasibility and market fit
  planning @2;       # Planning implementation
  development @3;    # Active development
  testing @4;        # Testing and validation
  launch @5;         # Launch/deployment
  iteration @6;      # Post-launch iteration
  maintenance @7;    # Ongoing maintenance
}

# Idea priority levels
enum IdeaPriority {
  low @0;
  medium @1;
  high @2;
  critical @3;
}

# Rich content for ideas
struct IdeaContent {
  # Structured content
  problemStatement @0 :Text;  # What problem does this solve?
  solution @1 :Text;          # Proposed solution
  benefits @2 :List(Text);    # Expected benefits
  requirements @3 :List(Text); # Technical/business requirements
  
  # Implementation details
  technicalApproach @4 :Text;
  resources @5 :List(Text);   # Required resources
  timeline @6 :Text;          # Estimated timeline
  
  # Risk assessment
  risks @7 :List(Text);       # Potential risks
  mitigation @8 :List(Text);  # Risk mitigation strategies
  
  # Additional context
  references @9 :List(Text);  # External references/links
  notes @10 :Text;           # Additional notes
}

# File attachments for ideas
struct IdeaAttachment {
  id @0 :Text;
  filename @1 :Text;
  fileType @2 :Text;         # MIME type
  fileSize @3 :Int64;        # File size in bytes
  url @4 :Text;              # Storage URL
  description @5 :Text;      # Optional description
  uploadedBy @6 :Text;       # User ID who uploaded
  uploadedAt @7 :Int64;      # Upload timestamp
}

# Feasibility assessment
struct IdeaFeasibility {
  technical @0 :Float32;     # Technical feasibility (0-10)
  business @1 :Float32;      # Business feasibility (0-10)
  market @2 :Float32;        # Market feasibility (0-10)
  overall @3 :Float32;       # Overall feasibility score
  assessedBy @4 :Text;       # User ID who assessed
  assessedAt @5 :Int64;      # Assessment timestamp
  notes @6 :Text;            # Assessment notes
}

# Impact assessment
struct IdeaImpact {
  revenue @0 :Float32;       # Revenue impact (0-10)
  users @1 :Float32;         # User impact (0-10)
  efficiency @2 :Float32;    # Efficiency impact (0-10)
  innovation @3 :Float32;    # Innovation impact (0-10)
  overall @4 :Float32;       # Overall impact score
  assessedBy @5 :Text;       # User ID who assessed
  assessedAt @6 :Int64;      # Assessment timestamp
  notes @7 :Text;            # Assessment notes
}

# Effort estimation
struct IdeaEffort {
  complexity @0 :Float32;    # Complexity score (0-10)
  timeEstimate @1 :Int32;    # Time estimate in hours
  teamSize @2 :Int32;        # Required team size
  skillLevel @3 :SkillLevel; # Required skill level
  estimatedBy @4 :Text;      # User ID who estimated
  estimatedAt @5 :Int64;     # Estimation timestamp
  notes @6 :Text;            # Estimation notes
}

enum SkillLevel {
  junior @0;
  intermediate @1;
  senior @2;
  expert @3;
}

# AI-powered insights and suggestions
struct AIInsights {
  # Automated analysis
  similarIdeas @0 :List(Text);      # Similar idea IDs
  relatedProjects @1 :List(Text);   # Related project IDs
  suggestedTags @2 :List(Text);     # AI-suggested tags
  
  # Market analysis
  marketTrends @3 :List(Text);      # Relevant market trends
  competitorAnalysis @4 :Text;      # Competitor analysis
  
  # Technical insights
  technicalChallenges @5 :List(Text); # Potential technical challenges
  suggestedApproaches @6 :List(Text); # Suggested technical approaches
  requiredSkills @7 :List(Text);     # Required skills/technologies
  
  # Recommendations
  implementationTips @8 :List(Text); # Implementation recommendations
  resourceRecommendations @9 :List(Text); # Resource recommendations
  
  # Metadata
  generatedAt @10 :Int64;           # When insights were generated
  confidence @11 :Float32;          # AI confidence score (0-1)
  model @12 :Text;                  # AI model used
}

# Feedback on ideas
struct IdeaFeedback {
  id @0 :Text;
  authorId @1 :Text;        # User ID who provided feedback
  type @2 :FeedbackType;
  content @3 :Text;
  rating @4 :Int32;         # Rating (1-5)
  isPublic @5 :Bool;        # Whether feedback is public
  createdAt @6 :Int64;
  updatedAt @7 :Int64;
}

enum FeedbackType {
  general @0;
  technical @1;
  business @2;
  design @3;
  usability @4;
  market @5;
}

# Voting/rating system
struct IdeaVotes {
  upvotes @0 :Int32;
  downvotes @1 :Int32;
  totalVotes @2 :Int32;
  averageRating @3 :Float32;
  voterIds @4 :List(Text);   # User IDs who voted
  lastVoteAt @5 :Int64;      # Last vote timestamp
}
