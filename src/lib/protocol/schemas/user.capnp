@0xf1a2b3c4d5e6f708;

using Go = import "../std/go.capnp";
$Go.package("models");
$Go.import("github.com/kodr-pro/backend/internal/models");

# User represents a registered user in the Kodr.pro platform
struct User {
  # Unique identifier for the user
  id @0 :Text;
  
  # User profile information
  name @1 :Text;
  email @2 :Text;
  avatar @3 :Text;  # URL to user's avatar image
  
  # User role in the system
  role @4 :UserRole;
  
  # Authentication information
  authInfo @5 :AuthInfo;
  
  # Audit timestamps
  createdAt @6 :Int64;  # Unix timestamp
  updatedAt @7 :Int64;  # Unix timestamp
  
  # User preferences and settings
  preferences @8 :UserPreferences;
  
  # Status and metadata
  isActive @9 :Bool;
  lastLoginAt @10 :Int64;  # Unix timestamp
  emailVerified @11 :Bool;
}

# User roles with capability-based access control
enum UserRole {
  guest @0;       # Limited read access
  member @1;      # Standard user access
  admin @2;       # Administrative access
  superAdmin @3;  # Full system access
}

# Authentication information supporting multiple auth methods
struct AuthInfo {
  # Primary authentication method
  primaryAuth @0 :PrimaryAuth;
  
  # OAuth providers (optional, multiple allowed)
  oauthProviders @1 :List(OAuthProvider);
  
  # Wallet connections for Web3 auth (optional, multiple allowed)
  walletConnections @2 :List(WalletConnection);
  
  # Password hash (only for email/password auth)
  passwordHash @3 :Text;
  
  # Account security settings
  twoFactorEnabled @4 :Bool;
  recoveryEmail @5 :Text;
}

# Primary authentication method
enum PrimaryAuth {
  email @0;       # Email/password authentication
  oauth @1;       # OAuth-based authentication
  wallet @2;      # Wallet-based authentication
}

# OAuth provider information
struct OAuthProvider {
  provider @0 :OAuthType;
  providerId @1 :Text;      # User ID from the OAuth provider
  email @2 :Text;           # Email from OAuth provider
  refreshToken @3 :Text;    # Encrypted refresh token
  expiresAt @4 :Int64;      # Token expiration timestamp
}

enum OAuthType {
  google @0;
  github @1;
  microsoft @2;
  discord @3;
  slack @4;
}

# Wallet connection for Web3 authentication
struct WalletConnection {
  walletType @0 :WalletType;
  address @1 :Text;         # Wallet address
  chainId @2 :Int32;        # Blockchain chain ID
  signature @3 :Text;       # Verification signature
  nonce @4 :Text;           # Authentication nonce
  connectedAt @5 :Int64;    # Connection timestamp
}

enum WalletType {
  metamask @0;
  walletConnect @1;
  coinbase @2;
  phantom @3;       # For Solana
  ledger @4;
}

# User preferences and settings
struct UserPreferences {
  # UI/UX preferences
  theme @0 :Theme;
  language @1 :Text;        # ISO language code (e.g., "en", "es")
  timezone @2 :Text;        # IANA timezone (e.g., "America/New_York")
  
  # Notification preferences
  emailNotifications @3 :Bool;
  pushNotifications @4 :Bool;
  weeklyDigest @5 :Bool;
  
  # Privacy settings
  profileVisibility @6 :ProfileVisibility;
  dataSharing @7 :Bool;
  analyticsOptIn @8 :Bool;
}

enum Theme {
  light @0;
  dark @1;
  auto @2;          # System preference
}

enum ProfileVisibility {
  public @0;        # Visible to all users
  team @1;          # Visible to team members only
  private @2;       # Only visible to user
}
